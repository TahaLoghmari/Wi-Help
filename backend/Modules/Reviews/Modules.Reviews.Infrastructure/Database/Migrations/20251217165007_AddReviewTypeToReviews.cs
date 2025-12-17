using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Reviews.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddReviewTypeToReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_reviews_patient_id_professional_id",
                schema: "reviews",
                table: "reviews");

            migrationBuilder.AddColumn<int>(
                name: "type",
                schema: "reviews",
                table: "reviews",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "ix_reviews_patient_id_professional_id_type",
                schema: "reviews",
                table: "reviews",
                columns: new[] { "patient_id", "professional_id", "type" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_reviews_patient_id_professional_id_type",
                schema: "reviews",
                table: "reviews");

            migrationBuilder.DropColumn(
                name: "type",
                schema: "reviews",
                table: "reviews");

            migrationBuilder.CreateIndex(
                name: "ix_reviews_patient_id_professional_id",
                schema: "reviews",
                table: "reviews",
                columns: new[] { "patient_id", "professional_id" },
                unique: true);
        }
    }
}
