using Microsoft.AspNetCore.Mvc;
using BackEnd.Source.Contexts;
using BackEnd.Source.Models;
using Microsoft.AspNetCore.Identity;
using BackEnd.Source.Security;
using Microsoft.AspNetCore.Authorization;
using BackEnd.Source.Dto;

namespace BackEnd.Source.Controllers
{
    [ApiController]
    [AllowAnonymous]
    public class UserAuthController : ControllerBase
    {
        private readonly TaskDBContext _context;
        private readonly PasswordHasher<UserProfileDto> _passwordHash;

        public UserAuthController(TaskDBContext context)
        {
            _context = context;
            _passwordHash = new PasswordHasher<UserProfileDto>();
        }

        [HttpPost("auth")]
        public ActionResult<dynamic> PostAuth(UserProfileDto model)
        {
            var user = _context.UserProfile.FirstOrDefault(u =>
                u.Username == model.Username
            );

            if (user == null || _passwordHash.VerifyHashedPassword(model, user.PasswordHash, model.Password) != PasswordVerificationResult.Success)
            {
                return NotFound(new { message = "Usuário ou senha inválidos" });
            }

            // generate jwt auth token
            var token = TokenService.GenerateToken(user);

            user.Id = null;
            user.PasswordHash = null;
            return new
            {
                user = user,
                token = token
            };
        }

        [HttpPost("user")]
        public async Task<ActionResult<TaskItem>> PostUser(UserProfileDto model)
        {
            if (_context.UserProfile == null)
            {
                return Problem("Entity set 'TaskDBContext.UserProfile' is null.");
            }

            var currUser = _context.UserProfile.FirstOrDefault(u =>
                u.Username == model.Username
            );

            if (currUser != null)
            {
                return BadRequest("Username already in use.");
            }

            var newUser = new UserProfile
            {
                Username = model.Username,
                PasswordHash = _passwordHash.HashPassword(model, model.Password)
            };

            _context.UserProfile.Add(newUser);
            await _context.SaveChangesAsync();

            newUser.Id = null;
            newUser.PasswordHash = null;
            return CreatedAtAction("PostUser", newUser);
        }
    }
}
