using System.ComponentModel.DataAnnotations;

namespace MoodTrackerApi.DTOs;

public class CreateMoodEntryDto
{
    [Required]
    public string MoodType { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Note { get; set; }
}
