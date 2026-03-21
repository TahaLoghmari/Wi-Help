using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Professionals.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_services_name",
                schema: "professionals",
                table: "services");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                schema: "professionals",
                table: "services",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "name",
                schema: "professionals",
                table: "services",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateIndex(
                name: "ix_services_name",
                schema: "professionals",
                table: "services",
                column: "name",
                unique: true);
        }
    }
}
