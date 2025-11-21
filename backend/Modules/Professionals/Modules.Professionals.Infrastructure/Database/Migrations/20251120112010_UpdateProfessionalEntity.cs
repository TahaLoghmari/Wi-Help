using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Professionals.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProfessionalEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "years_of_experience",
                schema: "professionals",
                table: "professionals",
                newName: "start_price");

            migrationBuilder.AddColumn<string>(
                name: "bio",
                schema: "professionals",
                table: "professionals",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "end_price",
                schema: "professionals",
                table: "professionals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "experience",
                schema: "professionals",
                table: "professionals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<List<string>>(
                name: "services",
                schema: "professionals",
                table: "professionals",
                type: "text[]",
                nullable: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                schema: "professionals",
                table: "professionals",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "bio",
                schema: "professionals",
                table: "professionals");

            migrationBuilder.DropColumn(
                name: "end_price",
                schema: "professionals",
                table: "professionals");

            migrationBuilder.DropColumn(
                name: "experience",
                schema: "professionals",
                table: "professionals");

            migrationBuilder.DropColumn(
                name: "services",
                schema: "professionals",
                table: "professionals");

            migrationBuilder.DropColumn(
                name: "updated_at",
                schema: "professionals",
                table: "professionals");

            migrationBuilder.RenameColumn(
                name: "start_price",
                schema: "professionals",
                table: "professionals",
                newName: "years_of_experience");
        }
    }
}
