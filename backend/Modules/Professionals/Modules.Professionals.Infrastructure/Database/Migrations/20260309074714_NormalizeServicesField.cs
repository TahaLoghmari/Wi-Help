using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Professionals.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeServicesField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "services",
                schema: "professionals",
                table: "professionals");

            migrationBuilder.CreateTable(
                name: "services",
                schema: "professionals",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    professional_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_services", x => x.id);
                    table.ForeignKey(
                        name: "fk_services_professionals_professional_id",
                        column: x => x.professional_id,
                        principalSchema: "professionals",
                        principalTable: "professionals",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_services_professional_id",
                schema: "professionals",
                table: "services",
                column: "professional_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "services",
                schema: "professionals");

            migrationBuilder.AddColumn<List<string>>(
                name: "services",
                schema: "professionals",
                table: "professionals",
                type: "text[]",
                nullable: true);
        }
    }
}
