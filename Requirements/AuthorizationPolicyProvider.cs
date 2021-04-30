using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

using GeekHub.Models;

namespace GeekHub.Requirements
{
    public class AuthorizationPolicyProvider : DefaultAuthorizationPolicyProvider
    {
        private readonly AuthorizationOptions _options;

        public AuthorizationPolicyProvider(IOptions<AuthorizationOptions> options) : base(options)
        {
            _options = options.Value;
        }

        public override async Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
        {
            var policy = await base.GetPolicyAsync(policyName);
            if (policy != null) return policy;

            if (!Enum.TryParse(policyName, out Permission permission))
                throw new Exception("Could not resolve permission policy");

            policy = new AuthorizationPolicyBuilder()
                .AddRequirements(new HasPermissionRequirement(permission))
                .Build();

            _options.AddPolicy(policyName, policy);

            return policy;
        }
    }
}