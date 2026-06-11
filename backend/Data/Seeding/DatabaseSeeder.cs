using Data.Seeding.Interfaces;

namespace Data.Seeding;

public class DatabaseSeeder(
    UserSeeder userSeeder,
    CategorySeeder categorySeeder,
    ProductSeeder productSeeder,
    PromotionSeeder promotionSeeder,
    CartSeeder cartSeeder
)
{
    public async Task SeedAsync()
    {
        await userSeeder.SeedAsync();
        await categorySeeder.SeedAsync();
        await productSeeder.SeedAsync();
        await promotionSeeder.SeedAsync();
        await cartSeeder.SeedAsync();
    }
}
