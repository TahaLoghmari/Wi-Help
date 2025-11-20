using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Identity.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddStateFieldToAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "address_state",
                schema: "identity",
                table: "users",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "address_state",
                schema: "identity",
                table: "users");
        }
    }
}
