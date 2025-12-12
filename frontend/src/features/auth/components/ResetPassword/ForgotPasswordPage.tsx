import { ForgotPasswordForm, useForgotPassword } from "@/features/auth";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Route as ForgotPasswordRoute } from "@/routes/auth/forgot-password";
import { Link } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function ForgotPasswordPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const forgotPasswordMutation = useForgotPassword();
  const { email } = ForgotPasswordRoute.useSearch();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        {!email ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                {t("auth.forgotPasswordPage.title")}
              </CardTitle>
              <CardDescription>
                {t("auth.forgotPasswordPage.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm />
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                {t("auth.forgotPasswordPage.checkEmailTitle")}
              </CardTitle>
              <CardDescription>
                <p className="mb-4 text-center text-sm">
                  {t("auth.forgotPasswordPage.emailSentTo")}{" "}
                  <span className="text-brand-dark font-bold">{email}</span>.{" "}
                  {t("auth.forgotPasswordPage.clickLinkInstructions")}
                </p>
                <p className="text-primary text-center text-sm font-semibold">
                  {t("auth.forgotPasswordPage.checkSpamFolder")}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <>
                <Button
                  type="button"
                  className="bg-brand-dark hover:bg-brand-secondary mb-2 w-full cursor-pointer"
                  onClick={() => {
                    forgotPasswordMutation.mutate({ email });
                    toast.success(t("auth.forgotPasswordPage.resendSuccess"));
                  }}
                >
                  {forgotPasswordMutation.isPending ? (
                    <Spinner className="h-5 w-5 border-2 invert" />
                  ) : (
                    t("auth.forgotPasswordPage.resendEmail")
                  )}
                </Button>
                <div className="flex w-full cursor-pointer items-center justify-center">
                  <Link
                    to={ROUTE_PATHS.AUTH.LOGIN}
                    className="text-muted-foreground text-sm font-semibold"
                  >
                    {t("auth.forgotPasswordPage.backToLogin")}
                  </Link>
                </div>
              </>
            </CardContent>
          </>
        )}
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t("auth.termsAgreement")} <a href="#">{t("auth.termsOfService")}</a>{" "}
        {t("common.and")} <a href="#">{t("auth.privacyPolicy")}</a>.
      </div>
    </div>
  );
}
