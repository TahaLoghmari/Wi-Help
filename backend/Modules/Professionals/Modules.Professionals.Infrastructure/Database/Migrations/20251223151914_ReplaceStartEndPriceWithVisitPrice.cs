using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Professionals.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceStartEndPriceWithVisitPrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "end_price",
                schema: "professionals",
                table: "professionals");

            migrationBuilder.RenameColumn(
                name: "start_price",
                schema: "professionals",
                table: "professionals",
                newName: "visit_price");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "visit_price",
                schema: "professionals",
                table: "professionals",
                newName: "start_price");

            migrationBuilder.AddColumn<int>(
                name: "end_price",
                schema: "professionals",
                table: "professionals",
                type: "integer",
                nullable: true);
        }
    }
}
