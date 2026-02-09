import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Button,
  Calendar,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@/components/ui";
import {
  professionalOnboardingSchema,
  ProfessionalOnboardingDefaults,
  getCountries,
  getSpecializations,
  useCompleteProfessionalOnboarding,
  useCurrentUser,
} from "@/features/auth";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useTranslation } from "react-i18next";
import i18n from "@/config/i18n";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export function ProfessionalOnboarding() {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const completeOnboardingMutation = useCompleteProfessionalOnboarding();

  const form = useForm<z.infer<typeof professionalOnboardingSchema>>({
    resolver: zodResolver(professionalOnboardingSchema),
    mode: "onChange",
    defaultValues: ProfessionalOnboardingDefaults(),
  });

  const steps = [
    t("auth.steps.personalInfo"),
    t("auth.steps.addressInfo"),
    t("auth.steps.professionalInfo"),
  ];

  const onSubmit = async (
    data: z.infer<typeof professionalOnboardingSchema>,
  ) => {
    completeOnboardingMutation.mutate(data);
  };

  return (
    <div className={cn("flex flex-col gap-6 p-4")}>
      <Card className="gap-2">
        <CardHeader className="gap-1">
          <CardTitle className="text-lg font-bold">
            {t("auth.completeProfile")}
          </CardTitle>
          <CardDescription className="text-xs text-gray-600">
            {t("auth.welcomeBack", { name: user?.firstName || "User" })}!{" "}
            {t("auth.completeProfileDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mt-1 grid">
                <div className="flex flex-col">
                  <p className="mb-2 text-xs font-semibold text-gray-600">
                    {t("auth.stepOf", { step, total: 2 })}
                  </p>
                  <Progress
                    value={step === 1 ? 50 : 100}
                    className="text-[#386d52]"
                  />
                  <div className="mt-1 mb-4 flex w-full items-center justify-between">
                    {steps.map((stepName, idx) => (
                      <p key={idx} className="text-xs text-gray-400">
                        {stepName}
                      </p>
                    ))}
                  </div>
                </div>

                {step === 1 && (
                  <div className="grid gap-3">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel className="text-xs text-gray-700">
                              {t("forms.labels.gender")}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={t("placeholders.selectGender")}
                                  >
                                    {field.value === "male"
                                      ? t("common.male")
                                      : field.value === "female"
                                        ? t("common.female")
                                        : t("placeholders.selectGender")}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">
                                    {t("common.male")}
                                  </SelectItem>
                                  <SelectItem value="female">
                                    {t("common.female")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-xs text-gray-700">
                              {t("forms.labels.dateOfBirth")}
                            </FormLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`${field.value ? "" : "text-muted-foreground"} w-full justify-between font-normal`}
                                >
                                  {field.value ? (
                                    new Date(field.value).toLocaleDateString(
                                      undefined,
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      },
                                    )
                                  ) : (
                                    <div className="flex items-center gap-4">
                                      <CalendarIcon />
                                      {t("common.selectDate")}
                                    </div>
                                  )}
                                  <ChevronDownIcon />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    field.onChange(
                                      date ? date.toISOString() : "",
                                    );
                                    setOpen(false);
                                  }}
                                  captionLayout="dropdown"
                                  className="rounded-lg border shadow-sm"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-700">
                            {t("forms.labels.phoneNumber")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="text-xs placeholder:text-sm"
                              placeholder={t("placeholders.phoneNumber")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-xs text-gray-700">
                            {t("forms.labels.streetAddress")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="text-xs placeholder:text-sm"
                              placeholder={t("placeholders.streetAddress")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="address.country"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel className="text-xs text-gray-700">
                              {t("forms.labels.country")}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={t(
                                      "placeholders.selectCountry",
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {getCountries(i18n.language).map(
                                    (country, idx) => (
                                      <SelectItem
                                        key={idx}
                                        value={country.value}
                                      >
                                        {t(country.label)}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel className="text-xs text-gray-700">
                              {t("forms.labels.state")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="text-xs placeholder:text-sm"
                                placeholder={t("placeholders.state")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel className="text-xs text-gray-700">
                              {t("forms.labels.city")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="text-xs placeholder:text-sm"
                                placeholder={t("placeholders.city")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.postalCode"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel className="text-xs text-gray-700">
                              {t("forms.labels.postalCode")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="text-xs placeholder:text-sm"
                                placeholder={t("placeholders.postalCode")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-10 mb-2 flex w-full items-center justify-end">
                      <Button
                        className="bg-brand-dark hover:bg-brand-dark cursor-pointer transition-transform duration-200 hover:scale-101 hover:shadow-lg"
                        onClick={async () => {
                          const isValid = await form.trigger([
                            "gender",
                            "dateOfBirth",
                            "phoneNumber",
                            "address.street",
                            "address.city",
                            "address.postalCode",
                            "address.country",
                            "address.state",
                          ]);
                          if (isValid) {
                            setStep(2);
                          }
                        }}
                      >
                        {t("common.continue")}
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        fill="currentColor"
                        className="h-4 w-4 text-sky-500"
                      >
                        <path d="M320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72zM380 384.8C374.6 384.3 369 384 363.4 384L276.5 384C270.9 384 265.4 384.3 259.9 384.8L259.9 452.3C276.4 459.9 287.9 476.6 287.9 495.9C287.9 522.4 266.4 543.9 239.9 543.9C213.4 543.9 191.9 522.4 191.9 495.9C191.9 476.5 203.4 459.8 219.9 452.3L219.9 393.9C157 417 112 477.6 112 548.6C112 563.7 124.3 576 139.4 576L500.5 576C515.6 576 527.9 563.7 527.9 548.6C527.9 477.6 482.9 417.1 419.9 394L419.9 431.4C443.2 439.6 459.9 461.9 459.9 488L459.9 520C459.9 531 450.9 540 439.9 540C428.9 540 419.9 531 419.9 520L419.9 488C419.9 477 410.9 468 399.9 468C388.9 468 379.9 477 379.9 488L379.9 520C379.9 531 370.9 540 359.9 540C348.9 540 339.9 531 339.9 520L339.9 488C339.9 461.9 356.6 439.7 379.9 431.4L379.9 384.8z" />
                      </svg>
                      <p className="font-semibold">
                        {t("auth.steps.professionalInfo")}
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-xs text-gray-700">
                            {t("forms.labels.specialization")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value || ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={t(
                                    "placeholders.selectSpecialization",
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {getSpecializations(i18n.language).map(
                                  (spec, idx) => (
                                    <SelectItem key={idx} value={spec.value}>
                                      {t(spec.label)}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-xs text-gray-700">
                            {t("forms.labels.experience")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              className="text-xs placeholder:text-sm"
                              placeholder={t("placeholders.experience")}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mt-10 mb-2 flex w-full items-center justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        {t("common.back")}
                      </Button>
                      <Button
                        type="submit"
                        className="bg-brand-dark hover:bg-brand-dark cursor-pointer transition-transform duration-200 hover:scale-101 hover:shadow-lg"
                        disabled={completeOnboardingMutation.isPending}
                      >
                        {completeOnboardingMutation.isPending ? (
                          <Spinner className="h-5 w-5 border-2 invert" />
                        ) : (
                          t("auth.completeSetup")
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
