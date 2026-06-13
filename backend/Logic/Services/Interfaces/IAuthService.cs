using Logic.DTOs.Auth;

namespace Logic.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterUserDto dto, CancellationToken ct = default);
    Task<AuthResponseDto> LoginAsync(LoginUserDto dto, CancellationToken ct = default);
    Task<UserGetDto> GetCurrentUserAsync(CancellationToken ct = default);
    Task<UserGetDto> UpdateProfileAsync(UpdateProfileDto dto, CancellationToken ct = default);
    Task<UserGetDto> UpdateAvatarAsync(string avatarUrl, CancellationToken ct = default);
}
