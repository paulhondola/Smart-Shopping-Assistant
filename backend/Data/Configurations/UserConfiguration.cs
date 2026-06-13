using Data.Entities;
using Data.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email).IsRequired().HasMaxLength(320);
        builder.Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);
        builder.Property(u => u.DisplayName).IsRequired().HasMaxLength(100);
        builder.Property(u => u.CreatedAt).IsRequired();
        builder.Property(u => u.AvatarUrl).HasMaxLength(500);

        builder.Property(u => u.Role)
            .HasConversion<string>()
            .IsRequired();

        builder.HasIndex(u => u.Email).IsUnique();
    }
}
