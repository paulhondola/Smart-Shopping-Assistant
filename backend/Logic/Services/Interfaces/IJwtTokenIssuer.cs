using Data.Entities;
using Logic.DTOs.Auth;

namespace Logic.Services.Interfaces;

public interface IJwtTokenIssuer
{
    AuthResponseDto Issue(User user);
}
