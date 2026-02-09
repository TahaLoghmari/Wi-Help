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
  patientOnboardingSchema,
  PatientOnboardingDefaults,
  getCountries,
  getRelationships,
  useCompletePatientOnboarding,
  useCurrentUser,
} from "@/features/auth";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useTranslation } from "react-i18next";
import i18n from "@/config/i18n";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export function PatientOnboarding() {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const completeOnboardingMutation = useCompletePatientOnboarding();

  const form = useForm<z.infer<typeof patientOnboardingSchema>>({
    resolver: zodResolver(patientOnboardingSchema),
    mode: "onChange",
    defaultValues: PatientOnboardingDefaults(),
  });

  const steps = [
    t("auth.steps.personalInfo"),
    t("auth.steps.addressInfo"),
    t("auth.steps.emergencyContact"),
  ];

  const onSubmit = async (data: z.infer<typeof patientOnboardingSchema>) => {
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
                        <path d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z" />
                      </svg>
                      <p className="font-semibold">
                        {t("auth.steps.emergencyContact")}
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="emergencyContact.fullName"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-xs text-gray-700">
                            {t("common.name")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="text-xs placeholder:text-sm"
                              placeholder={t(
                                "placeholders.emergencyContactName",
                              )}
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
                        name="emergencyContact.phoneNumber"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
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
                        name="emergencyContact.relationship"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel className="text-xs text-gray-700">
                              {t("forms.labels.relationship")}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={t(
                                      "placeholders.selectRelationship",
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {getRelationships(i18n.language).map(
                                    (relationship, idx) => (
                                      <SelectItem
                                        key={idx}
                                        value={relationship.value}
                                      >
                                        {t(relationship.label)}
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
                    </div>
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
