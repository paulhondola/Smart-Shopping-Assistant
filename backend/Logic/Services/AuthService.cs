using Data.Entities;
using Data.Entities.Enums;
using Data.Repositories.Interfaces;
using Logic.DTOs.Auth;
using Logic.Services.Interfaces;

namespace Logic.Services;

public class AuthService(
    IUserRepository userRepository,
    IJwtTokenIssuer jwtTokenIssuer,
    ICurrentUserAccessor currentUser
) : IAuthService
{
    public async Task<AuthResponseDto> RegisterAsync(RegisterUserDto dto, CancellationToken ct = default)
    {
        var email = dto.Email.Trim().ToLowerInvariant();

        var existing = await userRepository.FindByEmailAsync(email, ct);
        if (existing is not null)
            throw new InvalidOperationException($"Email '{email}' is already registered.");

        var user = new User
        {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            DisplayName = dto.DisplayName.Trim(),
            Role = UserRole.User,
            CreatedAt = DateTime.UtcNow,
        };

        await userRepository.CreateAsync(user, ct);
        return jwtTokenIssuer.Issue(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginUserDto dto, CancellationToken ct = default)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        var user = await userRepository.FindByEmailAsync(email, ct);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return jwtTokenIssuer.Issue(user);
    }

    public async Task<UserGetDto> GetCurrentUserAsync(CancellationToken ct = default)
    {
        var userId = currentUser.RequireUserId();
        var user = await userRepository.FindByIdAsync(userId, ct)
            ?? throw new InvalidOperationException("Authenticated user not found.");

        return new UserGetDto
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
            Role = user.Role.ToString(),
            AvatarUrl = user.AvatarUrl,
        };
    }

    public async Task<UserGetDto> UpdateProfileAsync(UpdateProfileDto dto, CancellationToken ct = default)
    {
        var userId = currentUser.RequireUserId();
        var user = await userRepository.FindByIdAsync(userId, ct)
            ?? throw new InvalidOperationException("Authenticated user not found.");

        user.DisplayName = dto.DisplayName.Trim();
        await userRepository.UpdateAsync(user, ct);

        return new UserGetDto
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
            Role = user.Role.ToString(),
            AvatarUrl = user.AvatarUrl,
        };
    }

    public async Task<UserGetDto> UpdateAvatarAsync(string avatarUrl, CancellationToken ct = default)
    {
        var userId = currentUser.RequireUserId();
        var user = await userRepository.FindByIdAsync(userId, ct)
            ?? throw new InvalidOperationException("Authenticated user not found.");

        user.AvatarUrl = avatarUrl;
        await userRepository.UpdateAsync(user, ct);

        return new UserGetDto
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
            Role = user.Role.ToString(),
            AvatarUrl = user.AvatarUrl,
        };
    }
}
