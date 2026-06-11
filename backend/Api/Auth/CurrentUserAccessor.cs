using System.Security.Claims;
using Logic.Services.Interfaces;

namespace Api.Auth;

public class CurrentUserAccessor(IHttpContextAccessor httpContextAccessor) : ICurrentUserAccessor
{
    public int? UserId
    {
        get
        {
            var claim = httpContextAccessor.HttpContext?.User
                .FindFirstValue(ClaimTypes.NameIdentifier);
            return claim is not null && int.TryParse(claim, out var id) ? id : null;
        }
    }

    public int RequireUserId() =>
        UserId ?? throw new UnauthorizedAccessException("User is not authenticated.");
}
