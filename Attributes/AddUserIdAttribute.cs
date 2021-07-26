using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GeekHub.Attributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class AddUserIdAttribute : Attribute, IResourceFilter
    {
        public void OnResourceExecuting(ResourceExecutingContext context)
        {
            var userId = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new UnauthorizedAccessException();
            }

            var validId = Guid.TryParse(userId, out var userGuid);
            if (!validId)
            {
                throw new UnauthorizedAccessException();
            }

            context.HttpContext.Items["UserId"] = userGuid;
        }

        public void OnResourceExecuted(ResourceExecutedContext context)
        {
        }
    }
}