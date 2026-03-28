export interface ProblemDetailsDto {
  title?: string;
  detail?: string;
  type?: string;
  status?: number;
  errors?: Array<{ code: string; description: string; type: number }>;
}

export interface PaginationResultDto<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  countryId: string;
  stateId: string;
}

export interface LookupDto {
  id: string;
  key: string;
}

export interface CountryDto {
  id: string;
  key: string;
}

export interface StateDto {
  id: string;
  key: string;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: Address;
  profilePictureUrl: string;
  role: string;
  location?: LocationCoordinates | null;
  isOnboardingCompleted: boolean;
}
