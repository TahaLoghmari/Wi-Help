// import GoogleIcon from "@/assets/googleIcon.svg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useRegister,
  type RegisterUserDto,
  registerFormSchema,
  RegisterFormDefaults,
} from "@/features/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function RegisterPatientPage() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const registerMutation = useRegister();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    mode: "onChange",
    defaultValues: RegisterFormDefaults(),
  });

  const onSubmit = async (credentials: RegisterUserDto) => {
    registerMutation.mutate(credentials);
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="gap-2">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("auth.welcomeTitle")}</CardTitle>
          <CardDescription>{t("auth.registerDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid">
                <div className="mb-2 flex w-full justify-between">
                  <div className="flex w-fit flex-col items-center justify-center gap-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#386d52] bg-[#386d52] text-xs font-medium text-white shadow-lg transition-all duration-200">
                      {step === 1 ? (
                        1
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 -960 960 960"
                          fill="currentColor"
                          className="h-auto w-3"
                        >
                          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#386d52]">
                      {t("random.personal")}
                    </p>
                  </div>
                  <div className="flex w-fit flex-col items-center justify-center gap-1">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === 2 ? "border-[#386d52] bg-[#386d52] text-white" : "text-muted-foreground"} text-xs font-medium shadow-lg transition-all duration-200`}
                    >
                      2
                    </div>
                    <p
                      className={`text-xs font-bold ${step === 2 ? "text-[#386d52]" : "text-muted-foreground"}`}
                    >
                      {t("random.aboutYou")}
                    </p>
                  </div>
                </div>
                <Progress
                  value={step === 1 ? 0 : 100}
                  className="mb-6 text-[#386d52]"
                />
                {step === 1 ? (
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                              <FormLabel>{t("common.firstName")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("auth.firstNamePlaceholder")}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                              <FormLabel>{t("common.lastName")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("auth.lastNamePlaceholder")}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common.gender")}</FormLabel>
                            <FormControl>
                              <Select
                                key={`gender-${step}`}
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={t(
                                      "auth.genderMalePlaceholder",
                                    )}
                                  >
                                    {field.value === "male"
                                      ? t("auth.genderMalePlaceholder")
                                      : field.value === "female"
                                        ? t("auth.genderFemalePlaceholder")
                                        : t("auth.genderMalePlaceholder")}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">
                                    {t("auth.genderMalePlaceholder")}
                                  </SelectItem>
                                  <SelectItem value="female">
                                    {t("auth.genderFemalePlaceholder")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common.email")}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder={t("auth.emailPlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                              <FormLabel>{t("common.password")}</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder={t("auth.passwordPlaceholder")}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                              <FormLabel>
                                {t("common.confirmPassword")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder={t(
                                    "auth.confirmPasswordPlaceholder",
                                  )}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common.phoneNumber")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("auth.phoneNumberPlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      onClick={async () => {
                        const isStep1Valid = await form.trigger([
                          "firstName",
                          "lastName",
                          "gender",
                          "email",
                          "password",
                          "confirmPassword",
                          "phoneNumber",
                        ]);
                        if (isStep1Valid) {
                          setStep(2);
                        }
                      }}
                      className="mb-4 w-full bg-[#386d52] hover:bg-[#386d52]/90"
                    >
                      {t("common.continue")}
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>{t("common.dateOfBirth")}</FormLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date"
                                  className={` ${field.value ? "" : "text-muted-foreground"} w-full justify-between font-normal`}
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
                                  defaultMonth={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) =>
                                    field.onChange(
                                      date ? date.toISOString() : "",
                                    )
                                  }
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
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common.address")}</FormLabel>
                            <FormControl>
                              <div className="flex items-center rounded-md border px-3 py-2 shadow-xs">
                                <MapPin className="text-muted-foreground h-5 w-5" />
                                <Input
                                  type="text"
                                  placeholder={t("auth.addressPlaceholder")}
                                  className="h-5 border-none py-0 shadow-none outline-none focus:border-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                      <Button
                        type="submit"
                        className="w-full bg-[#386d52]"
                        disabled={
                          !form.formState.isValid || registerMutation.isPending
                        }
                      >
                        {registerMutation.isPending ? (
                          <Spinner className="h-5 w-5 border-2 invert" />
                        ) : (
                          t("common.register")
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setStep(1);
                        }}
                      >
                        Previous
                      </Button>
                    </div>
                  </div>
                )}
                <div className="text-center text-sm">
                  {t("auth.alreadyHaveAccount")}{" "}
                  <Link
                    to={ROUTE_PATHS.AUTH.LOGIN}
                    className="font-semibold text-[#386d52] underline-offset-4 hover:text-[#386d52]/90"
                  >
                    {t("auth.signIn")}
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t("auth.termsAgreement")} <a href="#">{t("auth.termsOfService")}</a>{" "}
        {t("common.and")} <a href="#">{t("auth.privacyPolicy")}</a>.
      </div>
    </div>
  );
}
