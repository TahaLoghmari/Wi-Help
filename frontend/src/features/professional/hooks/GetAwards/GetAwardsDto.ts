export interface GetAwardsDto {
  id: string;
  title: string;
  issuer?: string | null;
  description?: string | null;
  yearReceived: string;
  createdAt: string;
  updatedAt: string;
}
