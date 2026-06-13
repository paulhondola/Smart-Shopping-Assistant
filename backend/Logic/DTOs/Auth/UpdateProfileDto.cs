using System.ComponentModel.DataAnnotations;

namespace Logic.DTOs.Auth;

public class UpdateProfileDto
{
    [Required, MinLength(1), MaxLength(100)]
    public string DisplayName { get; set; } = null!;
}
