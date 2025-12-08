using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Modules.Common.Features.ValueObjects;
using Modules.Identity.Domain.Entities;

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
            return; // Admin already exists
        }

        var adminAddress = new Address(
            street: "Admin Street",
            city: "Admin City",
            postalCode: "12345",
            country: "Admin Country",
            state: "Admin State"
        );

        var adminUser = User.Create(
            firstName: "Admin",
            lastName: "User",
            gender: "Other",
            address: adminAddress,
            dateOfBirth: "1990-01-01",
            phoneNumber: "+1234567890",
            email: adminEmail
        );

        var result = await userManager.CreateAsync(adminUser, adminPassword);
        
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
            
            // Confirm the admin email automatically
            var token = await userManager.GenerateEmailConfirmationTokenAsync(adminUser);
            await userManager.ConfirmEmailAsync(adminUser, token);
        }
    }
}