export interface CreateAwardRequest {
  title: string;
  issuer?: string | null;
  description?: string | null;
  yearReceived: string;
}
