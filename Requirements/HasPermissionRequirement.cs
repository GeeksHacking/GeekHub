using Microsoft.AspNetCore.Authorization;

using GeekHub.Models;

namespace GeekHub.Requirements
{
    public class HasPermissionRequirement: IAuthorizationRequirement
    {
        public Permission Permission { get; }

        public HasPermissionRequirement(Permission permission)
        {
            Permission = permission;
        }
    }
}