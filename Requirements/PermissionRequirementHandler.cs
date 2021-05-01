using System;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using GeekHub.Data;
using GeekHub.Models;

namespace GeekHub.Requirements
{
    public class PermissionRequirementHandler : AuthorizationHandler<PermissionRequirement, Project>
    {
        private readonly ApplicationDbContext _dbContext;

        public PermissionRequirementHandler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
            PermissionRequirement requirement,
            Project resource)
        {
            var validUserId = Guid.TryParse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId);
            if (!validUserId) throw new UnauthorizedAccessException();

            // First we get all the user role joins for the user
            var userRoles = await _dbContext.UserRoles.Where(ur => ur.UserId == userId).Select(ur => ur.RoleId)
                .ToListAsync();
            // Then we get the role and filter to only include for the project
            var roles = await _dbContext.Roles
                .Where(r => userRoles.Contains(r.Id) && r.ProjectId == resource.Id).Select(r => r.Id).ToListAsync();

            // Then we check if they have the required claim
            var hasClaim = await _dbContext.RoleClaims.Where(rc =>
                roles.Contains(rc.RoleId) && rc.ClaimType == CustomClaimTypes.Permission &&
                rc.ClaimValue == requirement.Permission.ToString()).SingleOrDefaultAsync();

            if (hasClaim != default(IdentityRoleClaim<Guid>)) context.Succeed(requirement);
        }
    }
}