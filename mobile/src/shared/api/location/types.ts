export interface Address {
  street: string;
  city: string;
  postalCode: string;
  countryId: string;
  stateId: string;
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
