using Microsoft.AspNetCore.Http;
using Modules.Common.Features.Results;

namespace Modules.Common.Features.Results;

public static class CustomResults
{
    public static IResult Problem(Error error)
    {
        
        return error;
    }
}