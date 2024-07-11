using Microsoft.EntityFrameworkCore;
using BackEnd.Source.Models;

namespace BackEnd.Source.Contexts
{
    public class TaskDBContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public TaskDBContext(DbContextOptions<TaskDBContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = _configuration.GetConnectionString("TaskDB");
                optionsBuilder.UseNpgsql(connectionString);
            }
        }

        public DbSet<TaskItem> TaskItem { get; set; }
        public DbSet<UserProfile> UserProfile { get; set; }
    }
}