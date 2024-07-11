namespace backEnd.Source.Dto
{
    public class TaskItemDto
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public string Category { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? Username { get; set; }
    }
}