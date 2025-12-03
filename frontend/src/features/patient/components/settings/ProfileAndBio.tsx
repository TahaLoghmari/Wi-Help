import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Spinner,
} from "@/components";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  ALLERGIES,
  CHRONIC_CONDITIONS,
  MEDICATIONS,
  MOBILITY_STATUSES,
  ProfileAndBioFormDefaults,
  profileAndBioFormSchema,
  GetCurrentPatient,
  UpdatePatient,
} from "@/features/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { COUNTRIES, RELATIONSHIPS } from "@/features/auth";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib";
import { useState } from "react";

export function ProfileAndBio() {
  const { data: patient, isLoading, isError } = GetCurrentPatient();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading patient profile. Please try again later.
      </div>
    );
  }

  const form = useForm<z.infer<typeof profileAndBioFormSchema>>({
    resolver: zodResolver(profileAndBioFormSchema),
    mode: "onChange",
    defaultValues: ProfileAndBioFormDefaults(patient!),
  });
  const updatePatientMutation = UpdatePatient();
  const [openAllergies, setOpenAllergies] = useState(false);
  const [openChronicConditions, setOpenChronicConditions] = useState(false);
  const [openMedications, setOpenMedications] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("profilePicture", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = async (
    credentials: z.infer<typeof profileAndBioFormSchema>,
  ) => {
    const cleanedCredentials = {
      ...credentials,
      address:
        credentials.address &&
        credentials.address.street &&
        credentials.address.city &&
        credentials.address.state &&
        credentials.address.postalCode &&
        credentials.address.country
          ? (credentials.address as {
              street: string;
              city: string;
              state: string;
              postalCode: string;
              country: string;
            })
          : undefined,
    };
    updatePatientMutation.mutate(cleanedCredentials);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section
          className="rounded-2xl border border-slate-200 bg-slate-50/70 pt-3 pr-3 pb-3 pl-3 sm:p-4"
          x-data="{ open: true }"
        >
          <header className="mb-2 flex cursor-pointer items-center justify-between select-none">
            <div className="">
              <h3 className="text-brand-dark text-xs font-semibold tracking-tight">
                Basic Information
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Core details shown on your public patient profile.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="chevron-down"
                className="lucide lucide-chevron-down h-3.5 w-3.5"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
          </header>
          <div className="flex flex-col gap-3">
            <div className="my-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    className="object-cover"
                    src={previewUrl || patient?.profilePictureUrl}
                    alt={patient?.firstName}
                  />
                  <AvatarFallback className="rounded-lg">
                    {patient?.firstName && patient?.lastName
                      ? patient.firstName.charAt(0).toUpperCase() +
                        patient.lastName.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 text-[11px] text-slate-600">
                  <p className="font-medium tracking-tight text-slate-900">
                    Profile picture
                  </p>
                  <p className="text-[10px] text-slate-500">
                    JPG, PNG up to 5MB.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] sm:justify-end">
                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormControl>
                        <label className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            data-lucide="upload"
                            className="lucide lucide-upload h-3.5 w-3.5 text-slate-500"
                          >
                            <path d="M12 3v12"></path>
                            <path d="m17 8-5-5-5 5"></path>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          </svg>
                          <span>Upload new</span>
                          <input
                            {...field}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              handleFileChange(event);
                              onChange(event.target.files?.[0]);
                            }}
                          />
                        </label>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button
                  type="button"
                  id="profile-avatar-remove"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-lucide="x"
                    className="lucide lucide-x h-3.5 w-3.5"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                  <span>Remove</span>
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder="Enter first name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Last name
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder="Enter last name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="block text-[11px] font-medium text-slate-700">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <input
                      type="tel"
                      className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <h3 className="text-brand-dark mt-2 text-xs font-semibold tracking-tight">
              Address
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      State
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder="Enter state"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-8! w-full rounded-lg! text-xs shadow-none [&>span]:text-[11px]">
                          <SelectValue
                            className="text-xs placeholder:text-xs"
                            placeholder="Select Country"
                          ></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country, idx) => (
                            <SelectItem key={idx} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      City
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder="Enter city"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.postalCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Postal Code
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder="Enter postal code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <h3 className="text-brand-dark mt-2 text-xs font-semibold tracking-tight">
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="emergencyContact.relationship"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Relationship
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-8! w-full rounded-lg! text-xs shadow-none [&>span]:text-[11px]">
                          <SelectValue
                            className="text-xs placeholder:text-xs"
                            placeholder="Select Relationship"
                          ></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {RELATIONSHIPS.map((relationship, idx) => (
                            <SelectItem key={idx} value={relationship.value}>
                              {relationship.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="emergencyContact.fullName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder="Enter full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContact.phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder="Enter phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <h3 className="text-brand-dark mt-2 text-xs font-semibold tracking-tight">
              Medical Info
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="medicalInfo.allergies"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Allergies
                    </FormLabel>
                    <FormControl>
                      <Popover
                        open={openAllergies}
                        onOpenChange={setOpenAllergies}
                      >
                        <PopoverTrigger
                          asChild
                          className="h-8! rounded-lg shadow-none"
                        >
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openAllergies}
                            className="h-9 w-full justify-between text-xs"
                          >
                            {field.value && field.value.length > 0 ? (
                              <div
                                className={`flex flex-wrap items-center gap-1`}
                              >
                                {field.value.slice(0, 4).map((allergie) => (
                                  <Badge
                                    variant="secondary"
                                    key={allergie}
                                    className="text-[11px]"
                                  >
                                    {ALLERGIES.find((a) => a.value === allergie)
                                      ?.label || allergie}
                                  </Badge>
                                ))}

                                {field.value.length > 4 && (
                                  <Badge variant="outline">
                                    +{field.value.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-[11px]">
                                Add allergie...
                              </p>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search allergies..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No allergie found.</CommandEmpty>
                              <CommandGroup>
                                {ALLERGIES.map((allergie) => (
                                  <CommandItem
                                    key={allergie.value}
                                    value={allergie.value}
                                    onSelect={(currentValue) => {
                                      const currentValues = Array.isArray(
                                        field.value,
                                      )
                                        ? field.value
                                        : [];
                                      const isSelected =
                                        currentValues.includes(currentValue);

                                      if (isSelected) {
                                        field.onChange(
                                          currentValues.filter(
                                            (v) => v !== currentValue,
                                          ),
                                        );
                                      } else {
                                        field.onChange([
                                          ...currentValues,
                                          currentValue,
                                        ]);
                                      }
                                      setOpenAllergies(true);
                                    }}
                                  >
                                    {allergie.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        Array.isArray(field.value) &&
                                          field.value.includes(allergie.value)
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalInfo.chronicConditions"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Chronic Conditions
                    </FormLabel>
                    <FormControl>
                      <Popover
                        open={openChronicConditions}
                        onOpenChange={setOpenChronicConditions}
                      >
                        <PopoverTrigger
                          asChild
                          className="h-8! rounded-lg shadow-none"
                        >
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openChronicConditions}
                            className="h-9 w-full justify-between text-xs"
                          >
                            {field.value && field.value.length > 0 ? (
                              <div
                                className={`flex flex-wrap items-center gap-1`}
                              >
                                {field.value
                                  .slice(0, 3)
                                  .map((chronicCondition) => (
                                    <Badge
                                      variant="secondary"
                                      key={chronicCondition}
                                      className="text-[11px]"
                                    >
                                      {CHRONIC_CONDITIONS.find(
                                        (cc) => cc.value === chronicCondition,
                                      )?.label || chronicCondition}
                                    </Badge>
                                  ))}

                                {field.value.length > 3 && (
                                  <Badge variant="outline">
                                    +{field.value.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-[11px]">
                                Add chronic condition...
                              </p>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search chronic conditions..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No chronic condition found.
                              </CommandEmpty>
                              <CommandGroup>
                                {CHRONIC_CONDITIONS.map((chronicCondition) => (
                                  <CommandItem
                                    key={chronicCondition.value}
                                    value={chronicCondition.value}
                                    onSelect={(currentValue) => {
                                      const currentValues = Array.isArray(
                                        field.value,
                                      )
                                        ? field.value
                                        : [];
                                      const isSelected =
                                        currentValues.includes(currentValue);

                                      if (isSelected) {
                                        field.onChange(
                                          currentValues.filter(
                                            (v) => v !== currentValue,
                                          ),
                                        );
                                      } else {
                                        field.onChange([
                                          ...currentValues,
                                          currentValue,
                                        ]);
                                      }
                                      setOpenChronicConditions(true);
                                    }}
                                  >
                                    {chronicCondition.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        Array.isArray(field.value) &&
                                          field.value.includes(
                                            chronicCondition.value,
                                          )
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="medicalInfo.medications"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Medications
                    </FormLabel>
                    <FormControl>
                      <Popover
                        open={openMedications}
                        onOpenChange={setOpenMedications}
                      >
                        <PopoverTrigger
                          asChild
                          className="h-8! rounded-lg shadow-none"
                        >
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openMedications}
                            className="h-9 w-full justify-between text-xs"
                          >
                            {field.value && field.value.length > 0 ? (
                              <div
                                className={`flex flex-wrap items-center gap-1`}
                              >
                                {field.value.slice(0, 4).map((medication) => (
                                  <Badge
                                    variant="secondary"
                                    key={medication}
                                    className="text-[11px]"
                                  >
                                    {MEDICATIONS.find(
                                      (m) => m.value === medication,
                                    )?.label || medication}
                                  </Badge>
                                ))}

                                {field.value.length > 4 && (
                                  <Badge variant="outline">
                                    +{field.value.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-[11px]">
                                Add medication...
                              </p>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search medications..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No medication found.</CommandEmpty>
                              <CommandGroup>
                                {MEDICATIONS.map((medication) => (
                                  <CommandItem
                                    key={medication.value}
                                    value={medication.value}
                                    onSelect={(currentValue) => {
                                      const currentValues = Array.isArray(
                                        field.value,
                                      )
                                        ? field.value
                                        : [];
                                      const isSelected =
                                        currentValues.includes(currentValue);

                                      if (isSelected) {
                                        field.onChange(
                                          currentValues.filter(
                                            (v) => v !== currentValue,
                                          ),
                                        );
                                      } else {
                                        field.onChange([
                                          ...currentValues,
                                          currentValue,
                                        ]);
                                      }
                                      setOpenMedications(true);
                                    }}
                                  >
                                    {medication.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        Array.isArray(field.value) &&
                                          field.value.includes(medication.value)
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalInfo.mobilityStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Mobility Status
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-8! w-full rounded-lg! text-xs shadow-none [&>span]:text-[11px]">
                          <SelectValue
                            className="text-xs placeholder:text-xs"
                            placeholder="Select Mobility Status"
                          ></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {MOBILITY_STATUSES.map((status, idx) => (
                            <SelectItem key={idx} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="block text-[11px] font-medium text-slate-700">
                    Bio
                  </FormLabel>
                  <FormControl>
                    <textarea
                      className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full resize-none rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                      placeholder="Short introduction that patients will see."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Visible to patients on your public profile.
                  </p>
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full items-center justify-end">
            <button
              className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-white transition-colors"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="save"
                className="lucide lucide-save h-3.5 w-3.5 text-white"
              >
                <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
                <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
              </svg>
              Save changes
            </button>
          </div>
        </section>
      </form>
    </Form>
  );
}
