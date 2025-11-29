using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Reviews.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddLikesAndReplies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "review_likes",
                schema: "reviews",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    review_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_review_likes", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_review_likes_review_id_user_id",
                schema: "reviews",
                table: "review_likes",
                columns: new[] { "review_id", "user_id" },
                unique: true);

            migrationBuilder.CreateTable(
                name: "review_replies",
                schema: "reviews",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    review_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    comment = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_review_replies", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "review_replies",
                schema: "reviews");

            migrationBuilder.DropTable(
                name: "review_likes",
                schema: "reviews");
        }
    }
}

