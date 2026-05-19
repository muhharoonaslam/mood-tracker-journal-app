namespace MoodTrackerApi.Models;

public class MoodEntry
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string MoodType { get; set; } = string.Empty; // Happy, Neutral, Sad
    public DateTime TimestampUtc { get; set; }
    public string? Note { get; set; }
}
