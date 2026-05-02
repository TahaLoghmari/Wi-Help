export const ReviewType = {
  ProfessionalReview: 1,
  PatientReview: 2,
} as const;

export type ReviewType = (typeof ReviewType)[keyof typeof ReviewType];

export interface ReviewAuthorDto {
  id: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}

export interface ReviewReplyDto {
  id: string;
  reviewId: string;
  userId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
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

export interface GetReviewsRequest {
  subjectId?: string;
  reviewerId?: string;
  page?: number;
  pageSize?: number;
}

export interface SubmitReviewRequest {
  subjectId: string;
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

export interface EditReplyRequest {
  reviewId: string;
  replyId: string;
  comment: string;
}

export interface DeleteReplyRequest {
  reviewId: string;
  replyId: string;
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
