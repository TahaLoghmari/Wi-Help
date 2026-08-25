using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Modules.Identity.Domain.Entities;

namespace backend.Host.IntegrationTests;

[Collection(nameof(HostIntegrationCollection))]
public sealed class MessagingEndpointsTests(IntegrationTestWebApplicationFactory factory)
{
    private const string Password = "Test@123456";

    [Fact]
    public async Task AuthenticatedUser_CanCreateConversationAndSendMessageToExistingUser()
    {
        var users = await CreateUsersAsync(factory);
        using var client = factory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer", await LoginAsync(client, users.Authenticated.Email));

        var createConversationResponse = await client.PostAsJsonAsync("/messaging/conversations", new
        {
            Participant1Id = users.Authenticated.Id,
            Participant2Id = users.Recipient.Id
        });

        createConversationResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var conversation = await createConversationResponse.Content.ReadFromJsonAsync<ConversationResponse>();
        conversation.Should().NotBeNull();
        conversation!.ConversationId.Should().NotBeEmpty();

        var sendMessageResponse = await client.PostAsJsonAsync(
            $"/messaging/conversations/{conversation.ConversationId}/messages",
            new { Content = "Integration test message" });

        sendMessageResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var message = await sendMessageResponse.Content.ReadFromJsonAsync<MessageResponse>();
        message.Should().NotBeNull();
        message!.MessageId.Should().NotBeEmpty();
    }

    private static async Task<TestUsers> CreateUsersAsync(IntegrationTestWebApplicationFactory factory)
    {
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        var authenticated = await CreateUserAsync(userManager, "authenticated");
        var recipient = await CreateUserAsync(userManager, "recipient");

        return new TestUsers(authenticated, recipient);
    }

    private static async Task<TestUser> CreateUserAsync(UserManager<User> userManager, string name)
    {
        var uniqueId = Guid.NewGuid().ToString("N");
        var user = User.CreateFromGoogle(
            googleId: $"messaging-{name}-{uniqueId}",
            email: $"messaging-{name}-{uniqueId}@example.test",
            firstName: name,
            lastName: "test",
            profilePictureUrl: null);

        EnsureSucceeded(await userManager.CreateAsync(user, Password));
        EnsureSucceeded(await userManager.AddToRoleAsync(user, "Patient"));

        return new TestUser(user.Id, user.Email!);
    }

    private static async Task<string> LoginAsync(HttpClient client, string email)
    {
        var response = await client.PostAsJsonAsync("/auth/login", new { Email = email, Password });

        response.StatusCode.Should().Be(HttpStatusCode.OK, await response.Content.ReadAsStringAsync());
        var tokens = await response.Content.ReadFromJsonAsync<Tokens>();
        tokens.Should().NotBeNull();
        tokens!.AccessToken.Should().NotBeNullOrWhiteSpace();

        return tokens.AccessToken;
    }

    private static void EnsureSucceeded(IdentityResult result)
    {
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(string.Join("; ", result.Errors.Select(error => error.Description)));
        }
    }

    private sealed record TestUser(Guid Id, string Email);

    private sealed record TestUsers(TestUser Authenticated, TestUser Recipient);

    private sealed record Tokens(string AccessToken);

    private sealed record ConversationResponse(Guid ConversationId);

    private sealed record MessageResponse(Guid MessageId);
}
