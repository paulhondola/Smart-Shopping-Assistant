using Data.Entities;
using Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories;

public class UserRepository(SmartShoppingAssistantDbContext context) : IUserRepository
{
    public Task<User?> FindByEmailAsync(string email, CancellationToken ct = default) =>
        context.Users.FirstOrDefaultAsync(u => u.Email == email.ToLowerInvariant(), ct);

    public Task<User?> FindByIdAsync(int id, CancellationToken ct = default) =>
        context.Users.FirstOrDefaultAsync(u => u.Id == id, ct);

    public async Task<User> CreateAsync(User user, CancellationToken ct = default)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync(ct);
        return user;
    }

    public async Task<User> UpdateAsync(User user, CancellationToken ct = default)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync(ct);
        return user;
    }
}
