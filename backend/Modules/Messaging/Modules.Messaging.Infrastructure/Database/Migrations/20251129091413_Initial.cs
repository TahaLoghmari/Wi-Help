using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Messaging.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "messaging");

            migrationBuilder.CreateTable(
                name: "conversations",
                schema: "messaging",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    participant1id = table.Column<Guid>(type: "uuid", nullable: false),
                    participant2id = table.Column<Guid>(type: "uuid", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    last_message_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_conversations", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "messages",
                schema: "messaging",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    conversation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sender_id = table.Column<Guid>(type: "uuid", nullable: false),
                    content = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    delivered_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    read_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_messages", x => x.id);
                    table.ForeignKey(
                        name: "fk_messages_conversations_conversation_id",
                        column: x => x.conversation_id,
                        principalSchema: "messaging",
                        principalTable: "conversations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_conversations_participant1id_participant2id",
                schema: "messaging",
                table: "conversations",
                columns: new[] { "participant1id", "participant2id" });

            migrationBuilder.CreateIndex(
                name: "ix_conversations_participant2id_participant1id",
                schema: "messaging",
                table: "conversations",
                columns: new[] { "participant2id", "participant1id" });

            migrationBuilder.CreateIndex(
                name: "ix_messages_conversation_id",
                schema: "messaging",
                table: "messages",
                column: "conversation_id");

            migrationBuilder.CreateIndex(
                name: "ix_messages_conversation_id_created_at",
                schema: "messaging",
                table: "messages",
                columns: new[] { "conversation_id", "created_at" });

            migrationBuilder.CreateIndex(
                name: "ix_messages_conversation_id_status",
                schema: "messaging",
                table: "messages",
                columns: new[] { "conversation_id", "status" });

            migrationBuilder.CreateIndex(
                name: "ix_messages_sender_id",
                schema: "messaging",
                table: "messages",
                column: "sender_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "messages",
                schema: "messaging");

            migrationBuilder.DropTable(
                name: "conversations",
                schema: "messaging");
        }
    }
}
