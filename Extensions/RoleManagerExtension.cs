using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

using GeekHub.Models;

namespace GeekHub.Extensions
{
    public static class RoleManagerExtension
    {
        public static async Task CreateDefaultRoles(this RoleManager<ApplicationRole> roleManager, Project project)
        {
            await CreateOwnerRole(roleManager, project);
            await CreateCollaboratorRole(roleManager, project);
        }

        public static async Task CreateOwnerRole(this RoleManager<ApplicationRole> roleManager, Project project)
        {
            await roleManager.CreateAsync(new ApplicationRole
            {
                Name = $"Projects/{project.Id.ToString()}/{RoleType.Owner.ToString()}",
                Project = project,
                RoleType = RoleType.Owner
            });
            var owner = await roleManager.FindByNameAsync($"Projects/{project.Id.ToString()}/Owner");
            await roleManager.AddOwnerPermissionClaims(owner);
        }

        public static async Task CreateCollaboratorRole(this RoleManager<ApplicationRole> roleManager, Project project)
        {
            await roleManager.CreateAsync(new ApplicationRole
            {
                Name = $"Projects/{project.Id.ToString()}/{RoleType.Collaborator.ToString()}",
                Project = project,
                RoleType = RoleType.Collaborator
            });
            var collaborator = await roleManager.FindByNameAsync($"Projects/{project.Id.ToString()}/Collaborator");
            await roleManager.AddCollaboratorPermissionClaims(collaborator);
        }
    }
}