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
            dateOfBirth: "1990-01-01 00:00:00.000 +0100",
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

    public static async Task<List<Guid>> SeedProfessionalUsersAsync(UserManager<User> userManager)
    {
        var professionals = new List<(string Email, string Password, string FirstName, string LastName, string DateOfBirth, string Gender, string PhoneNumber, Address Address)>
        {
            (
                "forTestingPurposes@gmail.com",
                "Tahalog12#",
                "Mohamed",
                "BenSalah",
                "1986-04-18 00:00:00.000 +0100",
                "Male",
                "22451889",
                new Address("14 Rue Ibn Sina", "Tunis", "1006", "tunisia", "Tunis")
            ),
            (
                "tahaloooghmari@gmail.com",
                "Tahalog12#",
                "Amina",
                "Trabelsi",
                "1991-09-03 00:00:00.000 +0100",
                "Female",
                "55783214",
                new Address("7 Avenue Habib Bourguiba", "Sousse", "4000", "tunisia", "Sousse")
            )
        };

        var userIds = new List<Guid>();

        foreach (var (email, password, firstName, lastName, dateOfBirth, gender, phoneNumber, address) in professionals)
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
        var patients = new List<(string Email, string Password, string FirstName, string LastName, string DateOfBirth, string Gender, string PhoneNumber, Address Address)>
        {
            (
                "heyitsmetahaa@gmail.com",
                "Tahalog12#",
                "Taha",
                "Ghmari",
                "1998-01-27 00:00:00.000 +0100",
                "Male",
                "93204776",
                new Address("22 Rue El Farabi", "Ariana", "2080", "tunisia", "Ariana")
            ),
            (
                "mohamedtahaloghmari@gmail.com",
                "Tahalog12#",
                "Ali",
                "Ghmari",
                "1993-06-11 00:00:00.000 +0100",
                "Male",
                "25991463",
                new Address("5 Rue de l'Environnement", "Nabeul", "8000", "tunisia", "Nabeul")
            )
        };

        var userIds = new List<Guid>();

        foreach (var (email, password, firstName, lastName, dateOfBirth, gender, phoneNumber, address) in patients)
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