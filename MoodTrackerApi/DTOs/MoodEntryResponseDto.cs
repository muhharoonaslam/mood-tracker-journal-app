namespace MoodTrackerApi.DTOs;

public class MoodEntryResponseDto
{
    public int Id { get; set; }
    public string MoodType { get; set; } = string.Empty;
    public DateTime TimestampUtc { get; set; }
    public string? Note { get; set; }
}
