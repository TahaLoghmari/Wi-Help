import type { Address } from "@/features/auth";

export interface UpdateProfessionalRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: Address;
  specialization?: string;
  services?: string[];
  experience?: number;
  startPrice?: number;
  endPrice?: number;
  bio?: string;
  profilePicture?: File;
}
