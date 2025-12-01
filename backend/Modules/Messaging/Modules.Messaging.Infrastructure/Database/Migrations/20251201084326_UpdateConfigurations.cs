using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Messaging.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateConfigurations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_messages_deleted_at",
                schema: "messaging",
                table: "messages",
                column: "deleted_at",
                filter: "deleted_at IS NULL");

            migrationBuilder.CreateIndex(
                name: "ix_conversations_last_message_at",
                schema: "messaging",
                table: "conversations",
                column: "last_message_at");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_messages_deleted_at",
                schema: "messaging",
                table: "messages");

            migrationBuilder.DropIndex(
                name: "ix_conversations_last_message_at",
                schema: "messaging",
                table: "conversations");
        }
    }
}
