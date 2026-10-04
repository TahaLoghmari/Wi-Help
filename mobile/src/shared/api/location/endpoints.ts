export const LOCATION_ENDPOINTS = {
  GET_COUNTRIES: "/countries",
  GET_STATES_BY_COUNTRY: (countryId: string) =>
    `/countries/${countryId}/states`,
} as const;
