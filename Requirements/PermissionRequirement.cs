using Microsoft.AspNetCore.Authorization;

using GeekHub.Models;

namespace GeekHub.Requirements
{
    public class PermissionRequirement: IAuthorizationRequirement
    {
        public Permission Permission { get; }

        public PermissionRequirement(Permission permission)
        {
            Permission = permission;
        }
    }
}