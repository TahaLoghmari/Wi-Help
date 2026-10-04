import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { REVIEW_ENDPOINTS } from "@/features/reviews/api/endpoints";
import { api } from "@/shared/api/api-client";
import type { PaginationResultDto } from "@/shared/api/enums.types";
import type {
  ReplyToReviewRequest,
  ReviewDto,
  ReviewStatsDto,
  UpdateReviewRequest,
} from "./contracts";
import { reviewKeys } from "./keys";

interface SubmitReviewRequest {
  comment: string;
  rating: number;
}

interface ReviewMutationVariables {
  reviewId: string;
  data: UpdateReviewRequest;
}

interface ReplyMutationVariables {
  reviewId: string;
  data: ReplyToReviewRequest;
}

interface EditReplyVariables extends ReplyMutationVariables {
  replyId: string;
}

interface DeleteReplyVariables {
  reviewId: string;
  replyId: string;
}

export function useGetReviews(subjectId: string) {
  return useInfiniteQuery<PaginationResultDto<ReviewDto>>({
    queryKey: reviewKeys.bySubject(subjectId),
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginationResultDto<ReviewDto>>(
        `${REVIEW_ENDPOINTS.GET_REVIEWS}?subjectId=${subjectId}&page=${pageParam as number}&pageSize=10`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
  });
}

export function useGetReviewStats(subjectId: string) {
  return useQuery<ReviewStatsDto>({
    queryKey: reviewKeys.statsBySubject(subjectId),
    queryFn: () =>
      api.get<ReviewStatsDto>(
        `${REVIEW_ENDPOINTS.GET_REVIEW_STATS}?subjectId=${subjectId}`,
      ),
  });
}

export function useSubmitReview(subjectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitReviewRequest) =>
      api.post(REVIEW_ENDPOINTS.SUBMIT_REVIEW, { subjectId, ...data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.bySubject(subjectId),
      });
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.statsBySubject(subjectId),
      });
    },
  });
}

export function useUpdateReview(subjectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, data }: ReviewMutationVariables) =>
      api.put(REVIEW_ENDPOINTS.UPDATE_REVIEW(reviewId), data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.bySubject(subjectId),
      });
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.statsBySubject(subjectId),
      });
    },
  });
}

export function useDeleteReview(subjectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) =>
      api.delete(REVIEW_ENDPOINTS.DELETE_REVIEW(reviewId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.bySubject(subjectId),
      });
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.statsBySubject(subjectId),
      });
    },
  });
}

export function useToggleReviewLike(subjectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, isLiked }: { reviewId: string; isLiked: boolean }) =>
      isLiked
        ? api.delete(REVIEW_ENDPOINTS.UNLIKE_REVIEW(reviewId))
        : api.post(REVIEW_ENDPOINTS.LIKE_REVIEW(reviewId), {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.bySubject(subjectId),
      });
    },
  });
}

export function useReplyToReview(subjectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, data }: ReplyMutationVariables) =>
      api.post(REVIEW_ENDPOINTS.REPLY_TO_REVIEW(reviewId), data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.bySubject(subjectId),
      });
    },
  });
}

export function useEditReply(subjectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, replyId, data }: EditReplyVariables) =>
      api.put(REVIEW_ENDPOINTS.EDIT_REPLY(reviewId, replyId), data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.bySubject(subjectId),
      });
    },
  });
}

export function useDeleteReply(subjectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, replyId }: DeleteReplyVariables) =>
      api.delete(REVIEW_ENDPOINTS.DELETE_REPLY(reviewId, replyId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.bySubject(subjectId),
      });
    },
  });
}
