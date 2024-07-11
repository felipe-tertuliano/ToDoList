using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Source.Models
{
    public class TaskItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }
        public string? Description { get; set; }

        [Required]
        public bool IsCompleted { get; set; }

        [Required]
        public string Category { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreatedAt { get; set; }

        public int UserProfileId { get; set; }

        public UserProfile UserProfile { get; set; }
    }
}