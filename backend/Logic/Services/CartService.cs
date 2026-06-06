using System.Text.Json;
using Microsoft.Agents.AI.Workflows;
using Microsoft.Extensions.AI;
using Logic.Agents;
using Logic.DTOs;
using Logic.Models;
using Logic.Services.Interfaces;
using Data.Entities;
using Data.Entities.Enums;
using Data.Repositories;
using Data.Repositories.Interfaces;
using Logic.Agents.Interfaces;
using Logic.DTOs.Cart;

namespace Logic.Services;

public class CartService(
    ICartRepository cartItemRepository,
    IProductRepository productRepository,
    ICategoryRepository categoryRepository,
    IPromotionRepository promotionRepository,
    IPromotionCheckerAgent promotionCheckerAgent,
    ISuggestionComposerAgent suggestionComposerAgent
) : ICartService
{
    public async Task<CartGetDto> GetCartAsync()
    {
        var items = await cartItemRepository.GetAllWithProductAsync();
        var mappedItems = items.Select(MapToDto).ToList();
        var subtotal = mappedItems.Sum(i => i.Subtotal);

        var allPromotions = await promotionRepository.GetAllAsync();
        var applied = ComputeAppliedPromotions(items, subtotal, allPromotions.Where(p => p.IsActive));
        var totalDiscount = applied.Sum(p => p.Discount);

        return new CartGetDto
        {
            Items = mappedItems,
            Subtotal = subtotal,
            AppliedPromotions = applied,
            TotalDiscount = totalDiscount,
            Total = Math.Max(0, subtotal - totalDiscount),
        };
    }

    private static List<AppliedPromotionDto> ComputeAppliedPromotions(
        List<Cart> items, decimal subtotal, IEnumerable<Promotion> promotions)
    {
        var result = new List<AppliedPromotionDto>();

        foreach (var promo in promotions)
        {
            decimal discount = 0;

            switch (promo.Type)
            {
                case PromotionType.Quantity when promo.ProductId.HasValue:
                {
                    var item = items.FirstOrDefault(i => i.ProductId == promo.ProductId.Value);
                    if (item == null || item.Quantity < (int)promo.Threshold) continue;
                    discount = promo.Reward == PromotionReward.PercentDiscount
                        ? item.Product.Price * item.Quantity * promo.RewardValue / 100m
                        : item.Product.Price * promo.RewardValue;
                    break;
                }
                case PromotionType.Quantity when promo.CategoryId.HasValue:
                {
                    var catItems = items
                        .Where(i => i.Product.Categories.Any(c => c.Id == promo.CategoryId.Value))
                        .ToList();
                    if (catItems.Sum(i => i.Quantity) < (int)promo.Threshold) continue;
                    discount = promo.Reward == PromotionReward.PercentDiscount
                        ? catItems.Sum(i => i.Product.Price * i.Quantity) * promo.RewardValue / 100m
                        : catItems.Min(i => i.Product.Price) * promo.RewardValue;
                    break;
                }
                case PromotionType.CartTotal when promo.CategoryId.HasValue:
                {
                    var catItems = items
                        .Where(i => i.Product.Categories.Any(c => c.Id == promo.CategoryId.Value))
                        .ToList();
                    var catTotal = catItems.Sum(i => i.Product.Price * i.Quantity);
                    if (catTotal < promo.Threshold) continue;
                    discount = catTotal * promo.RewardValue / 100m;
                    break;
                }
                case PromotionType.CartTotal when promo.ProductId.HasValue:
                {
                    if (subtotal < promo.Threshold || items.All(i => i.ProductId != promo.ProductId.Value)) continue;
                    discount = subtotal * promo.RewardValue / 100m;
                    break;
                }
                case PromotionType.CartTotal:
                {
                    if (subtotal < promo.Threshold) continue;
                    discount = subtotal * promo.RewardValue / 100m;
                    break;
                }
                default:
                    continue;
            }

            if (discount > 0)
                result.Add(new AppliedPromotionDto(promo.Id, promo.Name, Math.Round(discount, 2)));
        }

        return result;
    }

    public async Task<CartItemGetDto> AddItemAsync(AddCartItemDto dto)
    {
        await productRepository.GetByIdAsync(dto.ProductId); // throws if not found

        var existing = await cartItemRepository.GetByProductIdAsync(dto.ProductId);
        if (existing != null)
        {
            existing.Quantity += dto.Quantity;
            await cartItemRepository.UpdateAsync(existing);
            return MapToDto(existing);
        }

        var item = new Cart { ProductId = dto.ProductId, Quantity = dto.Quantity };
        await cartItemRepository.AddAsync(item);
        var added = await cartItemRepository.GetByIdWithProductAsync(item.Id);
        return MapToDto(added);
    }

    public async Task<CartItemGetDto> UpdateItemAsync(int itemId, UpdateCartItemDto dto)
    {
        var item = await cartItemRepository.GetByIdWithProductAsync(itemId);
        item.Quantity = dto.Quantity;
        await cartItemRepository.UpdateAsync(item);
        return MapToDto(item);
    }

    public Task RemoveItemAsync(int itemId) => cartItemRepository.DeleteAsync(itemId);

    public Task ClearCartAsync() => cartItemRepository.ClearAsync();

    public async Task<AnalysisResponse> AnalyzeCartAsync()
    {
        var cart = await cartItemRepository.GetAllWithProductAsync();
        var categories = await categoryRepository.GetAllAsync();

        var cartJson = JsonSerializer.Serialize(
            cart.Select(c => new
            {
                c.ProductId,
                ProductName = c.Product.Name,
                c.Product.Price,
                c.Quantity,
                LineTotal = c.Product.Price * c.Quantity,
                Categories = c
                    .Product.Categories.Select(cat => new
                    {
                        CategoryId = cat.Id,
                        CategoryName = cat.Name,
                    })
                    .ToList(),
            })
        );

        var categoryJson = JsonSerializer.Serialize(
            categories.Select(c => new { CategoryId = c.Id, CategoryName = c.Name })
        );

        var promotionAgent = promotionCheckerAgent.Build(cartJson);
        var suggestionAgent = suggestionComposerAgent.Build(cartJson, categoryJson);

        var workflow = new WorkflowBuilder(promotionAgent)
            .AddEdge(promotionAgent, suggestionAgent)
            .WithOutputFrom(suggestionAgent)
            .Build();

        var chatMessage = new List<ChatMessage>
        {
            new(ChatRole.User, "Analyze the cart and suggest improvements."),
        };

        await using var result = await InProcessExecution.RunStreamingAsync(workflow, chatMessage);
        await result.TrySendMessageAsync(new TurnToken(emitEvents: true));

        var jsonBuilder = new System.Text.StringBuilder();

        await foreach (var message in result.WatchStreamAsync())
        {
            if (
                message is AgentResponseUpdateEvent update
                && update.ExecutorId.StartsWith("SuggestionComposer")
            )
            {
                jsonBuilder.Append(update.Update.Text);
            }
            else if (message is WorkflowErrorEvent errorEvent)
            {
                throw new InvalidOperationException(errorEvent.Exception?.Message);
            }
        }

        var json = jsonBuilder.ToString();
        return JsonSerializer.Deserialize<AnalysisResponse>(json)
            ?? throw new InvalidOperationException("Failed to deserialize analysis response.");
    }

    private static CartItemGetDto MapToDto(Cart ci) =>
        new()
        {
            Id = ci.Id,
            ProductId = ci.ProductId,
            ProductName = ci.Product.Name,
            UnitPrice = ci.Product.Price,
            Quantity = ci.Quantity,
            Subtotal = ci.Product.Price * ci.Quantity,
        };
}
