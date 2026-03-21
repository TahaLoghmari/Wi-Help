import type { Address } from "@/features/auth";

export interface UpdateProfessionalRequest {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  address?: Address | null;
  specializationId?: string | null;
  experience?: number | null;
  visitPrice?: number | null;
  bio?: string | null;
  profilePicture?: File | null;
  serviceIds?: string[] | null;
}
