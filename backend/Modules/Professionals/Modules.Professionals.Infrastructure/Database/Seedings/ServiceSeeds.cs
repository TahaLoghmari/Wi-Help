using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Infrastructure.Database.Seedings;

internal static class ServiceSeeds
{
    public static readonly Service[] All =
    [
        new(new Guid("00000001-0000-0000-0000-000000000001"), "services.initialConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000002"), "services.followUpVisit"),
        new(new Guid("00000001-0000-0000-0000-000000000003"), "services.teleconsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000004"), "services.emergencyConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000005"), "services.secondOpinion"),
        new(new Guid("00000001-0000-0000-0000-000000000006"), "services.prescriptionRenewal"),
        new(new Guid("00000001-0000-0000-0000-000000000007"), "services.medicalCertificate"),
        new(new Guid("00000001-0000-0000-0000-000000000008"), "services.healthCheckup"),
        new(new Guid("00000001-0000-0000-0000-000000000009"), "services.vaccination"),
        new(new Guid("00000001-0000-0000-0000-000000000010"), "services.minorProcedure"),
        new(new Guid("00000001-0000-0000-0000-000000000011"), "services.woundCare"),
        new(new Guid("00000001-0000-0000-0000-000000000012"), "services.travelMedicine"),
        new(new Guid("00000001-0000-0000-0000-000000000013"), "services.wellChildVisit"),
        new(new Guid("00000001-0000-0000-0000-000000000014"), "services.chronicDiseaseManagement"),
        new(new Guid("00000001-0000-0000-0000-000000000015"), "services.preventiveCare"),
        new(new Guid("00000001-0000-0000-0000-000000000016"), "services.diagnosticConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000017"), "services.preoperativeEvaluation"),
        new(new Guid("00000001-0000-0000-0000-000000000018"), "services.complexCaseReview"),
        new(new Guid("00000001-0000-0000-0000-000000000019"), "services.preoperativeConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000020"), "services.postoperativeFollowUp"),
        new(new Guid("00000001-0000-0000-0000-000000000021"), "services.surgicalConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000022"), "services.woundManagement"),
        new(new Guid("00000001-0000-0000-0000-000000000023"), "services.jointConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000024"), "services.sportsInjuryEvaluation"),
        new(new Guid("00000001-0000-0000-0000-000000000025"), "services.fractureManagement"),
        new(new Guid("00000001-0000-0000-0000-000000000026"), "services.castRemoval"),
        new(new Guid("00000001-0000-0000-0000-000000000027"), "services.neurologicalEvaluation"),
        new(new Guid("00000001-0000-0000-0000-000000000028"), "services.painManagement"),
        new(new Guid("00000001-0000-0000-0000-000000000029"), "services.aestheticConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000030"), "services.reconstructiveConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000031"), "services.scarRevision"),
        new(new Guid("00000001-0000-0000-0000-000000000032"), "services.cardiacConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000033"), "services.riskAssessment"),
        new(new Guid("00000001-0000-0000-0000-000000000034"), "services.urologicalEvaluation"),
        new(new Guid("00000001-0000-0000-0000-000000000035"), "services.prostateScreening"),
        new(new Guid("00000001-0000-0000-0000-000000000036"), "services.kidneyStoneManagement"),
        new(new Guid("00000001-0000-0000-0000-000000000037"), "services.bladderEvaluation"),
        new(new Guid("00000001-0000-0000-0000-000000000038"), "services.xrayInterpretation"),
        new(new Guid("00000001-0000-0000-0000-000000000039"), "services.ctScanConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000040"), "services.mriConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000041"), "services.ultrasoundConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000042"), "services.mammographyReview"),
        new(new Guid("00000001-0000-0000-0000-000000000043"), "services.imageGuidedProcedure"),
        new(new Guid("00000001-0000-0000-0000-000000000044"), "services.biopsyReview"),
        new(new Guid("00000001-0000-0000-0000-000000000045"), "services.labResultsConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000046"), "services.cytologicalReview"),
        new(new Guid("00000001-0000-0000-0000-000000000047"), "services.histopathologicalConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000048"), "services.traumaEvaluation"),
        new(new Guid("00000001-0000-0000-0000-000000000049"), "services.acuteCare"),
        new(new Guid("00000001-0000-0000-0000-000000000050"), "services.minorEmergency"),
        new(new Guid("00000001-0000-0000-0000-000000000051"), "services.icuConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000052"), "services.criticalCareEvaluation"),
        new(new Guid("00000001-0000-0000-0000-000000000053"), "services.ventilatorManagement"),
        new(new Guid("00000001-0000-0000-0000-000000000054"), "services.familyMeeting"),
        new(new Guid("00000001-0000-0000-0000-000000000055"), "services.prenatalVisit"),
        new(new Guid("00000001-0000-0000-0000-000000000056"), "services.postnatalCheckup"),
        new(new Guid("00000001-0000-0000-0000-000000000057"), "services.ultrasound"),
        new(new Guid("00000001-0000-0000-0000-000000000058"), "services.cervicalSmear"),
        new(new Guid("00000001-0000-0000-0000-000000000059"), "services.familyPlanning"),
        new(new Guid("00000001-0000-0000-0000-000000000060"), "services.fertilityConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000061"), "services.menopauseManagement"),
        new(new Guid("00000001-0000-0000-0000-000000000062"), "services.growthEvaluation"),
        new(new Guid("00000001-0000-0000-0000-000000000063"), "services.bloodPressureCheck"),
        new(new Guid("00000001-0000-0000-0000-000000000064"), "services.healthEducation"),
        new(new Guid("00000001-0000-0000-0000-000000000065"), "services.homeVisit"),

        // Psychiatry / Psychology
        new(new Guid("00000001-0000-0000-0000-000000000066"), "services.psychotherapy"),
        new(new Guid("00000001-0000-0000-0000-000000000067"), "services.groupTherapy"),
        new(new Guid("00000001-0000-0000-0000-000000000068"), "services.cognitiveBehavioralTherapy"),
        new(new Guid("00000001-0000-0000-0000-000000000069"), "services.mentalHealthAssessment"),
        new(new Guid("00000001-0000-0000-0000-000000000070"), "services.substanceAbuseConsultation"),

        // Ophthalmology
        new(new Guid("00000001-0000-0000-0000-000000000071"), "services.eyeExamination"),
        new(new Guid("00000001-0000-0000-0000-000000000072"), "services.glaucomaScreening"),
        new(new Guid("00000001-0000-0000-0000-000000000073"), "services.contactLensFitting"),
        new(new Guid("00000001-0000-0000-0000-000000000074"), "services.refractionTest"),
        new(new Guid("00000001-0000-0000-0000-000000000075"), "services.retinalExamination"),

        // ENT
        new(new Guid("00000001-0000-0000-0000-000000000076"), "services.hearingAssessment"),
        new(new Guid("00000001-0000-0000-0000-000000000077"), "services.audiometry"),
        new(new Guid("00000001-0000-0000-0000-000000000078"), "services.nasalEndoscopy"),
        new(new Guid("00000001-0000-0000-0000-000000000079"), "services.tonsillitisManagement"),
        new(new Guid("00000001-0000-0000-0000-000000000080"), "services.sinusitisManagement"),

        // Dentistry
        new(new Guid("00000001-0000-0000-0000-000000000081"), "services.dentalCleaning"),
        new(new Guid("00000001-0000-0000-0000-000000000082"), "services.toothExtraction"),
        new(new Guid("00000001-0000-0000-0000-000000000083"), "services.rootCanalTreatment"),
        new(new Guid("00000001-0000-0000-0000-000000000084"), "services.dentalImplantConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000085"), "services.orthodonticConsultation"),
        new(new Guid("00000001-0000-0000-0000-000000000086"), "services.toothWhitening"),

        // Physiotherapy
        new(new Guid("00000001-0000-0000-0000-000000000087"), "services.physicalRehabilitation"),
        new(new Guid("00000001-0000-0000-0000-000000000088"), "services.manualTherapy"),
        new(new Guid("00000001-0000-0000-0000-000000000089"), "services.electrotherapy"),
        new(new Guid("00000001-0000-0000-0000-000000000090"), "services.posturalAssessment"),

        // Pharmacy
        new(new Guid("00000001-0000-0000-0000-000000000091"), "services.medicationReview"),
        new(new Guid("00000001-0000-0000-0000-000000000092"), "services.medicationCounseling"),

        // Dermatology
        new(new Guid("00000001-0000-0000-0000-000000000093"), "services.dermatoscopy"),
        new(new Guid("00000001-0000-0000-0000-000000000094"), "services.skinBiopsy"),
        new(new Guid("00000001-0000-0000-0000-000000000095"), "services.skinLaserTreatment"),
        new(new Guid("00000001-0000-0000-0000-000000000096"), "services.allergyTesting"),
        new(new Guid("00000001-0000-0000-0000-000000000097"), "services.acneManagement"),

        // Pulmonology
        new(new Guid("00000001-0000-0000-0000-000000000098"), "services.spirometry"),
        new(new Guid("00000001-0000-0000-0000-000000000099"), "services.bronchoscopy"),
        new(new Guid("00000001-0000-0000-0000-000000000100"), "services.sleepStudy"),
        new(new Guid("00000001-0000-0000-0000-000000000101"), "services.asthmaManagement"),
        new(new Guid("00000001-0000-0000-0000-000000000102"), "services.copdManagement"),

        // Cardiology
        new(new Guid("00000001-0000-0000-0000-000000000103"), "services.echocardiography"),
        new(new Guid("00000001-0000-0000-0000-000000000104"), "services.stressTest"),
        new(new Guid("00000001-0000-0000-0000-000000000105"), "services.holterMonitoring"),
        new(new Guid("00000001-0000-0000-0000-000000000106"), "services.ecgInterpretation"),
        new(new Guid("00000001-0000-0000-0000-000000000107"), "services.cardiacRehabilitation"),

        // Gastroenterology
        new(new Guid("00000001-0000-0000-0000-000000000108"), "services.colonoscopy"),
        new(new Guid("00000001-0000-0000-0000-000000000109"), "services.gastroscopy"),
        new(new Guid("00000001-0000-0000-0000-000000000110"), "services.liverBiopsy"),
        new(new Guid("00000001-0000-0000-0000-000000000111"), "services.ibsManagement"),

        // Nephrology
        new(new Guid("00000001-0000-0000-0000-000000000112"), "services.dialysis"),
        new(new Guid("00000001-0000-0000-0000-000000000113"), "services.kidneyBiopsy"),
        new(new Guid("00000001-0000-0000-0000-000000000114"), "services.renalFunctionTest"),

        // Endocrinology
        new(new Guid("00000001-0000-0000-0000-000000000115"), "services.diabetesManagement"),
        new(new Guid("00000001-0000-0000-0000-000000000116"), "services.hormoneTesting"),
        new(new Guid("00000001-0000-0000-0000-000000000117"), "services.thyroidEvaluation"),
        new(new Guid("00000001-0000-0000-0000-000000000118"), "services.nutritionCounseling"),

        // Neurology
        new(new Guid("00000001-0000-0000-0000-000000000119"), "services.eeg"),
        new(new Guid("00000001-0000-0000-0000-000000000120"), "services.emg"),
        new(new Guid("00000001-0000-0000-0000-000000000121"), "services.strokeAssessment"),
        new(new Guid("00000001-0000-0000-0000-000000000122"), "services.epilepsyManagement"),
        new(new Guid("00000001-0000-0000-0000-000000000123"), "services.migraineManagement"),

        // OB/GYN extras
        new(new Guid("00000001-0000-0000-0000-000000000124"), "services.colposcopy"),
        new(new Guid("00000001-0000-0000-0000-000000000125"), "services.hysteroscopy"),

        // Pediatrics extras
        new(new Guid("00000001-0000-0000-0000-000000000126"), "services.developmentalAssessment"),
        new(new Guid("00000001-0000-0000-0000-000000000127"), "services.neonatalCare"),
    ];
}
