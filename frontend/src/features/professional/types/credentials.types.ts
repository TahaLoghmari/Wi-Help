// Credentials types are now located in individual hook folders for better organization
// - Award types: hooks/GetAwards, hooks/CreateAward, hooks/UpdateAward
// - Education types: hooks/GetEducations, hooks/CreateEducation, hooks/UpdateEducation
// - Experience types: hooks/GetExperiences, hooks/CreateExperience, hooks/UpdateExperience

// Re-export for backward compatibility
export type { GetAwardsDto as AwardDto } from "../hooks/GetAwards";
export type { CreateAwardRequest } from "../hooks/CreateAward";
export type { UpdateAwardRequest } from "../hooks/UpdateAward";

export type { GetEducationsDto as EducationDto } from "../hooks/GetEducations";
export type { CreateEducationRequest } from "../hooks/CreateEducation";
export type { UpdateEducationRequest } from "../hooks/UpdateEducation";

export type { GetExperiencesDto as ExperienceDto } from "../hooks/GetExperiences";
export type { CreateExperienceRequest } from "../hooks/CreateExperience";
export type { UpdateExperienceRequest } from "../hooks/UpdateExperience";
