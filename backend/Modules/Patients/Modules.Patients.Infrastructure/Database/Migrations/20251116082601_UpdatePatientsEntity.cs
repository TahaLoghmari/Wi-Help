using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Patients.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePatientsEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "address_city",
                schema: "patients",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "address_country",
                schema: "patients",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "address_postal_code",
                schema: "patients",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "address_street",
                schema: "patients",
                table: "patients");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "address_city",
                schema: "patients",
                table: "patients",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "address_country",
                schema: "patients",
                table: "patients",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "address_postal_code",
                schema: "patients",
                table: "patients",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "address_street",
                schema: "patients",
                table: "patients",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }
    }
}
