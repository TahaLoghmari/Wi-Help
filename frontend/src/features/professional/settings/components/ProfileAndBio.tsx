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
} from "@/components/ui";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  ProfileAndBioFormDefaults,
  profileAndBioFormSchema,
  getServicesForSpecialization,
  useCurrentProfessional,
  useUpdateProfessional,
} from "@/features/professional";
import { zodResolver } from "@hookform/resolvers/zod";
import { COUNTRIES, SPECIALIZATIONS } from "@/features/auth";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib";
import { useState } from "react";

export function ProfileAndBio() {
  const { data: professional } = useCurrentProfessional();
  const form = useForm<z.infer<typeof profileAndBioFormSchema>>({
    resolver: zodResolver(profileAndBioFormSchema),
    mode: "onChange",
    defaultValues: ProfileAndBioFormDefaults(professional!),
  });
  const updateProfessionalMutation = useUpdateProfessional();
  const [open, setOpen] = useState(false);

  const selectedSpecialization = form.watch("specialization");

  const onSubmit = async (
    credentials: z.infer<typeof profileAndBioFormSchema>,
  ) => {
    console.log(credentials);
    updateProfessionalMutation.mutate(credentials);
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
              <h3 className="text-xs font-semibold tracking-tight text-[#00394a]">
                Basic Information
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Core details shown on your public professional profile.
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
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-lucide="chevron-down"
                className="lucide lucide-chevron-down h-3.5 w-3.5"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
          </header>
          <div className="section-body space-y-3">
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
                        className="placeholder:text-muted-foreground w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
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
                        className="placeholder:text-muted-foreground w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                        placeholder="Enter last name"
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <input
                        type="tel"
                        className="placeholder:text-muted-foreground w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                        placeholder="Enter phone number"
                        {...field}
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
                      Experience
                    </FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        className="placeholder:text-muted-foreground w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                        placeholder="0"
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
                      State
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
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
                        className="placeholder:text-muted-foreground w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
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
                        className="placeholder:text-muted-foreground w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                        placeholder="Enter postal code"
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
                      Street
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="placeholder:text-muted-foreground w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                        placeholder="Enter street address"
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
                      Specialization
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full text-xs shadow-none [&>span]:text-[11px]">
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          {SPECIALIZATIONS.map((specialization, idx) => (
                            <SelectItem key={idx} value={specialization.value}>
                              {specialization.label}
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
                name="services"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      Services
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
                                Add service...
                              </p>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search services..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No service found.</CommandEmpty>
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
                      Start price
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500">$</span>
                        <input
                          type="number"
                          className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
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
                      End price
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500">$</span>
                        <input
                          type="number"
                          className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
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
                    Bio
                  </FormLabel>
                  <FormControl>
                    <textarea
                      className="placeholder:text-muted-foreground w-full resize-none rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
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
              className="inline-flex items-center gap-1.5 rounded-full bg-[#00394a] px-3 py-1.5 text-[11px] text-white transition-colors hover:bg-[#00546e]"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
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
