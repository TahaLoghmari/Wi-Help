using Microsoft.AspNetCore.Http;
using Modules.Identity.Domain.DTOs;

namespace Modules.Identity.Domain.Services;

public interface IAuthCookies
{
    void AddCookies(HttpResponse response, AccessTokensDto accessTokens);
    void RemoveCookies(HttpResponse response);
}
