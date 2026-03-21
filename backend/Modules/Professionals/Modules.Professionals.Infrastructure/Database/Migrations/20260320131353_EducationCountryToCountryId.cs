using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Professionals.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class EducationCountryToCountryId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "country",
                schema: "professionals",
                table: "educations");

            migrationBuilder.AddColumn<Guid>(
                name: "country_id",
                schema: "professionals",
                table: "educations",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "country_id",
                schema: "professionals",
                table: "educations");

            migrationBuilder.AddColumn<string>(
                name: "country",
                schema: "professionals",
                table: "educations",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
