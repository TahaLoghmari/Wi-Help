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
  useLogin,
  type LoginUserDto,
  loginFormSchema,
  LoginFormDefaults,
} from "@/features/auth";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { Route as LoginRoute } from "@/routes/auth/login";
import { ROUTE_PATHS } from "@/config/routes";
import { useAppNavigation } from "@/hooks";
import { useTranslation } from "react-i18next";
import GoogleIcon from "@/assets/googleIcon.svg";

export function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const getGoogleOAuthUrlMutation = useGetGoogleOAuthUrl();
  const { message } = LoginRoute.useSearch();
  const { goTo } = useAppNavigation();
  const loginMutation = useLogin();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: LoginFormDefaults(),
  });

  async function onSubmit(credentials: LoginUserDto) {
    loginMutation.mutate(credentials);
  }

  // this is for google signin/signup failing or any error when the redirection is comming from the backend with an error
  useEffect(() => {
    if (message) {
      toast.error(message);
      goTo({
        replace: true,
      });
    }
  }, [message, goTo]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("auth.welcomeBack")}</CardTitle>
          <CardDescription>{t("auth.loginDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      getGoogleOAuthUrlMutation.mutate();
                    }}
                  >
                    <img src={GoogleIcon} alt="Google" className="h-5 w-5" />
                    {t("auth.loginWithGoogle")}
                  </Button>
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    {t("auth.orContinueWith")}
                  </span>
                </div>
                <div className="grid gap-6">
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
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>{t("common.password")}</FormLabel>
                            <Link
                              to={ROUTE_PATHS.AUTH.FORGOT_PASSWORD}
                              className="ml-auto text-sm underline-offset-4 font-semibold hover:text-[#386d52]/90 text-[#386d52]"
                            >
                              {t("auth.forgotPassword")}
                            </Link>
                          </div>
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
                  <Button
                    type="submit"
                    className="w-full bg-[#386d52]"
                    disabled={
                      !form.formState.isValid || loginMutation.isPending
                    }
                  >
                    {loginMutation.isPending ? (
                      <Spinner className="h-5 w-5 border-2 invert" />
                    ) : (
                      t("common.login")
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t("auth.dontHaveAccount")}{" "}
                  <Link
                    to={ROUTE_PATHS.AUTH.REGISTER}
                    className="hover:text-[#386d52]/90 underline-offset-4 text-[#386d52] font-semibold"
                  >
                    {t("auth.signUp")}
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
