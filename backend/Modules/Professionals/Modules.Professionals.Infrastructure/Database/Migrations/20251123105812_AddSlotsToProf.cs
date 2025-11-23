using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Professionals.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddSlotsToProf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "availability_days",
                schema: "professionals",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    professional_id = table.Column<Guid>(type: "uuid", nullable: false),
                    day_of_week = table.Column<string>(type: "text", nullable: false),
                    time_zone = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_availability_days", x => x.id);
                    table.ForeignKey(
                        name: "fk_availability_days_professionals_professional_id",
                        column: x => x.professional_id,
                        principalSchema: "professionals",
                        principalTable: "professionals",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "availability_slots",
                schema: "professionals",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    availability_day_id = table.Column<Guid>(type: "uuid", nullable: false),
                    start_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    end_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_availability_slots", x => x.id);
                    table.ForeignKey(
                        name: "fk_availability_slots_availability_days_availability_day_id",
                        column: x => x.availability_day_id,
                        principalSchema: "professionals",
                        principalTable: "availability_days",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_availability_days_professional_id",
                schema: "professionals",
                table: "availability_days",
                column: "professional_id");

            migrationBuilder.CreateIndex(
                name: "ix_availability_slots_availability_day_id",
                schema: "professionals",
                table: "availability_slots",
                column: "availability_day_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "availability_slots",
                schema: "professionals");

            migrationBuilder.DropTable(
                name: "availability_days",
                schema: "professionals");
        }
    }
}
