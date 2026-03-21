using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Modules.Common.Features.ValueObjects;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Infrastructure.Database.Seedings;

namespace Modules.Identity.Infrastructure.Database;

public static class IdentityDataSeeder
{
    public static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
    {
        string[] roles = { "Admin", "Professional", "Patient" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }
    }

    public static async Task SeedAdminUserAsync(
        UserManager<User> userManager,
        IConfiguration configuration)
    {
        var adminEmail = configuration["ADMIN_EMAIL"] ?? "admin@wihelp.com";
        var adminPassword = configuration["ADMIN_PASSWORD"] ?? "Admin@123456";

        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin != null)
        {
            return;
        }

        var adminAddress = new Address(
            street: "Admin Street",
            city: "Admin City",
            postalCode: "12345",
            countryId: new Guid("00000002-0000-0000-0000-000000000125"), // Tunisia
            stateId: new Guid("00000003-0000-0000-0000-000000000084") // Tunis
        );

        var adminUser = User.Create(
            firstName: "Admin",
            lastName: "User",
            gender: "Other",
            address: adminAddress,
            dateOfBirth: "1990-01-01 00:00:00.000 +0100",
            phoneNumber: "+1234567890",
            email: adminEmail
        );

        var result = await userManager.CreateAsync(adminUser, adminPassword);

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
            var token = await userManager.GenerateEmailConfirmationTokenAsync(adminUser);
            await userManager.ConfirmEmailAsync(adminUser, token);
        }
    }

    public static async Task<List<Guid>> SeedProfessionalUsersAsync(UserManager<User> userManager)
    {
        var userIds = new List<Guid>();

        foreach (var (email, password, firstName, lastName, dateOfBirth, gender, phoneNumber, address) in ProfessionalUserSeeds.All)
        {
            var existingUser = await userManager.FindByEmailAsync(email);
            if (existingUser != null)
            {
                userIds.Add(existingUser.Id);
                continue;
            }

            var user = User.Create(
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                address: address,
                dateOfBirth: dateOfBirth,
                phoneNumber: phoneNumber,
                email: email
            );

            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, "Professional");
                var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
                await userManager.ConfirmEmailAsync(user, token);
                userIds.Add(user.Id);
            }
        }

        return userIds;
    }

    public static async Task<List<Guid>> SeedPatientUsersAsync(UserManager<User> userManager)
    {
        var userIds = new List<Guid>();

        foreach (var (email, password, firstName, lastName, dateOfBirth, gender, phoneNumber, address) in PatientUserSeeds.All)
        {
            var existingUser = await userManager.FindByEmailAsync(email);
            if (existingUser != null)
            {
                userIds.Add(existingUser.Id);
                continue;
            }

            var user = User.Create(
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                address: address,
                dateOfBirth: dateOfBirth,
                phoneNumber: phoneNumber,
                email: email
            );

            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, "Patient");
                var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
                await userManager.ConfirmEmailAsync(user, token);
                userIds.Add(user.Id);
            }
        }

        return userIds;
    }

}