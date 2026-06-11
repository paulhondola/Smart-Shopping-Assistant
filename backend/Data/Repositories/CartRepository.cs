using Data.Entities;
using Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories;

public class CartRepository(SmartShoppingAssistantDbContext context) : ICartRepository
{
    private IQueryable<Cart> WithItems() =>
        context.Carts
            .Include(c => c.Items)
            .ThenInclude(ci => ci.Product)
            .ThenInclude(p => p.Categories);

    public async Task<Cart> GetOrCreateForUserAsync(int userId, CancellationToken ct = default)
    {
        var cart = await WithItems().FirstOrDefaultAsync(c => c.UserId == userId, ct);
        if (cart is not null)
            return cart;

        var now = DateTime.UtcNow;
        cart = new Cart { UserId = userId, CreatedAt = now, UpdatedAt = now };
        context.Carts.Add(cart);
        await context.SaveChangesAsync(ct);

        return await WithItems().FirstAsync(c => c.Id == cart.Id, ct);
    }

    public Task<CartItem?> FindItemAsync(int cartId, int productId, CancellationToken ct = default) =>
        context.CartItems
            .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId, ct);

    public Task<CartItem?> FindItemByIdAsync(int cartId, int itemId, CancellationToken ct = default) =>
        context.CartItems
            .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.Id == itemId, ct);

    public async Task<CartItem> AddItemAsync(CartItem item, CancellationToken ct = default)
    {
        context.CartItems.Add(item);
        await context.SaveChangesAsync(ct);
        return item;
    }

    public async Task UpdateItemAsync(CartItem item, CancellationToken ct = default)
    {
        context.CartItems.Update(item);
        await context.SaveChangesAsync(ct);
    }

    public async Task RemoveItemAsync(CartItem item, CancellationToken ct = default)
    {
        context.CartItems.Remove(item);
        await context.SaveChangesAsync(ct);
    }

    public async Task ClearAsync(int cartId, CancellationToken ct = default)
    {
        var items = await context.CartItems
            .Where(ci => ci.CartId == cartId)
            .ToListAsync(ct);
        context.CartItems.RemoveRange(items);
        await context.SaveChangesAsync(ct);
    }
}
