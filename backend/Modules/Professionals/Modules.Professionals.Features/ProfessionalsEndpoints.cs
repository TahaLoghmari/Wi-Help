namespace Modules.Professionals.Features;

public static class ProfessionalsEndpoints
{
    public const string RegisterProfessional = "professionals/register";
    public const string UpdateProfessional = "professionals/me";
    public const string GetCurrentProfessional = "professionals/me";
    public const string GetProfessionalById = "professionals/{professionalId}";
    public const string SetupSchedule = "professionals/schedule";
    public const string GetSchedule = "professionals/schedule";
    public const string GetAllProfessionals = "professionals";
    public const string GetProfessionalAvailability = "professionals/{professionalId}/availability";
    public const string UploadVerificationDocument = "professionals/me/documents";
    public const string GetVerificationDocuments = "professionals/me/documents";
    
    // Awards endpoints (current professional)
    public const string GetAwards = "professionals/me/awards";
    public const string CreateAward = "professionals/me/awards";
    public const string UpdateAward = "professionals/me/awards/{awardId}";
    public const string DeleteAward = "professionals/me/awards/{awardId}";
    
    // Education endpoints (current professional)
    public const string GetEducations = "professionals/me/educations";
    public const string CreateEducation = "professionals/me/educations";
    public const string UpdateEducation = "professionals/me/educations/{educationId}";
    public const string DeleteEducation = "professionals/me/educations/{educationId}";
    
    // Experience endpoints (current professional)
    public const string GetExperiences = "professionals/me/experiences";
    public const string CreateExperience = "professionals/me/experiences";
    public const string UpdateExperience = "professionals/me/experiences/{experienceId}";
    public const string DeleteExperience = "professionals/me/experiences/{experienceId}";
    
    // Public professional profile endpoints (by professional ID)
    public const string GetProfessionalEducations = "professionals/{professionalId}/educations";
    public const string GetProfessionalExperiences = "professionals/{professionalId}/experiences";
    public const string GetProfessionalAwards = "professionals/{professionalId}/awards";
    public const string GetProfessionalDocuments = "professionals/{professionalId}/documents";
    
    public const string UpdateAccountStatus = "professionals/{professionalId}/status";
    public const string GetProfessionalsForAdmin = "professionals/admin";
    public const string GetVerificationDocumentsForAdmin = "professionals/admin/documents";
    public const string UpdateDocumentStatus = "professionals/admin/documents/{documentId}/status";
}


