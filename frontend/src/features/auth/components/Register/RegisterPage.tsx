import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
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
  useGetGoogleOAuthUrl,
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
import GoogleIcon from "@/assets/googleIcon.svg";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RegisterPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const getGoogleOAuthUrlMutation = useGetGoogleOAuthUrl();
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("auth.welcomeTitle")}</CardTitle>
          <CardDescription>{t("auth.registerDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid">
                <div className="flex flex-col gap-4 mb-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      getGoogleOAuthUrlMutation.mutate();
                    }}
                  >
                    <img src={GoogleIcon} alt="Google" className="h-5 w-5" />
                    {t("auth.signupWithGoogle")}
                  </Button>
                </div>
                <div className="after:border-border relative mb-2 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    {t("auth.orContinueWith")}
                  </span>
                </div>
                <div className="w-full justify-between flex mb-2">
                  <div className="flex flex-col justify-center items-center w-fit gap-1">
                    <div className="rounded-full px-2 text-xs py-1 bg-[#386d52] text-white w-fit shadow-xs">
                      1
                    </div>
                    <p className="text-[#386d52] text-xs font-bold">
                      {t("random.personal")}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center w-fit gap-1">
                    <div className="rounded-full px-2 text-xs py-1 border w-fit shadow-xs">
                      2
                    </div>
                    <p className="text-muted-foreground text-xs font-bold">
                      {t("random.aboutYou")}
                    </p>
                  </div>
                </div>
                <Progress value={0} className="mb-6" />
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
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
                          <FormItem>
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
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={t("auth.genderMalePlaceholder")}
                                />
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
                          <FormItem>
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
                          <FormItem>
                            <FormLabel>{t("common.confirmPassword")}</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder={t(
                                  "auth.confirmPasswordPlaceholder"
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
                    type="submit"
                    className="w-full bg-[#386d52] mb-4"
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
                </div>
                <div className="text-center text-sm">
                  {t("auth.alreadyHaveAccount")}{" "}
                  <Link
                    to={ROUTE_PATHS.AUTH.LOGIN}
                    className="hover:text-[#386d52]/90 font-semibold underline-offset-4 text-[#386d52]"
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
