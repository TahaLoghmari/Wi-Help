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
} from "@/components";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  ProfileAndBioFormDefaults,
  profileAndBioFormSchema,
  getServicesForSpecialization,
  GetCurrentProfessional,
  UpdateProfessional,
} from "@/features/professional";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCountries, getSpecializations } from "@/features/auth";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/config/i18n";

export function ProfileAndBio() {
  const { t } = useTranslation();
  const { data: professional } = GetCurrentProfessional();
  const form = useForm<z.infer<typeof profileAndBioFormSchema>>({
    resolver: zodResolver(profileAndBioFormSchema),
    mode: "onChange",
    defaultValues: ProfileAndBioFormDefaults(professional!),
  });
  const updateProfessionalMutation = UpdateProfessional();
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const selectedSpecialization = form.watch("specialization");

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
    updateProfessionalMutation.mutate(cleanedCredentials);
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
                name="address.state"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.profileAndBio.form.address.state.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder={t(
                          "professional.settings.profileAndBio.form.address.state.placeholder",
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
                name="address.country"
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
                        onValueChange={field.onChange}
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
                          {getCountries(i18n.language).map((country, idx) => (
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
                name="specialization"
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
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full text-xs shadow-none [&>span]:text-[11px]">
                          <SelectValue
                            placeholder={t(
                              "professional.settings.profileAndBio.form.specialization.placeholder",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {getSpecializations(i18n.language).map(
                            (specialization, idx) => (
                              <SelectItem
                                key={idx}
                                value={specialization.value}
                              >
                                {specialization.label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="services"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.profileAndBio.form.services.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild className="shadow-none">
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="h-9 w-full justify-between text-xs"
                          >
                            {field.value && field.value.length > 0 ? (
                              <div
                                className={`flex flex-wrap items-center gap-1`}
                              >
                                {field.value.slice(0, 4).map((techValue) => (
                                  <Badge
                                    variant="secondary"
                                    key={techValue}
                                    className="text-[11px]"
                                  >
                                    {getServicesForSpecialization(
                                      selectedSpecialization || "",
                                    ).find((s) => s.value === techValue)
                                      ?.label || techValue}
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
                                {t(
                                  "professional.settings.profileAndBio.form.services.add",
                                )}
                              </p>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput
                              placeholder={t(
                                "professional.settings.profileAndBio.form.services.search",
                              )}
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                {t(
                                  "professional.settings.profileAndBio.form.services.notFound",
                                )}
                              </CommandEmpty>
                              <CommandGroup>
                                {getServicesForSpecialization(
                                  selectedSpecialization || "",
                                ).map((service) => (
                                  <CommandItem
                                    key={service.value}
                                    value={service.value}
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
                                      setOpen(true);
                                    }}
                                  >
                                    {service.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        Array.isArray(field.value) &&
                                          field.value.includes(service.value)
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
                name="startPrice"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.profileAndBio.form.price.start",
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500">$</span>
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
              <FormField
                control={form.control}
                name="endPrice"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t("professional.settings.profileAndBio.form.price.end")}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500">$</span>
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
              {t("professional.settings.profileAndBio.save")}
            </button>
          </div>
        </section>
      </form>
    </Form>
  );
}
