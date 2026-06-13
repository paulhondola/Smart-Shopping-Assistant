using Api.Auth;
using Api.Options;
using Microsoft.Extensions.FileProviders;
using Data;
using Data.Repositories;
using Data.Repositories.Interfaces;
using Data.Seeding;
using Logic.Agents;
using Logic.Agents.Interfaces;
using Logic.Services;
using Logic.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
using Microsoft.IdentityModel.Tokens;
using OpenAI;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("SmartShoppingAssistantContext");

builder.Services.AddDbContext<SmartShoppingAssistantDbContext>(options =>
    options.UseNpgsql(
        connectionString
            ?? throw new InvalidOperationException(
                "Connection string 'SmartShoppingAssistantContext' is not configured."
            ),
        npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "smart_shopping_assistant")
    )
);

builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// ── JWT auth ──────────────────────────────────────────────────────────────────
var jwtSection = builder.Configuration.GetSection(JwtOptions.SectionName);
builder.Services.Configure<JwtOptions>(jwtSection);
builder.Services.Configure<JwtTokenIssuerOptions>(jwtSection);

var jwtOpts = jwtSection.Get<JwtOptions>();

if (jwtOpts is not null)
{
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidIssuer = jwtOpts.Issuer,
                ValidAudience = jwtOpts.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Convert.FromBase64String(jwtOpts.SigningKey)
                ),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.FromSeconds(30),
            };
        });
}
else
{
    builder.Services.AddAuthentication();
}

builder.Services.AddAuthorization();
// ─────────────────────────────────────────────────────────────────────────────

// ── Repositories ─────────────────────────────────────────────────────────────
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IPromotionRepository, PromotionRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
// ─────────────────────────────────────────────────────────────────────────────

builder.Services.AddScoped<ICurrentUserAccessor, CurrentUserAccessor>();

// ── Services ──────────────────────────────────────────────────────────────────
builder.Services.AddScoped<IJwtTokenIssuer, JwtTokenIssuer>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IPromotionService, PromotionService>();
builder.Services.AddScoped<ICartService, CartService>();
// ─────────────────────────────────────────────────────────────────────────────

var openAi =
    builder.Configuration.GetSection(OpenAiOptions.SectionName).Get<OpenAiOptions>()
    ?? new OpenAiOptions();

builder.Services.Configure<OpenAiOptions>(
    builder.Configuration.GetSection(OpenAiOptions.SectionName)
);

if (openAi.IsConfigured)
{
    builder.Services.AddSingleton(
        new OpenAIClient(openAi.ApiKey!)
            .GetChatClient(openAi.ModelId)
            .AsIChatClient()
            .AsBuilder()
            .UseFunctionInvocation()
            .Build()
    );

    builder.Services.AddScoped<IPromotionCheckerAgent, PromotionCheckerAgent>();
    builder.Services.AddScoped<ISuggestionComposerAgent, SuggestionComposerAgent>();
}
else
{
    builder.Services.AddScoped<IPromotionCheckerAgent, UnavailablePromotionCheckerAgent>();
    builder.Services.AddScoped<ISuggestionComposerAgent, UnavailableSuggestionComposerAgent>();
}

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "FrontendOrigin",
        corsPolicyBuilder =>
        {
            corsPolicyBuilder
                .WithOrigins(
                    builder.Configuration["Cors:FrontendOrigin"] ?? "http://localhost:5173"
                )
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
    );
});

builder.Services.AddScoped<UserSeeder>();
builder.Services.AddScoped<CategorySeeder>();
builder.Services.AddScoped<ProductSeeder>();
builder.Services.AddScoped<PromotionSeeder>();
builder.Services.AddScoped<CartSeeder>();
builder.Services.AddScoped<DatabaseSeeder>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
        options.SwaggerEndpoint("/openapi/v1.json", "SmartShoppingAssistant API v1")
    );
}

app.UseCors("FrontendOrigin");

app.UseHttpsRedirection();

var wwwrootPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(Path.Combine(wwwrootPath, "avatars"));
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(wwwrootPath),
    RequestPath = "",
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
