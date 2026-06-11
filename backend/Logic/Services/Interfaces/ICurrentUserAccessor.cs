namespace Logic.Services.Interfaces;

public interface ICurrentUserAccessor
{
    int? UserId { get; }
    int RequireUserId();
}
