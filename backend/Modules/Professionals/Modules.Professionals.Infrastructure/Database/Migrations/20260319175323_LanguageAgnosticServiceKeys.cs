using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Modules.Professionals.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class LanguageAgnosticServiceKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "name",
                schema: "professionals",
                table: "services",
                newName: "key");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000001"),
                column: "key",
                value: "services.initialConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000002"),
                column: "key",
                value: "services.followUpVisit");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000003"),
                column: "key",
                value: "services.teleconsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000004"),
                column: "key",
                value: "services.emergencyConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000005"),
                column: "key",
                value: "services.secondOpinion");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000006"),
                column: "key",
                value: "services.prescriptionRenewal");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000007"),
                column: "key",
                value: "services.medicalCertificate");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000008"),
                column: "key",
                value: "services.healthCheckup");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000009"),
                column: "key",
                value: "services.vaccination");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000010"),
                column: "key",
                value: "services.minorProcedure");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000011"),
                column: "key",
                value: "services.woundCare");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000012"),
                column: "key",
                value: "services.travelMedicine");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000013"),
                column: "key",
                value: "services.wellChildVisit");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000014"),
                column: "key",
                value: "services.chronicDiseaseManagement");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000015"),
                column: "key",
                value: "services.preventiveCare");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000016"),
                column: "key",
                value: "services.diagnosticConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000017"),
                column: "key",
                value: "services.preoperativeEvaluation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000018"),
                column: "key",
                value: "services.complexCaseReview");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000019"),
                column: "key",
                value: "services.preoperativeConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000020"),
                column: "key",
                value: "services.postoperativeFollowUp");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000021"),
                column: "key",
                value: "services.surgicalConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000022"),
                column: "key",
                value: "services.woundManagement");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000023"),
                column: "key",
                value: "services.jointConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000024"),
                column: "key",
                value: "services.sportsInjuryEvaluation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000025"),
                column: "key",
                value: "services.fractureManagement");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000026"),
                column: "key",
                value: "services.castRemoval");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000027"),
                column: "key",
                value: "services.neurologicalEvaluation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000028"),
                column: "key",
                value: "services.painManagement");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000029"),
                column: "key",
                value: "services.aestheticConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000030"),
                column: "key",
                value: "services.reconstructiveConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000031"),
                column: "key",
                value: "services.scarRevision");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000032"),
                column: "key",
                value: "services.cardiacConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000033"),
                column: "key",
                value: "services.riskAssessment");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000034"),
                column: "key",
                value: "services.urologicalEvaluation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000035"),
                column: "key",
                value: "services.prostateScreening");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000036"),
                column: "key",
                value: "services.kidneyStoneManagement");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000037"),
                column: "key",
                value: "services.bladderEvaluation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000038"),
                column: "key",
                value: "services.xrayInterpretation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000039"),
                column: "key",
                value: "services.ctScanConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000040"),
                column: "key",
                value: "services.mriConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000041"),
                column: "key",
                value: "services.ultrasoundConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000042"),
                column: "key",
                value: "services.mammographyReview");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000043"),
                column: "key",
                value: "services.imageGuidedProcedure");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000044"),
                column: "key",
                value: "services.biopsyReview");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000045"),
                column: "key",
                value: "services.labResultsConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000046"),
                column: "key",
                value: "services.cytologicalReview");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000047"),
                column: "key",
                value: "services.histopathologicalConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000048"),
                column: "key",
                value: "services.traumaEvaluation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000049"),
                column: "key",
                value: "services.acuteCare");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000050"),
                column: "key",
                value: "services.minorEmergency");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000051"),
                column: "key",
                value: "services.icuConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000052"),
                column: "key",
                value: "services.criticalCareEvaluation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000053"),
                column: "key",
                value: "services.ventilatorManagement");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000054"),
                column: "key",
                value: "services.familyMeeting");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000055"),
                column: "key",
                value: "services.prenatalVisit");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000056"),
                column: "key",
                value: "services.postnatalCheckup");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000057"),
                column: "key",
                value: "services.ultrasound");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000058"),
                column: "key",
                value: "services.cervicalSmear");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000059"),
                column: "key",
                value: "services.familyPlanning");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000060"),
                column: "key",
                value: "services.fertilityConsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000061"),
                column: "key",
                value: "services.menopauseManagement");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000062"),
                column: "key",
                value: "services.growthEvaluation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000063"),
                column: "key",
                value: "services.bloodPressureCheck");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000064"),
                column: "key",
                value: "services.healthEducation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000065"),
                column: "key",
                value: "services.homeVisit");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "key",
                schema: "professionals",
                table: "services",
                newName: "name");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000001"),
                column: "name",
                value: "Consultation Initiale");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000002"),
                column: "name",
                value: "Visite de Suivi");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000003"),
                column: "name",
                value: "Téléconsultation");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000004"),
                column: "name",
                value: "Consultation d'Urgence");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000005"),
                column: "name",
                value: "Deuxième Avis");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000006"),
                column: "name",
                value: "Renouvellement d'Ordonnance");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000007"),
                column: "name",
                value: "Certificat Médical");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000008"),
                column: "name",
                value: "Bilan de Santé");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000009"),
                column: "name",
                value: "Vaccination");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000010"),
                column: "name",
                value: "Procédure Mineure");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000011"),
                column: "name",
                value: "Soins des Plaies");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000012"),
                column: "name",
                value: "Médecine des Voyages");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000013"),
                column: "name",
                value: "Visite de l'Enfant Sain");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000014"),
                column: "name",
                value: "Gestion des Maladies Chroniques");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000015"),
                column: "name",
                value: "Soins Préventifs");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000016"),
                column: "name",
                value: "Consultation Diagnostique");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000017"),
                column: "name",
                value: "Évaluation Préopératoire");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000018"),
                column: "name",
                value: "Revue de Cas Complexe");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000019"),
                column: "name",
                value: "Consultation Préopératoire");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000020"),
                column: "name",
                value: "Suivi Postopératoire");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000021"),
                column: "name",
                value: "Consultation Chirurgicale");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000022"),
                column: "name",
                value: "Gestion des Plaies");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000023"),
                column: "name",
                value: "Consultation Articulaire");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000024"),
                column: "name",
                value: "Évaluation des Blessures Sportives");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000025"),
                column: "name",
                value: "Gestion des Fractures");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000026"),
                column: "name",
                value: "Retrait de Plâtre");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000027"),
                column: "name",
                value: "Évaluation Neurologique");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000028"),
                column: "name",
                value: "Gestion de la Douleur");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000029"),
                column: "name",
                value: "Consultation Esthétique");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000030"),
                column: "name",
                value: "Consultation Reconstructive");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000031"),
                column: "name",
                value: "Révision de Cicatrice");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000032"),
                column: "name",
                value: "Consultation Cardiaque");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000033"),
                column: "name",
                value: "Évaluation des Risques");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000034"),
                column: "name",
                value: "Évaluation Urologique");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000035"),
                column: "name",
                value: "Dépistage de la Prostate");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000036"),
                column: "name",
                value: "Gestion des Calculs Rénaux");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000037"),
                column: "name",
                value: "Évaluation de la Vessie");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000038"),
                column: "name",
                value: "Interprétation Radiographique");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000039"),
                column: "name",
                value: "Consultation Scanner (CT)");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000040"),
                column: "name",
                value: "Consultation IRM");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000041"),
                column: "name",
                value: "Consultation Échographie");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000042"),
                column: "name",
                value: "Revue de Mammographie");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000043"),
                column: "name",
                value: "Procédure Guidée par l'Image");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000044"),
                column: "name",
                value: "Revue de Biopsie");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000045"),
                column: "name",
                value: "Consultation Résultats Labo");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000046"),
                column: "name",
                value: "Revue Cytologique");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000047"),
                column: "name",
                value: "Consultation Histopathologique");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000048"),
                column: "name",
                value: "Évaluation Traumatologique");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000049"),
                column: "name",
                value: "Soins Aigus");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000050"),
                column: "name",
                value: "Urgence Mineure");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000051"),
                column: "name",
                value: "Consultation USI");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000052"),
                column: "name",
                value: "Évaluation Soins Critiques");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000053"),
                column: "name",
                value: "Gestion Ventilateur");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000054"),
                column: "name",
                value: "Réunion Familiale");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000055"),
                column: "name",
                value: "Visite Prénatale");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000056"),
                column: "name",
                value: "Bilan Postnatal");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000057"),
                column: "name",
                value: "Échographie");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000058"),
                column: "name",
                value: "Frottis Cervico-vaginal");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000059"),
                column: "name",
                value: "Planification Familiale");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000060"),
                column: "name",
                value: "Consultation Fertilité");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000061"),
                column: "name",
                value: "Gestion de la Ménopause");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000062"),
                column: "name",
                value: "Évaluation de la Croissance");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000063"),
                column: "name",
                value: "Prise de Tension");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000064"),
                column: "name",
                value: "Éducation Santé");

            migrationBuilder.UpdateData(
                schema: "professionals",
                table: "services",
                keyColumn: "id",
                keyValue: new Guid("00000001-0000-0000-0000-000000000065"),
                column: "name",
                value: "Visite à Domicile");
        }
    }
}
