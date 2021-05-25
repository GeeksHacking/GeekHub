using System;

namespace GeekHub.DTOs.ApplicationUser
{
    public class ApplicationUserResponseDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
    }
}