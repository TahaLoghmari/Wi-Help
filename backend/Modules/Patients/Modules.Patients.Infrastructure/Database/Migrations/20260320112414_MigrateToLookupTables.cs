using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Modules.Patients.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class MigrateToLookupTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "allergies",
                schema: "patients",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "chronic_conditions",
                schema: "patients",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "emergency_contact_relationship",
                schema: "patients",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "medications",
                schema: "patients",
                table: "patients");

            migrationBuilder.AlterColumn<string>(
                name: "mobility_status",
                schema: "patients",
                table: "patients",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "emergency_contact_relationship_id",
                schema: "patients",
                table: "patients",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "allergies",
                schema: "patients",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_allergies", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "conditions",
                schema: "patients",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_conditions", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "medications",
                schema: "patients",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_medications", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "relationships",
                schema: "patients",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_relationships", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "patient_allergies",
                schema: "patients",
                columns: table => new
                {
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    allergy_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_patient_allergies", x => new { x.patient_id, x.allergy_id });
                    table.ForeignKey(
                        name: "fk_patient_allergies_allergies_allergy_id",
                        column: x => x.allergy_id,
                        principalSchema: "patients",
                        principalTable: "allergies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_patient_allergies_patients_patient_id",
                        column: x => x.patient_id,
                        principalSchema: "patients",
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "patient_conditions",
                schema: "patients",
                columns: table => new
                {
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    condition_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_patient_conditions", x => new { x.patient_id, x.condition_id });
                    table.ForeignKey(
                        name: "fk_patient_conditions_conditions_condition_id",
                        column: x => x.condition_id,
                        principalSchema: "patients",
                        principalTable: "conditions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_patient_conditions_patients_patient_id",
                        column: x => x.patient_id,
                        principalSchema: "patients",
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "patient_medications",
                schema: "patients",
                columns: table => new
                {
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    medication_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_patient_medications", x => new { x.patient_id, x.medication_id });
                    table.ForeignKey(
                        name: "fk_patient_medications_medications_medication_id",
                        column: x => x.medication_id,
                        principalSchema: "patients",
                        principalTable: "medications",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_patient_medications_patients_patient_id",
                        column: x => x.patient_id,
                        principalSchema: "patients",
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                schema: "patients",
                table: "allergies",
                columns: new[] { "id", "key" },
                values: new object[,]
                {
                    { new Guid("00000006-0000-0000-0000-000000000001"), "allergies.peanuts" },
                    { new Guid("00000006-0000-0000-0000-000000000002"), "allergies.treeNuts" },
                    { new Guid("00000006-0000-0000-0000-000000000003"), "allergies.milk" },
                    { new Guid("00000006-0000-0000-0000-000000000004"), "allergies.egg" },
                    { new Guid("00000006-0000-0000-0000-000000000005"), "allergies.wheat" },
                    { new Guid("00000006-0000-0000-0000-000000000006"), "allergies.soy" },
                    { new Guid("00000006-0000-0000-0000-000000000007"), "allergies.fish" },
                    { new Guid("00000006-0000-0000-0000-000000000008"), "allergies.shellfish" },
                    { new Guid("00000006-0000-0000-0000-000000000009"), "allergies.sesame" },
                    { new Guid("00000006-0000-0000-0000-000000000010"), "allergies.penicillin" },
                    { new Guid("00000006-0000-0000-0000-000000000011"), "allergies.latex" },
                    { new Guid("00000006-0000-0000-0000-000000000012"), "allergies.pollen" },
                    { new Guid("00000006-0000-0000-0000-000000000013"), "allergies.dustMites" },
                    { new Guid("00000006-0000-0000-0000-000000000014"), "allergies.petDander" },
                    { new Guid("00000006-0000-0000-0000-000000000015"), "allergies.insectStings" }
                });

            migrationBuilder.InsertData(
                schema: "patients",
                table: "conditions",
                columns: new[] { "id", "key" },
                values: new object[,]
                {
                    { new Guid("00000007-0000-0000-0000-000000000001"), "conditions.hypertension" },
                    { new Guid("00000007-0000-0000-0000-000000000002"), "conditions.diabetesType1" },
                    { new Guid("00000007-0000-0000-0000-000000000003"), "conditions.diabetesType2" },
                    { new Guid("00000007-0000-0000-0000-000000000004"), "conditions.asthma" },
                    { new Guid("00000007-0000-0000-0000-000000000005"), "conditions.arthritis" },
                    { new Guid("00000007-0000-0000-0000-000000000006"), "conditions.heartDisease" },
                    { new Guid("00000007-0000-0000-0000-000000000007"), "conditions.copd" },
                    { new Guid("00000007-0000-0000-0000-000000000008"), "conditions.depression" },
                    { new Guid("00000007-0000-0000-0000-000000000009"), "conditions.anxiety" },
                    { new Guid("00000007-0000-0000-0000-000000000010"), "conditions.obesity" },
                    { new Guid("00000007-0000-0000-0000-000000000011"), "conditions.osteoporosis" },
                    { new Guid("00000007-0000-0000-0000-000000000012"), "conditions.chronicKidneyDisease" },
                    { new Guid("00000007-0000-0000-0000-000000000013"), "conditions.alzheimers" },
                    { new Guid("00000007-0000-0000-0000-000000000014"), "conditions.cancer" },
                    { new Guid("00000007-0000-0000-0000-000000000015"), "conditions.stroke" }
                });

            migrationBuilder.InsertData(
                schema: "patients",
                table: "medications",
                columns: new[] { "id", "key" },
                values: new object[,]
                {
                    { new Guid("00000008-0000-0000-0000-000000000001"), "medications.lisinopril" },
                    { new Guid("00000008-0000-0000-0000-000000000002"), "medications.levothyroxine" },
                    { new Guid("00000008-0000-0000-0000-000000000003"), "medications.atorvastatin" },
                    { new Guid("00000008-0000-0000-0000-000000000004"), "medications.metformin" },
                    { new Guid("00000008-0000-0000-0000-000000000005"), "medications.simvastatin" },
                    { new Guid("00000008-0000-0000-0000-000000000006"), "medications.omeprazole" },
                    { new Guid("00000008-0000-0000-0000-000000000007"), "medications.amlodipine" },
                    { new Guid("00000008-0000-0000-0000-000000000008"), "medications.metoprolol" }
                });

            migrationBuilder.InsertData(
                schema: "patients",
                table: "relationships",
                columns: new[] { "id", "key" },
                values: new object[,]
                {
                    { new Guid("00000005-0000-0000-0000-000000000001"), "relationships.parent" },
                    { new Guid("00000005-0000-0000-0000-000000000002"), "relationships.child" },
                    { new Guid("00000005-0000-0000-0000-000000000003"), "relationships.spouse" },
                    { new Guid("00000005-0000-0000-0000-000000000004"), "relationships.partner" },
                    { new Guid("00000005-0000-0000-0000-000000000005"), "relationships.sibling" },
                    { new Guid("00000005-0000-0000-0000-000000000006"), "relationships.grandparent" },
                    { new Guid("00000005-0000-0000-0000-000000000007"), "relationships.grandchild" },
                    { new Guid("00000005-0000-0000-0000-000000000008"), "relationships.relative" },
                    { new Guid("00000005-0000-0000-0000-000000000009"), "relationships.friend" },
                    { new Guid("00000005-0000-0000-0000-000000000010"), "relationships.neighbor" },
                    { new Guid("00000005-0000-0000-0000-000000000011"), "relationships.caregiver" },
                    { new Guid("00000005-0000-0000-0000-000000000012"), "relationships.guardian" },
                    { new Guid("00000005-0000-0000-0000-000000000013"), "relationships.doctor" },
                    { new Guid("00000005-0000-0000-0000-000000000014"), "relationships.nurse" },
                    { new Guid("00000005-0000-0000-0000-000000000015"), "relationships.colleague" },
                    { new Guid("00000005-0000-0000-0000-000000000016"), "relationships.other" }
                });

            migrationBuilder.CreateIndex(
                name: "ix_patient_allergies_allergy_id",
                schema: "patients",
                table: "patient_allergies",
                column: "allergy_id");

            migrationBuilder.CreateIndex(
                name: "ix_patient_conditions_condition_id",
                schema: "patients",
                table: "patient_conditions",
                column: "condition_id");

            migrationBuilder.CreateIndex(
                name: "ix_patient_medications_medication_id",
                schema: "patients",
                table: "patient_medications",
                column: "medication_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "patient_allergies",
                schema: "patients");

            migrationBuilder.DropTable(
                name: "patient_conditions",
                schema: "patients");

            migrationBuilder.DropTable(
                name: "patient_medications",
                schema: "patients");

            migrationBuilder.DropTable(
                name: "relationships",
                schema: "patients");

            migrationBuilder.DropTable(
                name: "allergies",
                schema: "patients");

            migrationBuilder.DropTable(
                name: "conditions",
                schema: "patients");

            migrationBuilder.DropTable(
                name: "medications",
                schema: "patients");

            migrationBuilder.DropColumn(
                name: "emergency_contact_relationship_id",
                schema: "patients",
                table: "patients");

            migrationBuilder.AlterColumn<int>(
                name: "mobility_status",
                schema: "patients",
                table: "patients",
                type: "integer",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "allergies",
                schema: "patients",
                table: "patients",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "chronic_conditions",
                schema: "patients",
                table: "patients",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "emergency_contact_relationship",
                schema: "patients",
                table: "patients",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<List<string>>(
                name: "medications",
                schema: "patients",
                table: "patients",
                type: "text[]",
                nullable: true);
        }
    }
}
