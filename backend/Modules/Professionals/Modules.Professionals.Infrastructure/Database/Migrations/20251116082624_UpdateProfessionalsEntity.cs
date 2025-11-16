using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Professionals.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProfessionalsEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "workplace_city",
                schema: "professionals",
                table: "professionals");

            migrationBuilder.DropColumn(
                name: "workplace_country",
                schema: "professionals",
                table: "professionals");

            migrationBuilder.DropColumn(
                name: "workplace_postal_code",
                schema: "professionals",
                table: "professionals");

            migrationBuilder.DropColumn(
                name: "workplace_street",
                schema: "professionals",
                table: "professionals");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "workplace_city",
                schema: "professionals",
                table: "professionals",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "workplace_country",
                schema: "professionals",
                table: "professionals",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "workplace_postal_code",
                schema: "professionals",
                table: "professionals",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "workplace_street",
                schema: "professionals",
                table: "professionals",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }
    }
}
