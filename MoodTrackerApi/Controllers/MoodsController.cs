using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoodTrackerApi.Data;
using MoodTrackerApi.DTOs;
using MoodTrackerApi.Models;

namespace MoodTrackerApi.Controllers;

[ApiController]
[Route("api/moods")]
[Authorize]
public class MoodsController : ControllerBase
{
    private static readonly HashSet<string> ValidMoodTypes =
        new(StringComparer.Ordinal) { "Happy", "Neutral", "Sad" };

    private readonly AppDbContext _db;

    public MoodsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateMoodEntry([FromBody] CreateMoodEntryDto dto)
    {
        if (!ValidMoodTypes.Contains(dto.MoodType))
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid MoodType",
                Detail = "MoodType must be one of: Happy, Neutral, Sad.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        int userId = GetUserIdFromClaims();

        var entry = new MoodEntry
        {
            UserId = userId,
            MoodType = dto.MoodType,
            TimestampUtc = DateTime.UtcNow,
            Note = dto.Note
        };

        _db.MoodEntries.Add(entry);
        await _db.SaveChangesAsync();

        var response = new MoodEntryResponseDto
        {
            Id = entry.Id,
            MoodType = entry.MoodType,
            TimestampUtc = entry.TimestampUtc,
            Note = entry.Note
        };

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpGet("recent")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetRecentEntries()
    {
        int userId = GetUserIdFromClaims();

        var entries = await _db.MoodEntries
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.TimestampUtc)
            .Take(100)
            .Select(e => new MoodEntryResponseDto
            {
                Id = e.Id,
                MoodType = e.MoodType,
                TimestampUtc = e.TimestampUtc,
                Note = e.Note
            })
            .ToListAsync();

        return Ok(entries);
    }

    private int GetUserIdFromClaims()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("UserId claim is missing from the token.");

        return int.Parse(userIdClaim);
    }
}
