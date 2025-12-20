import type { Address } from "@/features/auth";

export interface UpdateProfessionalRequest {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  address?: Address | null;
  specialization?: string | null;
  services?: string[] | null;
  experience?: number | null;
  startPrice?: number | null;
  endPrice?: number | null;
  bio?: string | null;
  profilePicture?: File | null;
}
