using Data.Entities;
using Data.Entities.Enums;

namespace Data.Seeding;

public class UserSeeder(SmartShoppingAssistantDbContext context) : Interfaces.IEntitySeeder
{
    public async Task SeedAsync()
    {
        if (context.Users.Any())
            return;

        var now = DateTime.UtcNow;

        var users = new List<User>
        {
            new()
            {
                Email = "demo@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo123!"),
                DisplayName = "Demo User",
                Role = UserRole.User,
                CreatedAt = now,
            },
            new()
            {
                Email = "admin@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                DisplayName = "Admin",
                Role = UserRole.Admin,
                CreatedAt = now,
            },
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();
    }
}
