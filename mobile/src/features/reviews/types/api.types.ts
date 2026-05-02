export enum ReviewType {
  ProfessionalReview = 1,
  PatientReview = 2,
}

export interface ReviewAuthorDto {
  id: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string | null;
}

export interface ReviewReplyDto {
  id: string;
  reviewId: string;
  userId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
}

export interface ReviewDto {
  id: string;
  comment: string;
  rating: number;
  type: ReviewType;
  createdAt: string;
  updatedAt: string;
  author: ReviewAuthorDto;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  replies: ReviewReplyDto[];
}

export interface ReviewStatsDto {
  averageRating: number;
  totalCount: number;
}

export interface SubmitPatientReviewRequest {
  patientId: string;
  comment: string;
  rating: number;
}

export interface UpdateReviewRequest {
  comment: string;
  rating: number;
}

export interface ReplyToReviewRequest {
  comment: string;
}
