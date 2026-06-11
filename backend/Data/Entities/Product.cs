namespace Data.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }

    public ICollection<CartItem> CartItems { get; set; } = [];
    public ICollection<Category> Categories { get; set; } = [];
    public ICollection<Promotion> Promotions { get; set; } = [];
}
