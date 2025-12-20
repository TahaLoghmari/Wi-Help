using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Patients.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedMedicalConditions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "medical_info_mobility_status",
                schema: "patients",
                table: "patients",
                newName: "mobility_status");

            migrationBuilder.RenameColumn(
                name: "medical_info_medications",
                schema: "patients",
                table: "patients",
                newName: "medications");

            migrationBuilder.RenameColumn(
                name: "medical_info_chronic_conditions",
                schema: "patients",
                table: "patients",
                newName: "chronic_conditions");

            migrationBuilder.RenameColumn(
                name: "medical_info_allergies",
                schema: "patients",
                table: "patients",
                newName: "allergies");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "mobility_status",
                schema: "patients",
                table: "patients",
                newName: "medical_info_mobility_status");

            migrationBuilder.RenameColumn(
                name: "medications",
                schema: "patients",
                table: "patients",
                newName: "medical_info_medications");

            migrationBuilder.RenameColumn(
                name: "chronic_conditions",
                schema: "patients",
                table: "patients",
                newName: "medical_info_chronic_conditions");

            migrationBuilder.RenameColumn(
                name: "allergies",
                schema: "patients",
                table: "patients",
                newName: "medical_info_allergies");
        }
    }
}
