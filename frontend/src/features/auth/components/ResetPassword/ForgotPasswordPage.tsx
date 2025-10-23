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

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const forgotPasswordMutation = useForgotPassword();
  const { email } = ForgotPasswordRoute.useSearch();

  return (
    <div className="flex flex-col gap-6">
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
                <p className="text-center text-sm">
                  {t("auth.forgotPasswordPage.emailSentTo")}{" "}
                  <span className="font-bold text-[#14d3ac]">{email}</span>.{" "}
                  {t("auth.forgotPasswordPage.clickLinkInstructions")}
                </p>
                <p className="text-center text-sm text-[#7e838b]">
                  {t("auth.forgotPasswordPage.checkSpamFolder")}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <>
                <Button
                  type="button"
                  className="mb-2 w-full cursor-pointer bg-[#14d3ac]"
                  disabled={forgotPasswordMutation.isPending}
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
    </div>
  );
}
