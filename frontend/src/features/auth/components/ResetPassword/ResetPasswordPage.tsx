import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  useResetPassword,
  type ResetPasswordDto,
  resetPasswordFormSchema,
  ResetPasswordDefaults,
} from "@/features/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Route } from "@/routes/auth/reset-password";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";

export function ResetPasswordPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const resetPasswordMutation = useResetPassword();
  const { email, token } = Route.useSearch();

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: "onChange",
    defaultValues: ResetPasswordDefaults(email),
  });

  async function onSubmit(formData: z.infer<typeof resetPasswordFormSchema>) {
    const dto: ResetPasswordDto = {
      email: formData.email,
      newPassword: formData.password,
      confirmPassword: formData.confirmPassword,
      token,
    };
    resetPasswordMutation.mutate(dto);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("auth.resetPassword")}</CardTitle>
          <CardDescription>
            {t("auth.resetPasswordDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                            readOnly
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.newPassword")}</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.confirmNewPassword")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("auth.confirmPasswordPlaceholder")}
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
                  className="bg-brand-dark hover:bg-brand-secondary w-full"
                >
                  {resetPasswordMutation.isPending ? (
                    <Spinner className="h-5 w-5 border-2 invert" />
                  ) : (
                    t("auth.updatePassword")
                  )}
                </Button>
                <div className="flex w-full cursor-pointer items-center justify-center">
                  <Link
                    to={ROUTE_PATHS.AUTH.LOGIN}
                    className="text-brand-blue hover:text-brand-blue/90 text-sm font-semibold"
                  >
                    {t("auth.backToLogin")}
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
