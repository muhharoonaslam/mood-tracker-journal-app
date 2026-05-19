using Microsoft.EntityFrameworkCore;
using MoodTrackerApi.Models;

namespace MoodTrackerApi.Data;

public class DatabaseSeeder : IHostedService
{
    private readonly IServiceProvider _services;

    public DatabaseSeeder(IServiceProvider services) => _services = services;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var email = "test@example.com";
        if (!await db.Users.AnyAsync(u => u.Email == email, cancellationToken))
        {
            db.Users.Add(new User
            {
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                CreatedAtUtc = DateTime.UtcNow
            });
            await db.SaveChangesAsync(cancellationToken);
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
