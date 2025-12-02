using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Professionals.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAwards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "date_received",
                schema: "professionals",
                table: "awards");

            migrationBuilder.AddColumn<string>(
                name: "year_received",
                schema: "professionals",
                table: "awards",
                type: "character varying(4)",
                maxLength: 4,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "year_received",
                schema: "professionals",
                table: "awards");

            migrationBuilder.AddColumn<DateOnly>(
                name: "date_received",
                schema: "professionals",
                table: "awards",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }
    }
}
