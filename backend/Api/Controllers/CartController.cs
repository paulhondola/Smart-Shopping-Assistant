using Logic.DTOs.Cart;
using Logic.Models;
using Logic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/cart")]
[ApiController]
[Authorize]
public class CartController(ICartService cartService)
    : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<CartGetDto>> GetCart()
    {
        var cart = await cartService.GetCartAsync();
        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<ActionResult<CartItemGetDto>> AddItem([FromBody] AddCartItemDto dto)
    {
        try
        {
            var item = await cartService.AddItemAsync(dto);
            return Ok(item);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("items/{itemId}")]
    public async Task<ActionResult<CartItemGetDto>> UpdateItem(
        int itemId,
        [FromBody] UpdateCartItemDto dto
    )
    {
        try
        {
            var item = await cartService.UpdateItemAsync(itemId, dto);
            return Ok(item);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("items/{itemId}")]
    public async Task<IActionResult> RemoveItem(int itemId)
    {
        try
        {
            await cartService.RemoveItemAsync(itemId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        await cartService.ClearCartAsync();
        return NoContent();
    }

    [HttpGet("analyze")]
    public async Task<IActionResult> AnalyzeCart()
    {
        var analysisResponse = await cartService.AnalyzeCartAsync();
        return Ok(analysisResponse);
    }
}
