
import { BookingPage } from '@/features/patient/find-professional/book/book';
import { createFileRoute } from '@tanstack/react-router'
import { ContentLoading } from '@/components/ui';
export const Route = createFileRoute('/book')({
  component: BookingPage,
  pendingComponent: ContentLoading,
});
