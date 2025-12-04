using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Appointments.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddPrescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "prescriptions",
                schema: "appointments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    appointment_id = table.Column<Guid>(type: "uuid", nullable: false),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    professional_id = table.Column<Guid>(type: "uuid", nullable: false),
                    pdf_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    issued_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_prescriptions", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_prescriptions_appointment_id",
                schema: "appointments",
                table: "prescriptions",
                column: "appointment_id");

            migrationBuilder.CreateIndex(
                name: "ix_prescriptions_patient_id",
                schema: "appointments",
                table: "prescriptions",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "ix_prescriptions_professional_id",
                schema: "appointments",
                table: "prescriptions",
                column: "professional_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "prescriptions",
                schema: "appointments");
        }
    }
}
