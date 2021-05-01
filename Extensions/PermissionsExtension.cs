using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

using GeekHub.Models;

namespace GeekHub.Extensions
{
    public static class PermissionsExtension
    {
        public static async Task AddOwnerPermissionClaims(this RoleManager<ApplicationRole> roleManager,
            ApplicationRole role)
        {
            foreach (Permission permission in Enum.GetValues(typeof(Permission)))
            {
                await roleManager.AddClaimAsync(role, new Claim(CustomClaimTypes.Permission, permission.ToString()));
            }
        }

        public static async Task AddCollaboratorPermissionClaims(this RoleManager<ApplicationRole> roleManager,
            ApplicationRole role)
        {
            var permissions = new List<Permission>
            {
                Permission.CreateTask,
                Permission.UpdateTask
            };
            
            foreach (var permission in permissions)
            {
                await roleManager.AddClaimAsync(role, new Claim(CustomClaimTypes.Permission, permission.ToString()));
            }
        }
    }
}