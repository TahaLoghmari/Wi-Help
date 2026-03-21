import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  ProfileAndBioFormDefaults,
  profileAndBioFormSchema,
  GetCurrentProfessional,
  GetServicesBySpecialization,
  UpdateProfessional,
} from "@/features/professional";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetCountries, GetStatesByCountry } from "@/features/auth";
import { GetSpecializations } from "@/features/professional";
import { cn } from "@/lib";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function ProfileAndBio() {
  const { t } = useTranslation();
  const { data: professional } = GetCurrentProfessional();
  const { data: countries } = GetCountries();
  const { data: specializations } = GetSpecializations();
  const form = useForm<z.infer<typeof profileAndBioFormSchema>>({
    resolver: zodResolver(profileAndBioFormSchema),
    mode: "onChange",
    defaultValues: ProfileAndBioFormDefaults(professional!),
  });
  const selectedCountryId = form.watch("address.countryId");
  const selectedSpecializationId = form.watch("specializationId");
  const { data: states } = GetStatesByCountry(selectedCountryId || "");
  const { data: availableServices = [] } = GetServicesBySpecialization(
    selectedSpecializationId || professional?.specialization?.id,
  );
  const updateProfessionalMutation = UpdateProfessional();
  const { isDirty } = form.formState;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);

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
        credentials.address.stateId &&
        credentials.address.postalCode &&
        credentials.address.countryId
          ? (credentials.address as {
              street: string;
              city: string;
              stateId: string;
              postalCode: string;
              countryId: string;
            })
          : undefined,
    };
    updateProfessionalMutation.mutate(cleanedCredentials, {
      onSuccess: () => {
        form.reset({ ...credentials, profilePicture: undefined });
        setPreviewUrl(null);
      },
    });
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
                {t("professional.settings.profileAndBio.title")}
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {t("professional.settings.profileAndBio.subtitle")}
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
            {/* Pfp Configuration setion */}
            <div className="my-4 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    className="object-cover"
                    src={previewUrl || professional?.profilePictureUrl}
                    alt={professional?.firstName}
                  />
                  <AvatarFallback className="rounded-lg">
                    {professional?.firstName && professional?.lastName
                      ? professional.firstName.charAt(0).toUpperCase() +
                        professional.lastName.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 text-[11px] text-slate-600">
                  <p className="font-medium tracking-tight text-slate-900">
                    {t(
                      "professional.settings.profileAndBio.profilePicture.label",
                    )}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {t(
                      "professional.settings.profileAndBio.profilePicture.hint",
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-[11px] sm:justify-end">
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
                          <span>
                            {t(
                              "professional.settings.profileAndBio.profilePicture.upload",
                            )}
                          </span>
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
                  <span>
                    {t(
                      "professional.settings.profileAndBio.profilePicture.remove",
                    )}
                  </span>
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
                      {t(
                        "professional.settings.profileAndBio.form.firstName.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder={t(
                          "professional.settings.profileAndBio.form.firstName.placeholder",
                        )}
                        {...field}
                        value={field.value ?? ""}
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
                      {t(
                        "professional.settings.profileAndBio.form.lastName.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder={t(
                          "professional.settings.profileAndBio.form.lastName.placeholder",
                        )}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.profileAndBio.form.phoneNumber.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="tel"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder={t(
                          "professional.settings.profileAndBio.form.phoneNumber.placeholder",
                        )}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.profileAndBio.form.experience.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder={t(
                          "professional.settings.profileAndBio.form.experience.placeholder",
                        )}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : 0,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="address.stateId"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.profileAndBio.form.address.state.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Select
                        key={`state-${selectedCountryId}`}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        disabled={!selectedCountryId}
                      >
                        <SelectTrigger className="h-8! w-full rounded-lg! text-xs shadow-none [&>span]:text-[11px]">
                          <SelectValue
                            className="text-xs placeholder:text-xs"
                            placeholder={t(
                              "professional.settings.profileAndBio.form.address.state.placeholder",
                            )}
                          ></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {(states ?? []).map((state) => (
                            <SelectItem key={state.id} value={state.id}>
                              {t(`lookups.${state.key}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.countryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.profileAndBio.form.address.country.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("address.stateId", "");
                        }}
                      >
                        <SelectTrigger className="h-8! w-full rounded-lg! text-xs shadow-none [&>span]:text-[11px]">
                          <SelectValue
                            className="text-xs placeholder:text-xs"
                            placeholder={t(
                              "professional.settings.profileAndBio.form.address.country.placeholder",
                            )}
                          ></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {(countries ?? []).map((country) => (
                            <SelectItem key={country.id} value={country.id}>
                              {t(`lookups.${country.key}`)}
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
                      {t(
                        "professional.settings.profileAndBio.form.address.city.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder={t(
                          "professional.settings.profileAndBio.form.address.city.placeholder",
                        )}
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
                      {t(
                        "professional.settings.profileAndBio.form.address.postalCode.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder={t(
                          "professional.settings.profileAndBio.form.address.postalCode.placeholder",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.profileAndBio.form.address.street.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder={t(
                          "professional.settings.profileAndBio.form.address.street.placeholder",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="specializationId"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.profileAndBio.form.specialization.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("serviceIds", []);
                        }}
                      >
                        <SelectTrigger className="w-full text-xs shadow-none [&>span]:text-[11px]">
                          <SelectValue
                            placeholder={t(
                              "professional.settings.profileAndBio.form.specialization.placeholder",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {(specializations ?? []).map((specialization) => (
                            <SelectItem
                              key={specialization.id}
                              value={specialization.id}
                            >
                              {t(`lookups.${specialization.key}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceIds"
                render={({ field }) => {
                  const selected: string[] = field.value ?? [];
                  const selectedServices = availableServices.filter((s) =>
                    selected.includes(s.id),
                  );
                  return (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="block text-[11px] font-medium text-slate-700">
                        {t("professional.settings.services.title")}
                      </FormLabel>
                      <Popover
                        open={servicesOpen}
                        onOpenChange={setServicesOpen}
                      >
                        <PopoverTrigger asChild className="shadow-none">
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={servicesOpen}
                            className="h-9 w-full justify-between text-xs"
                            disabled={
                              !selectedSpecializationId &&
                              availableServices.length === 0
                            }
                          >
                            {selectedServices.length > 0 ? (
                              <div className="flex flex-wrap items-center gap-1">
                                {selectedServices.slice(0, 3).map((s) => (
                                  <Badge
                                    variant="secondary"
                                    key={s.id}
                                    className="text-[11px]"
                                  >
                                    {t(s.key)}
                                  </Badge>
                                ))}
                                {selectedServices.length > 3 && (
                                  <Badge variant="outline">
                                    +{selectedServices.length - 3}{" "}
                                    {t("professional.settings.services.more")}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-[11px]">
                                {t(
                                  "professional.settings.services.placeholder",
                                )}
                              </p>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[320px] p-0">
                          <Command>
                            <CommandInput
                              placeholder={t(
                                "professional.settings.services.search",
                              )}
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                {t("professional.settings.services.notFound")}
                              </CommandEmpty>
                              <CommandGroup>
                                {availableServices.map((service) => (
                                  <CommandItem
                                    key={service.id}
                                    value={t(service.key)}
                                    onSelect={() => {
                                      const newIds = selected.includes(
                                        service.id,
                                      )
                                        ? selected.filter(
                                            (x) => x !== service.id,
                                          )
                                        : [...selected, service.id];
                                      field.onChange(newIds);
                                      setServicesOpen(true);
                                    }}
                                  >
                                    {t(service.key)}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        selected.includes(service.id)
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
                      <FormMessage className="text-xs" />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-1">
              <FormField
                control={form.control}
                name="visitPrice"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.profileAndBio.form.price.visit",
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500">TND</span>
                        <input
                          type="number"
                          className="focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                          placeholder="0"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : 0,
                            )
                          }
                        />
                      </div>
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
                    {t("professional.settings.profileAndBio.form.bio.label")}
                  </FormLabel>
                  <FormControl>
                    <textarea
                      className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full resize-none rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                      placeholder={t(
                        "professional.settings.profileAndBio.form.bio.placeholder",
                      )}
                      rows={4}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {t("professional.settings.profileAndBio.form.bio.hint")}
                  </p>
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full items-center justify-end">
            <button
              className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={!isDirty || updateProfessionalMutation.isPending}
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
              {t("professional.settings.profileAndBio.save")}
            </button>
          </div>
        </section>
      </form>
    </Form>
  );
}
