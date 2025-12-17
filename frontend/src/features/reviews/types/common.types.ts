import type { PatientDto } from "@/features/patient";
import type { ProfessionalDto } from "@/features/professional";

export interface ReviewReplyDto {
  id: string;
  reviewId: string;
  userId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userFirstName?: string;
  userLastName?: string;
  userProfilePictureUrl?: string;
  isProfessional: boolean;
}

export interface GetProfessionalReviewsDto {
  id: string;
  patientId: string;
  professionalId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  patient: PatientDto;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  replies: ReviewReplyDto[];
}

export interface GetPatientReviewsDto {
  id: string;
  patientId: string;
  professionalId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  professional: ProfessionalDto;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  replies: ReviewReplyDto[];
}

export interface GetProfessionalReviewsRequest {
  professionalId: string;
  page?: number;
  pageSize?: number;
}

export interface GetPatientReviewsRequest {
  patientId: string;
  page?: number;
  pageSize?: number;
}

export interface GetProfessionalReviewStatsDto {
  averageRating: number;
  totalCount: number;
}

export interface GetPatientReviewStatsDto {
  averageRating: number;
  totalCount: number;
}

export interface SubmitReviewRequest {
  professionalId: string;
  comment: string;
  rating: number;
}

export interface SubmitPatientReviewRequest {
  patientId: string;
  comment: string;
  rating: number;
}

export interface LikeReviewRequest {
  reviewId: string;
}

export interface UnlikeReviewRequest {
  reviewId: string;
}

export interface ReplyToReviewRequest {
  reviewId: string;
  comment: string;
}

export interface UpdateReviewRequest {
  reviewId: string;
  comment: string;
  rating: number;
}

export interface DeleteReviewRequest {
  reviewId: string;
}

export interface PaginationResultDto<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}
