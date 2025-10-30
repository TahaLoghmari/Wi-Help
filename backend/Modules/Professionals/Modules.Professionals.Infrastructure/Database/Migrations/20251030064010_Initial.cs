using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Professionals.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "professionals");

            migrationBuilder.CreateTable(
                name: "professionals",
                schema: "professionals",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    specialization = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    years_of_experience = table.Column<int>(type: "integer", nullable: false),
                    is_verified = table.Column<bool>(type: "boolean", nullable: false),
                    workplace_street = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    workplace_city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    workplace_postal_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    workplace_country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_professionals", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "professionals",
                schema: "professionals");
        }
    }
}
