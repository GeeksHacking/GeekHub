using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace GeekHub.Attributes
{
    public class GithubRepositoryAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            // Only validate if user provides a value, else return vacuously true 
            if (value is null) return ValidationResult.Success;

            if (!Uri.TryCreate(value.ToString(), UriKind.Absolute, out var uri))
                return new ValidationResult("Invalid Url");

            if (uri.Host != "github.com") return new ValidationResult("The repository can only be hosted on GitHub");

            if (!Regex.Match(uri.LocalPath, @"(\/\S+){2}").Success)
                return new ValidationResult(
                    "The repository path is not valid");

            return ValidationResult.Success;
        }
    }
}