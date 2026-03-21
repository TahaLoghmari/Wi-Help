using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Modules.Professionals.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class RefactorServicesLookupTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_services_professionals_professional_id",
                schema: "professionals",
                table: "services");

            migrationBuilder.DropIndex(
                name: "ix_services_professional_id",
                schema: "professionals",
                table: "services");

            migrationBuilder.DropColumn(
                name: "professional_id",
                schema: "professionals",
                table: "services");

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

            migrationBuilder.CreateTable(
                name: "professional_services",
                schema: "professionals",
                columns: table => new
                {
                    professional_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_professional_services", x => new { x.professional_id, x.service_id });
                    table.ForeignKey(
                        name: "fk_professional_services_professionals_professional_id",
                        column: x => x.professional_id,
                        principalSchema: "professionals",
                        principalTable: "professionals",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_professional_services_services_service_id",
                        column: x => x.service_id,
                        principalSchema: "professionals",
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                schema: "professionals",
                table: "services",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { new Guid("00000001-0000-0000-0000-000000000001"), "Consultation Initiale" },
                    { new Guid("00000001-0000-0000-0000-000000000002"), "Visite de Suivi" },
                    { new Guid("00000001-0000-0000-0000-000000000003"), "Téléconsultation" },
                    { new Guid("00000001-0000-0000-0000-000000000004"), "Consultation d'Urgence" },
                    { new Guid("00000001-0000-0000-0000-000000000005"), "Deuxième Avis" },
                    { new Guid("00000001-0000-0000-0000-000000000006"), "Renouvellement d'Ordonnance" },
                    { new Guid("00000001-0000-0000-0000-000000000007"), "Certificat Médical" },
                    { new Guid("00000001-0000-0000-0000-000000000008"), "Bilan de Santé" },
                    { new Guid("00000001-0000-0000-0000-000000000009"), "Vaccination" },
                    { new Guid("00000001-0000-0000-0000-000000000010"), "Procédure Mineure" },
                    { new Guid("00000001-0000-0000-0000-000000000011"), "Soins des Plaies" },
                    { new Guid("00000001-0000-0000-0000-000000000012"), "Médecine des Voyages" },
                    { new Guid("00000001-0000-0000-0000-000000000013"), "Visite de l'Enfant Sain" },
                    { new Guid("00000001-0000-0000-0000-000000000014"), "Gestion des Maladies Chroniques" },
                    { new Guid("00000001-0000-0000-0000-000000000015"), "Soins Préventifs" },
                    { new Guid("00000001-0000-0000-0000-000000000016"), "Consultation Diagnostique" },
                    { new Guid("00000001-0000-0000-0000-000000000017"), "Évaluation Préopératoire" },
                    { new Guid("00000001-0000-0000-0000-000000000018"), "Revue de Cas Complexe" },
                    { new Guid("00000001-0000-0000-0000-000000000019"), "Consultation Préopératoire" },
                    { new Guid("00000001-0000-0000-0000-000000000020"), "Suivi Postopératoire" },
                    { new Guid("00000001-0000-0000-0000-000000000021"), "Consultation Chirurgicale" },
                    { new Guid("00000001-0000-0000-0000-000000000022"), "Gestion des Plaies" },
                    { new Guid("00000001-0000-0000-0000-000000000023"), "Consultation Articulaire" },
                    { new Guid("00000001-0000-0000-0000-000000000024"), "Évaluation des Blessures Sportives" },
                    { new Guid("00000001-0000-0000-0000-000000000025"), "Gestion des Fractures" },
                    { new Guid("00000001-0000-0000-0000-000000000026"), "Retrait de Plâtre" },
                    { new Guid("00000001-0000-0000-0000-000000000027"), "Évaluation Neurologique" },
                    { new Guid("00000001-0000-0000-0000-000000000028"), "Gestion de la Douleur" },
                    { new Guid("00000001-0000-0000-0000-000000000029"), "Consultation Esthétique" },
                    { new Guid("00000001-0000-0000-0000-000000000030"), "Consultation Reconstructive" },
                    { new Guid("00000001-0000-0000-0000-000000000031"), "Révision de Cicatrice" },
                    { new Guid("00000001-0000-0000-0000-000000000032"), "Consultation Cardiaque" },
                    { new Guid("00000001-0000-0000-0000-000000000033"), "Évaluation des Risques" },
                    { new Guid("00000001-0000-0000-0000-000000000034"), "Évaluation Urologique" },
                    { new Guid("00000001-0000-0000-0000-000000000035"), "Dépistage de la Prostate" },
                    { new Guid("00000001-0000-0000-0000-000000000036"), "Gestion des Calculs Rénaux" },
                    { new Guid("00000001-0000-0000-0000-000000000037"), "Évaluation de la Vessie" },
                    { new Guid("00000001-0000-0000-0000-000000000038"), "Interprétation Radiographique" },
                    { new Guid("00000001-0000-0000-0000-000000000039"), "Consultation Scanner (CT)" },
                    { new Guid("00000001-0000-0000-0000-000000000040"), "Consultation IRM" },
                    { new Guid("00000001-0000-0000-0000-000000000041"), "Consultation Échographie" },
                    { new Guid("00000001-0000-0000-0000-000000000042"), "Revue de Mammographie" },
                    { new Guid("00000001-0000-0000-0000-000000000043"), "Procédure Guidée par l'Image" },
                    { new Guid("00000001-0000-0000-0000-000000000044"), "Revue de Biopsie" },
                    { new Guid("00000001-0000-0000-0000-000000000045"), "Consultation Résultats Labo" },
                    { new Guid("00000001-0000-0000-0000-000000000046"), "Revue Cytologique" },
                    { new Guid("00000001-0000-0000-0000-000000000047"), "Consultation Histopathologique" },
                    { new Guid("00000001-0000-0000-0000-000000000048"), "Évaluation Traumatologique" },
                    { new Guid("00000001-0000-0000-0000-000000000049"), "Soins Aigus" },
                    { new Guid("00000001-0000-0000-0000-000000000050"), "Urgence Mineure" },
                    { new Guid("00000001-0000-0000-0000-000000000051"), "Consultation USI" },
                    { new Guid("00000001-0000-0000-0000-000000000052"), "Évaluation Soins Critiques" },
                    { new Guid("00000001-0000-0000-0000-000000000053"), "Gestion Ventilateur" },
                    { new Guid("00000001-0000-0000-0000-000000000054"), "Réunion Familiale" },
                    { new Guid("00000001-0000-0000-0000-000000000055"), "Visite Prénatale" },
                    { new Guid("00000001-0000-0000-0000-000000000056"), "Bilan Postnatal" },
                    { new Guid("00000001-0000-0000-0000-000000000057"), "Échographie" },
                    { new Guid("00000001-0000-0000-0000-000000000058"), "Frottis Cervico-vaginal" },
                    { new Guid("00000001-0000-0000-0000-000000000059"), "Planification Familiale" },
                    { new Guid("00000001-0000-0000-0000-000000000060"), "Consultation Fertilité" },
                    { new Guid("00000001-0000-0000-0000-000000000061"), "Gestion de la Ménopause" },
                    { new Guid("00000001-0000-0000-0000-000000000062"), "Évaluation de la Croissance" },
                    { new Guid("00000001-0000-0000-0000-000000000063"), "Prise de Tension" },
                    { new Guid("00000001-0000-0000-0000-000000000064"), "Éducation Santé" },
                    { new Guid("00000001-0000-0000-0000-000000000065"), "Visite à Domicile" }
                });

            migrationBuilder.CreateIndex(
                name: "ix_services_name",
                schema: "professionals",
                table: "services",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_professional_services_service_id",
                schema: "professionals",
                table: "professional_services",
                column: "service_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "professional_services",
                schema: "professionals");

            migrationBuilder.DropIndex(
                name: "ix_services_name",
                schema: "professionals",
                table: "services");

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000006"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000007"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000008"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000009"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000010"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000011"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000012"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000013"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000014"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000015"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000016"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000017"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000018"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000019"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000020"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000021"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000022"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000023"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000024"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000025"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000026"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000027"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000028"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000029"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000030"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000031"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000032"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000033"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000034"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000035"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000036"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000037"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000038"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000039"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000040"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000041"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000042"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000043"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000044"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000045"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000046"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000047"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000048"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000049"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000050"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000051"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000052"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000053"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000054"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000055"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000056"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000057"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000058"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000059"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000060"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000061"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000062"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000063"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000064"));

            migrationBuilder.DeleteData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000065"));

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

            migrationBuilder.AddColumn<Guid>(
                name: "professional_id",
                schema: "professionals",
                table: "services",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "ix_services_professional_id",
                schema: "professionals",
                table: "services",
                column: "professional_id");

            migrationBuilder.AddForeignKey(
                name: "fk_services_professionals_professional_id",
                schema: "professionals",
                table: "services",
                column: "professional_id",
                principalSchema: "professionals",
                principalTable: "professionals",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
