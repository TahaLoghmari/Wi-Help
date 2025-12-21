using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Identity.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddCordinates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "location_accuracy",
                schema: "identity",
                table: "users",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "location_latitude",
                schema: "identity",
                table: "users",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "location_longitude",
                schema: "identity",
                table: "users",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "location_timestamp",
                schema: "identity",
                table: "users",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "location_accuracy",
                schema: "identity",
                table: "users");

            migrationBuilder.DropColumn(
                name: "location_latitude",
                schema: "identity",
                table: "users");

            migrationBuilder.DropColumn(
                name: "location_longitude",
                schema: "identity",
                table: "users");

            migrationBuilder.DropColumn(
                name: "location_timestamp",
                schema: "identity",
                table: "users");
        }
    }
}
