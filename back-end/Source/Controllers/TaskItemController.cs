using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackEnd.Source.Contexts;
using BackEnd.Source.Models;
using Microsoft.AspNetCore.Authorization;
using backEnd.Source.Dto;
using System.Security.Claims;

namespace BackEnd.Source.Controllers
{
    [Authorize]
    [Route("task")]
    [ApiController]
    public class TaskItemController : ControllerBase
    {
        private readonly TaskDBContext _context;

        public TaskItemController(TaskDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<TaskItemDto>> GetTaskItems([FromQuery] string? category, [FromQuery] string? userName)
        {
            if (_context.TaskItem == null)
            {
                return NotFound();
            }

            return _context.TaskItem
                .Include(t => t.UserProfile)
                .Where(t =>
                    (category == null || category == t.Category) &&
                    (userName == null || userName == t.UserProfile.Username)
                ).Select(t => new TaskItemDto()
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted,
                    Category = t.Category,
                    CreatedAt = t.CreatedAt,
                    Username = t.UserProfile.Username
                }).ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<TaskItemDto> GetTaskItem(int id)
        {
            if (_context.TaskItem == null)
            {
                return NotFound();
            }
            var taskItem = _context.TaskItem
                .Include(t => t.UserProfile)
                .FirstOrDefault(t => t.Id == id);

            if (taskItem == null)
            {
                return NotFound();
            }

            return new TaskItemDto()
            {
                Id = taskItem.Id,
                Title = taskItem.Title,
                Description = taskItem.Description,
                IsCompleted = taskItem.IsCompleted,
                Category = taskItem.Category,
                CreatedAt = taskItem.CreatedAt,
                Username = taskItem.UserProfile.Username
            };
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskItem(int id, TaskItemDto taskItem)
        {
            var rawUserId = GetClaim(ClaimTypes.Sid);

            if (rawUserId == null)
            {
                return BadRequest();
            }

            var model = _context.TaskItem.FirstOrDefault(t => t.Id == id);

            if (model == null)
            {
                return BadRequest();
            }

            model.Title = taskItem.Title;
            model.Description = taskItem.Description;
            model.IsCompleted = taskItem.IsCompleted;
            model.Category = taskItem.Category;

            _context.Entry(model).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> PostTaskItem(TaskItemDto taskItem)
        {
            if (_context.TaskItem == null)
            {
                return Problem("Entity set 'TaskDBContext.TaskItem' is null.");
            }

            var rawUserId = GetClaim(ClaimTypes.Sid);

            if (rawUserId == null)
            {
                return BadRequest("Erro paia");
            }

            var model = new TaskItem()
            {
                Title = taskItem.Title,
                Description = taskItem.Description,
                IsCompleted = taskItem.IsCompleted,
                Category = taskItem.Category,
                UserProfileId = Int32.Parse(rawUserId),
            };

            _context.TaskItem.Add(model);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTaskItem", new { id = model.Id }, taskItem);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskItem(int id)
        {
            if (_context.TaskItem == null)
            {
                return NotFound();
            }
            var TaskItem = await _context.TaskItem.FindAsync(id);
            if (TaskItem == null)
            {
                return NotFound();
            }

            _context.TaskItem.Remove(TaskItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaskItemExists(int id)
        {
            return (_context.TaskItem?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private string? GetClaim(string type)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity != null && identity.IsAuthenticated)
            {
                return identity.Claims
                    .Where(c => c.Type == type)
                    .Select(c => c.Value)
                    .SingleOrDefault();
            }

            return null;
        }
    }
}
