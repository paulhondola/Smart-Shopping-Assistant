using Logic.DTOs.Auth;
using Logic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController(IAuthService authService, IWebHostEnvironment env) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterUserDto dto)
    {
        try
        {
            var result = await authService.RegisterAsync(dto);
            return CreatedAtAction(nameof(Me), result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginUserDto dto)
    {
        try
        {
            var result = await authService.LoginAsync(dto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserGetDto>> Me()
    {
        var user = await authService.GetCurrentUserAsync();
        return Ok(user);
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<ActionResult<UserGetDto>> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var result = await authService.UpdateProfileAsync(dto);
        return Ok(result);
    }

    // Strict raster-only allowlist. SVG/HTML are excluded intentionally to prevent
    // same-origin XSS via <script> or event attributes in SVG served from this host.
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    // Magic-byte prefixes for each format (first 8-12 bytes of the file).
    // We verify these independently of the client-supplied Content-Type and filename.
    private static readonly (string Ext, byte[] Header, byte[]? SecondaryCheck, int SecondaryOffset)[] MagicBytes =
    [
        (".jpg",  [0xFF, 0xD8, 0xFF],                              null, 0),
        (".jpeg", [0xFF, 0xD8, 0xFF],                              null, 0),
        (".png",  [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], null, 0),
        (".gif",  [0x47, 0x49, 0x46, 0x38],                       null, 0),
        // WebP: RIFF at 0-3, "WEBP" at 8-11
        (".webp", [0x52, 0x49, 0x46, 0x46], [0x57, 0x45, 0x42, 0x50], 8),
    ];

    private static async Task<bool> MatchesMagicBytesAsync(IFormFile file, string ext)
    {
        var entry = MagicBytes.FirstOrDefault(e => e.Ext == ext);
        if (entry == default) return false;

        var buf = new byte[12];
        var read = await file.OpenReadStream().ReadAsync(buf.AsMemory(0, buf.Length));
        if (read < entry.Header.Length) return false;

        if (!buf.Take(entry.Header.Length).SequenceEqual(entry.Header)) return false;

        if (entry.SecondaryCheck is not null)
        {
            var offset = entry.SecondaryOffset;
            if (read < offset + entry.SecondaryCheck.Length) return false;
            if (!buf.Skip(offset).Take(entry.SecondaryCheck.Length).SequenceEqual(entry.SecondaryCheck))
                return false;
        }

        return true;
    }

    [HttpPost("me/avatar")]
    [Authorize]
    public async Task<ActionResult<UserGetDto>> UploadAvatar(IFormFile avatar)
    {
        if (avatar is null || avatar.Length == 0)
            return BadRequest(new { message = "No file provided." });

        const long maxBytes = 2 * 1024 * 1024;
        if (avatar.Length > maxBytes)
            return BadRequest(new { message = "Image must be smaller than 2 MB." });

        var ext = Path.GetExtension(avatar.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { message = "Supported formats: JPG, PNG, WebP, GIF." });

        if (!await MatchesMagicBytesAsync(avatar, ext))
            return BadRequest(new { message = "File content does not match its declared format." });

        // Get old avatar path for cleanup
        var current = await authService.GetCurrentUserAsync();
        var oldAvatarUrl = current.AvatarUrl;

        var fileName = $"{current.Id}_{Guid.NewGuid():N}{ext}";

        var avatarsDir = Path.Combine(env.ContentRootPath, "wwwroot", "avatars");
        Directory.CreateDirectory(avatarsDir);

        var filePath = Path.Combine(avatarsDir, fileName);
        await using (var stream = System.IO.File.Create(filePath))
            await avatar.CopyToAsync(stream);

        var avatarUrl = $"{Request.Scheme}://{Request.Host}/avatars/{fileName}";
        var result = await authService.UpdateAvatarAsync(avatarUrl);

        // Delete old local file if one existed
        if (!string.IsNullOrEmpty(oldAvatarUrl))
        {
            var oldFileName = Path.GetFileName(new Uri(oldAvatarUrl).LocalPath);
            var oldFilePath = Path.Combine(avatarsDir, oldFileName);
            if (System.IO.File.Exists(oldFilePath))
                System.IO.File.Delete(oldFilePath);
        }

        return Ok(result);
    }
}
