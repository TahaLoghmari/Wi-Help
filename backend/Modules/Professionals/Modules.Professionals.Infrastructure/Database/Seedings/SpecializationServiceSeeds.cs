namespace Modules.Professionals.Infrastructure.Database.Seedings;

internal static class SpecializationServiceSeeds
{
    // Maps specialization IDs to service IDs for the specialization_services junction table.
    // Each entry is { specialization_id, service_id }.
    public static readonly object[] All = BuildSeedData();

    private static object[] BuildSeedData()
    {
        // Common services shared by most specializations
        var common = new[]
        {
            "00000001-0000-0000-0000-000000000001", // initialConsultation
            "00000001-0000-0000-0000-000000000002", // followUpVisit
            "00000001-0000-0000-0000-000000000003", // teleconsultation
            "00000001-0000-0000-0000-000000000005", // secondOpinion
            "00000001-0000-0000-0000-000000000006", // prescriptionRenewal
            "00000001-0000-0000-0000-000000000007", // medicalCertificate
        };

        var mapping = new Dictionary<string, string[]>
        {
            // generalPractitioner
            ["00000004-0000-0000-0000-000000000001"] = [..common,
                "00000001-0000-0000-0000-000000000004", // emergencyConsultation
                "00000001-0000-0000-0000-000000000008", // healthCheckup
                "00000001-0000-0000-0000-000000000009", // vaccination
                "00000001-0000-0000-0000-000000000010", // minorProcedure
                "00000001-0000-0000-0000-000000000011", // woundCare
                "00000001-0000-0000-0000-000000000012", // travelMedicine
                "00000001-0000-0000-0000-000000000014", // chronicDiseaseManagement
                "00000001-0000-0000-0000-000000000015", // preventiveCare
                "00000001-0000-0000-0000-000000000063", // bloodPressureCheck
                "00000001-0000-0000-0000-000000000064", // healthEducation
                "00000001-0000-0000-0000-000000000065", // homeVisit
                "00000001-0000-0000-0000-000000000115", // diabetesManagement
                "00000001-0000-0000-0000-000000000118", // nutritionCounseling
            ],
            // familyMedicine
            ["00000004-0000-0000-0000-000000000002"] = [..common,
                "00000001-0000-0000-0000-000000000008", // healthCheckup
                "00000001-0000-0000-0000-000000000009", // vaccination
                "00000001-0000-0000-0000-000000000013", // wellChildVisit
                "00000001-0000-0000-0000-000000000014", // chronicDiseaseManagement
                "00000001-0000-0000-0000-000000000015", // preventiveCare
                "00000001-0000-0000-0000-000000000063", // bloodPressureCheck
                "00000001-0000-0000-0000-000000000064", // healthEducation
                "00000001-0000-0000-0000-000000000065", // homeVisit
                "00000001-0000-0000-0000-000000000115", // diabetesManagement
                "00000001-0000-0000-0000-000000000118", // nutritionCounseling
            ],
            // internalMedicine
            ["00000004-0000-0000-0000-000000000003"] = [..common,
                "00000001-0000-0000-0000-000000000008", // healthCheckup
                "00000001-0000-0000-0000-000000000014", // chronicDiseaseManagement
                "00000001-0000-0000-0000-000000000015", // preventiveCare
                "00000001-0000-0000-0000-000000000016", // diagnosticConsultation
                "00000001-0000-0000-0000-000000000017", // preoperativeEvaluation
                "00000001-0000-0000-0000-000000000018", // complexCaseReview
            ],
            // generalSurgery
            ["00000004-0000-0000-0000-000000000004"] = [..common,
                "00000001-0000-0000-0000-000000000019", // preoperativeConsultation
                "00000001-0000-0000-0000-000000000020", // postoperativeFollowUp
                "00000001-0000-0000-0000-000000000021", // surgicalConsultation
                "00000001-0000-0000-0000-000000000022", // woundManagement
            ],
            // orthopedicSurgery
            ["00000004-0000-0000-0000-000000000005"] = [..common,
                "00000001-0000-0000-0000-000000000019", // preoperativeConsultation
                "00000001-0000-0000-0000-000000000020", // postoperativeFollowUp
                "00000001-0000-0000-0000-000000000023", // jointConsultation
                "00000001-0000-0000-0000-000000000024", // sportsInjuryEvaluation
                "00000001-0000-0000-0000-000000000025", // fractureManagement
                "00000001-0000-0000-0000-000000000026", // castRemoval
            ],
            // neurosurgery
            ["00000004-0000-0000-0000-000000000006"] = [..common,
                "00000001-0000-0000-0000-000000000019", // preoperativeConsultation
                "00000001-0000-0000-0000-000000000020", // postoperativeFollowUp
                "00000001-0000-0000-0000-000000000027", // neurologicalEvaluation
                "00000001-0000-0000-0000-000000000028", // painManagement
                "00000001-0000-0000-0000-000000000119", // eeg
                "00000001-0000-0000-0000-000000000120", // emg
            ],
            // plasticSurgery
            ["00000004-0000-0000-0000-000000000007"] = [..common,
                "00000001-0000-0000-0000-000000000019", // preoperativeConsultation
                "00000001-0000-0000-0000-000000000020", // postoperativeFollowUp
                "00000001-0000-0000-0000-000000000029", // aestheticConsultation
                "00000001-0000-0000-0000-000000000030", // reconstructiveConsultation
                "00000001-0000-0000-0000-000000000031", // scarRevision
            ],
            // cardiothoracicSurgery
            ["00000004-0000-0000-0000-000000000008"] = [..common,
                "00000001-0000-0000-0000-000000000019", // preoperativeConsultation
                "00000001-0000-0000-0000-000000000020", // postoperativeFollowUp
                "00000001-0000-0000-0000-000000000032", // cardiacConsultation
                "00000001-0000-0000-0000-000000000033", // riskAssessment
            ],
            // urology
            ["00000004-0000-0000-0000-000000000009"] = [..common,
                "00000001-0000-0000-0000-000000000019", // preoperativeConsultation
                "00000001-0000-0000-0000-000000000020", // postoperativeFollowUp
                "00000001-0000-0000-0000-000000000034", // urologicalEvaluation
                "00000001-0000-0000-0000-000000000035", // prostateScreening
                "00000001-0000-0000-0000-000000000036", // kidneyStoneManagement
                "00000001-0000-0000-0000-000000000037", // bladderEvaluation
            ],
            // radiology
            ["00000004-0000-0000-0000-000000000010"] = [..common,
                "00000001-0000-0000-0000-000000000038", // xrayInterpretation
                "00000001-0000-0000-0000-000000000039", // ctScanConsultation
                "00000001-0000-0000-0000-000000000040", // mriConsultation
                "00000001-0000-0000-0000-000000000041", // ultrasoundConsultation
                "00000001-0000-0000-0000-000000000042", // mammographyReview
                "00000001-0000-0000-0000-000000000043", // imageGuidedProcedure
            ],
            // pathology
            ["00000004-0000-0000-0000-000000000011"] = [..common,
                "00000001-0000-0000-0000-000000000044", // biopsyReview
                "00000001-0000-0000-0000-000000000045", // labResultsConsultation
                "00000001-0000-0000-0000-000000000046", // cytologicalReview
                "00000001-0000-0000-0000-000000000047", // histopathologicalConsultation
            ],
            // emergencyMedicine
            ["00000004-0000-0000-0000-000000000012"] = [..common,
                "00000001-0000-0000-0000-000000000004", // emergencyConsultation
                "00000001-0000-0000-0000-000000000048", // traumaEvaluation
                "00000001-0000-0000-0000-000000000049", // acuteCare
                "00000001-0000-0000-0000-000000000050", // minorEmergency
                "00000001-0000-0000-0000-000000000011", // woundCare
            ],
            // criticalCare
            ["00000004-0000-0000-0000-000000000013"] = [..common,
                "00000001-0000-0000-0000-000000000051", // icuConsultation
                "00000001-0000-0000-0000-000000000052", // criticalCareEvaluation
                "00000001-0000-0000-0000-000000000053", // ventilatorManagement
                "00000001-0000-0000-0000-000000000054", // familyMeeting
            ],
            // obstetricsAndGynecology
            ["00000004-0000-0000-0000-000000000014"] = [..common,
                "00000001-0000-0000-0000-000000000055", // prenatalVisit
                "00000001-0000-0000-0000-000000000056", // postnatalCheckup
                "00000001-0000-0000-0000-000000000057", // ultrasound
                "00000001-0000-0000-0000-000000000058", // cervicalSmear
                "00000001-0000-0000-0000-000000000059", // familyPlanning
                "00000001-0000-0000-0000-000000000060", // fertilityConsultation
                "00000001-0000-0000-0000-000000000061", // menopauseManagement
                "00000001-0000-0000-0000-000000000124", // colposcopy
                "00000001-0000-0000-0000-000000000125", // hysteroscopy
            ],
            // pediatrics
            ["00000004-0000-0000-0000-000000000015"] = [..common,
                "00000001-0000-0000-0000-000000000009", // vaccination
                "00000001-0000-0000-0000-000000000013", // wellChildVisit
                "00000001-0000-0000-0000-000000000062", // growthEvaluation
                "00000001-0000-0000-0000-000000000064", // healthEducation
                "00000001-0000-0000-0000-000000000126", // developmentalAssessment
                "00000001-0000-0000-0000-000000000127", // neonatalCare
            ],
            // psychiatry
            ["00000004-0000-0000-0000-000000000016"] = [..common,
                "00000001-0000-0000-0000-000000000016", // diagnosticConsultation
                "00000001-0000-0000-0000-000000000028", // painManagement
                "00000001-0000-0000-0000-000000000066", // psychotherapy
                "00000001-0000-0000-0000-000000000067", // groupTherapy
                "00000001-0000-0000-0000-000000000068", // cognitiveBehavioralTherapy
                "00000001-0000-0000-0000-000000000069", // mentalHealthAssessment
                "00000001-0000-0000-0000-000000000070", // substanceAbuseConsultation
            ],
            // psychology
            ["00000004-0000-0000-0000-000000000017"] = [..common,
                "00000001-0000-0000-0000-000000000016", // diagnosticConsultation
                "00000001-0000-0000-0000-000000000066", // psychotherapy
                "00000001-0000-0000-0000-000000000067", // groupTherapy
                "00000001-0000-0000-0000-000000000068", // cognitiveBehavioralTherapy
                "00000001-0000-0000-0000-000000000069", // mentalHealthAssessment
                "00000001-0000-0000-0000-000000000070", // substanceAbuseConsultation
            ],
            // cardiology
            ["00000004-0000-0000-0000-000000000018"] = [..common,
                "00000001-0000-0000-0000-000000000032", // cardiacConsultation
                "00000001-0000-0000-0000-000000000033", // riskAssessment
                "00000001-0000-0000-0000-000000000063", // bloodPressureCheck
                "00000001-0000-0000-0000-000000000016", // diagnosticConsultation
                "00000001-0000-0000-0000-000000000103", // echocardiography
                "00000001-0000-0000-0000-000000000104", // stressTest
                "00000001-0000-0000-0000-000000000105", // holterMonitoring
                "00000001-0000-0000-0000-000000000106", // ecgInterpretation
                "00000001-0000-0000-0000-000000000107", // cardiacRehabilitation
            ],
            // pulmonology
            ["00000004-0000-0000-0000-000000000019"] = [..common,
                "00000001-0000-0000-0000-000000000016", // diagnosticConsultation
                "00000001-0000-0000-0000-000000000014", // chronicDiseaseManagement
                "00000001-0000-0000-0000-000000000098", // spirometry
                "00000001-0000-0000-0000-000000000099", // bronchoscopy
                "00000001-0000-0000-0000-000000000100", // sleepStudy
                "00000001-0000-0000-0000-000000000101", // asthmaManagement
                "00000001-0000-0000-0000-000000000102", // copdManagement
            ],
            // gastroenterology
            ["00000004-0000-0000-0000-000000000020"] = [..common,
                "00000001-0000-0000-0000-000000000016", // diagnosticConsultation
                "00000001-0000-0000-0000-000000000010", // minorProcedure
                "00000001-0000-0000-0000-000000000108", // colonoscopy
                "00000001-0000-0000-0000-000000000109", // gastroscopy
                "00000001-0000-0000-0000-000000000110", // liverBiopsy
                "00000001-0000-0000-0000-000000000111", // ibsManagement
            ],
            // nephrology
            ["00000004-0000-0000-0000-000000000021"] = [..common,
                "00000001-0000-0000-0000-000000000016", // diagnosticConsultation
                "00000001-0000-0000-0000-000000000014", // chronicDiseaseManagement
                "00000001-0000-0000-0000-000000000112", // dialysis
                "00000001-0000-0000-0000-000000000113", // kidneyBiopsy
                "00000001-0000-0000-0000-000000000114", // renalFunctionTest
            ],
            // endocrinology
            ["00000004-0000-0000-0000-000000000022"] = [..common,
                "00000001-0000-0000-0000-000000000016", // diagnosticConsultation
                "00000001-0000-0000-0000-000000000014", // chronicDiseaseManagement
                "00000001-0000-0000-0000-000000000115", // diabetesManagement
                "00000001-0000-0000-0000-000000000116", // hormoneTesting
                "00000001-0000-0000-0000-000000000117", // thyroidEvaluation
                "00000001-0000-0000-0000-000000000118", // nutritionCounseling
            ],
            // dermatology
            ["00000004-0000-0000-0000-000000000023"] = [..common,
                "00000001-0000-0000-0000-000000000016", // diagnosticConsultation
                "00000001-0000-0000-0000-000000000010", // minorProcedure
                "00000001-0000-0000-0000-000000000029", // aestheticConsultation
                "00000001-0000-0000-0000-000000000093", // dermatoscopy
                "00000001-0000-0000-0000-000000000094", // skinBiopsy
                "00000001-0000-0000-0000-000000000095", // skinLaserTreatment
                "00000001-0000-0000-0000-000000000096", // allergyTesting
                "00000001-0000-0000-0000-000000000097", // acneManagement
            ],
            // ophthalmology
            ["00000004-0000-0000-0000-000000000024"] = [..common,
                "00000001-0000-0000-0000-000000000016", // diagnosticConsultation
                "00000001-0000-0000-0000-000000000010", // minorProcedure
                "00000001-0000-0000-0000-000000000071", // eyeExamination
                "00000001-0000-0000-0000-000000000072", // glaucomaScreening
                "00000001-0000-0000-0000-000000000073", // contactLensFitting
                "00000001-0000-0000-0000-000000000074", // refractionTest
                "00000001-0000-0000-0000-000000000075", // retinalExamination
                "00000001-0000-0000-0000-000000000019", // preoperativeConsultation
                "00000001-0000-0000-0000-000000000020", // postoperativeFollowUp
            ],
            // ent
            ["00000004-0000-0000-0000-000000000025"] = [..common,
                "00000001-0000-0000-0000-000000000016", // diagnosticConsultation
                "00000001-0000-0000-0000-000000000010", // minorProcedure
                "00000001-0000-0000-0000-000000000076", // hearingAssessment
                "00000001-0000-0000-0000-000000000077", // audiometry
                "00000001-0000-0000-0000-000000000078", // nasalEndoscopy
                "00000001-0000-0000-0000-000000000079", // tonsillitisManagement
                "00000001-0000-0000-0000-000000000080", // sinusitisManagement
            ],
            // dentistry
            ["00000004-0000-0000-0000-000000000026"] = [..common,
                "00000001-0000-0000-0000-000000000010", // minorProcedure
                "00000001-0000-0000-0000-000000000015", // preventiveCare
                "00000001-0000-0000-0000-000000000081", // dentalCleaning
                "00000001-0000-0000-0000-000000000082", // toothExtraction
                "00000001-0000-0000-0000-000000000083", // rootCanalTreatment
                "00000001-0000-0000-0000-000000000084", // dentalImplantConsultation
                "00000001-0000-0000-0000-000000000085", // orthodonticConsultation
                "00000001-0000-0000-0000-000000000086", // toothWhitening
            ],
            // physiotherapy
            ["00000004-0000-0000-0000-000000000027"] = [..common,
                "00000001-0000-0000-0000-000000000024", // sportsInjuryEvaluation
                "00000001-0000-0000-0000-000000000028", // painManagement
                "00000001-0000-0000-0000-000000000065", // homeVisit
                "00000001-0000-0000-0000-000000000087", // physicalRehabilitation
                "00000001-0000-0000-0000-000000000088", // manualTherapy
                "00000001-0000-0000-0000-000000000089", // electrotherapy
                "00000001-0000-0000-0000-000000000090", // posturalAssessment
            ],
            // pharmacy
            ["00000004-0000-0000-0000-000000000028"] = [..common,
                "00000001-0000-0000-0000-000000000064", // healthEducation
                "00000001-0000-0000-0000-000000000009", // vaccination
                "00000001-0000-0000-0000-000000000091", // medicationReview
                "00000001-0000-0000-0000-000000000092", // medicationCounseling
            ],
            // nursing
            ["00000004-0000-0000-0000-000000000029"] = [..common,
                "00000001-0000-0000-0000-000000000009", // vaccination
                "00000001-0000-0000-0000-000000000011", // woundCare
                "00000001-0000-0000-0000-000000000063", // bloodPressureCheck
                "00000001-0000-0000-0000-000000000065", // homeVisit
            ],
            // other
            ["00000004-0000-0000-0000-000000000030"] = [..common,
                "00000001-0000-0000-0000-000000000008", // healthCheckup
                "00000001-0000-0000-0000-000000000064", // healthEducation
            ],
        };

        var result = new List<object>();
        foreach (var (specId, serviceIds) in mapping)
        {
            foreach (var serviceId in serviceIds)
            {
                result.Add(new Dictionary<string, object>
                {
                    ["specialization_id"] = new Guid(specId),
                    ["service_id"] = new Guid(serviceId)
                });
            }
        }

        return result.ToArray();
    }
}
