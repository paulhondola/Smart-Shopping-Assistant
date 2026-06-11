using Data.Entities;
using Data.Seeding.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Data.Seeding;

public class CartSeeder(SmartShoppingAssistantDbContext context) : IEntitySeeder
{
    private static readonly string[] ProductNames =
    [
        "AMD Ryzen 9 7950X",
        "ASUS ROG Strix X670E-E Gaming WiFi",
        "Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz",
        "Samsung 990 Pro 2TB NVMe SSD",
        "NVIDIA GeForce RTX 4090 24GB",
        "Corsair RM1000x 1000W 80+ Gold",
        "Lian Li O11 Dynamic EVO",
        "NZXT Kraken Z73 RGB 360mm AIO",
        "LG 27GN950-B UltraGear 4K 144Hz",
        "Corsair K100 RGB Mechanical",
        "Razer DeathAdder V3 Pro",
        "SteelSeries Arctis Nova Pro Wireless",
    ];

    public async Task SeedAsync()
    {
        if (context.Carts.Any())
            return;

        var demoUser = context.Users.FirstOrDefault(u => u.Email == "demo@example.com")
            ?? throw new InvalidOperationException("Demo user not found. Run UserSeeder first.");

        var prods = await context.Products
            .Where(p => ProductNames.Contains(p.Name))
            .ToDictionaryAsync(p => p.Name);

        var now = DateTime.UtcNow;
        var cart = new Cart { UserId = demoUser.Id, CreatedAt = now, UpdatedAt = now };
        context.Carts.Add(cart);
        await context.SaveChangesAsync();

        var cartItems = prods.Values
            .Select(p => new CartItem
            {
                CartId = cart.Id,
                ProductId = p.Id,
                Quantity = p.Name.Contains("DDR5") ? 2 : 1,
            })
            .ToList();

        await context.CartItems.AddRangeAsync(cartItems);
        await context.SaveChangesAsync();
    }
}
