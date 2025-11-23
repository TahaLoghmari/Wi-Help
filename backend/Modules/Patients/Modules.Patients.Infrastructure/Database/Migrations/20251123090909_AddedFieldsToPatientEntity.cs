using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Patients.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddedFieldsToPatientEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "bio",
                schema: "patients",
                table: "patients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<List<string>>(
                name: "medical_info_allergies",
                schema: "patients",
                table: "patients",
                type: "text[]",
                nullable: false);

            migrationBuilder.AddColumn<List<string>>(
                name: "medical_info_chronic_conditions",
                schema: "patients",
                table: "patients",
                type: "text[]",
                nullable: false);

            migrationBuilder.AddColumn<List<string>>(
                name: "medical_info_medications",
                schema: "patients",
                table: "patients",
                type: "text[]",
                nullable: false);

            migrationBuilder.AddColumn<int>(
                name: "medical_info_mobility_status",
                schema: "patients",
                table: "patients",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "bio",
                schema: "patients",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "medical_info_allergies",
                schema: "patients",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "medical_info_chronic_conditions",
                schema: "patients",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "medical_info_medications",
                schema: "patients",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "medical_info_mobility_status",
                schema: "patients",
                table: "patients");
        }
    }
}
