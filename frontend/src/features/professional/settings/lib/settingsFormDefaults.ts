export function ProfileAndBioFormDefaults() {
  return {
    firstName: "",
    lastName: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
    },
    specialization: "",
    services: [] as string[],
    startPrice: 0,
    endPrice: 0,
    bio: "",
  };
}
