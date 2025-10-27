using Microsoft.AspNetCore.Http;
using Modules.Common.Features.Results;

namespace Modules.Common.Features.Results;

public static class CustomResults
{
    public static IResult Problem(Error error)
    {
        return Microsoft.AspNetCore.Http.Results.Problem(
            title: GetTitle(error),
            detail: GetDetail(error),
            type: GetType(error.Type),
            statusCode: GetStatusCode(error.Type),
            extensions: GetErrors(error));

        static string GetTitle(Error error)
        {
            return error.Type switch
            {
                ErrorType.Validation => error.Code,
                ErrorType.Problem => error.Code,
                ErrorType.NotFound => error.Code,
                ErrorType.Conflict => error.Code,
                ErrorType.Unauthorized => error.Code,
                _ => "Server failure"
            };
        }

        static string GetDetail(Error error)
        {
            return error.Type switch
            {
                ErrorType.Validation => error.Description,
                ErrorType.Problem => error.Description,
                ErrorType.NotFound => error.Description,
                ErrorType.Conflict => error.Description,
                ErrorType.Unauthorized => error.Description,
                ErrorType.Failure => error.Description, // TODO maybe delete this 
                _ => "An unexpected error occurred"
            };
        }

        static string GetType(ErrorType errorType)
        {
            return errorType switch
            {
                ErrorType.Validation => "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                ErrorType.Problem => "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                ErrorType.NotFound => "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                ErrorType.Conflict => "https://tools.ietf.org/html/rfc7231#section-6.5.8",
                ErrorType.Unauthorized => "https://tools.ietf.org/html/rfc7235#section-3.1",
                _ => "https://tools.ietf.org/html/rfc7231#section-6.6.1"
            };
        }

        static int GetStatusCode(ErrorType errorType)
        {
            return errorType switch
            {
                ErrorType.Validation or ErrorType.Problem => StatusCodes.Status400BadRequest,
                ErrorType.NotFound => StatusCodes.Status404NotFound,
                ErrorType.Conflict => StatusCodes.Status409Conflict,
                ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
                _ => StatusCodes.Status500InternalServerError
            };
        }

        static Dictionary<string, object?>? GetErrors(Error error)
        {
            if (error is not ValidationError validationError) return null;

            return new Dictionary<string, object?>
            {
                { "errors", validationError.Errors }
            };
        }
    }
}