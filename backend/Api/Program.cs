using Api.Auth;
using Api.Options;
using Data;
using Data.Repositories;
using Data.Repositories.Interfaces;
using Data.Seeding;
using Logic.Agents;
using Logic.Agents.Interfaces;
using Logic.Services;
using Logic.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
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

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IPromotionRepository, PromotionRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();

builder.Services.AddScoped<ICurrentUserAccessor, CurrentUserAccessor>();

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IPromotionService, PromotionService>();
builder.Services.AddScoped<ICartService, CartService>();

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
        "AllowAnyOrigin",
        corsPolicyBuilder =>
        {
            corsPolicyBuilder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
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

app.UseCors("AllowAnyOrigin");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
