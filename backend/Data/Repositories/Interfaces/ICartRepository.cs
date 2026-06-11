using Data.Entities;

namespace Data.Repositories.Interfaces;

public interface ICartRepository
{
    Task<Cart> GetOrCreateForUserAsync(int userId, CancellationToken ct = default);

    Task<CartItem?> FindItemAsync(int cartId, int productId, CancellationToken ct = default);
    Task<CartItem?> FindItemByIdAsync(int cartId, int itemId, CancellationToken ct = default);

    Task<CartItem> AddItemAsync(CartItem item, CancellationToken ct = default);
    Task UpdateItemAsync(CartItem item, CancellationToken ct = default);
    Task RemoveItemAsync(CartItem item, CancellationToken ct = default);
    Task ClearAsync(int cartId, CancellationToken ct = default);
}
