using Data.Entities;
using Data.Seeding.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Data.Seeding;

public class CartSeeder(SmartShoppingAssistantDbContext context) : IEntitySeeder
{
    public async Task SeedAsync()
    {
        if (context.Carts.Any())
            return;

        var demoUser = context.Users.FirstOrDefault(u => u.Email == "demo@example.com")
            ?? throw new InvalidOperationException("Demo user not found. Run UserSeeder first.");

        var prods = await context.Products.ToDictionaryAsync(p => p.Name);

        var now = DateTime.UtcNow;
        var cart = new Cart
        {
            UserId = demoUser.Id,
            CreatedAt = now,
            UpdatedAt = now,
        };

        context.Carts.Add(cart);
        await context.SaveChangesAsync();

        var cartItems = new List<CartItem>
        {
            new() { CartId = cart.Id, ProductId = prods["AMD Ryzen 9 7950X"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["ASUS ROG Strix X670E-E Gaming WiFi"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz"].Id, Quantity = 2 },
            new() { CartId = cart.Id, ProductId = prods["Samsung 990 Pro 2TB NVMe SSD"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["NVIDIA GeForce RTX 4090 24GB"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["Corsair RM1000x 1000W 80+ Gold"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["Lian Li O11 Dynamic EVO"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["NZXT Kraken Z73 RGB 360mm AIO"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["LG 27GN950-B UltraGear 4K 144Hz"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["Corsair K100 RGB Mechanical"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["Razer DeathAdder V3 Pro"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["SteelSeries Arctis Nova Pro Wireless"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["Razer Kiyo Pro Streaming Camera"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["HyperX QuadCast S USB Microphone"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["Meta Quest 3 256GB VR Headset"].Id, Quantity = 1 },
            new() { CartId = cart.Id, ProductId = prods["Elgato Cam Link 4K Capture Device"].Id, Quantity = 1 },
        };

        await context.CartItems.AddRangeAsync(cartItems);
        await context.SaveChangesAsync();
    }
}
