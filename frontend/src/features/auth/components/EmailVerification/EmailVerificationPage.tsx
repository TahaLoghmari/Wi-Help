import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSendConfirmationEmail } from "@/features/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import { Route as EmailVerificationRoute } from "@/routes/auth/email-verification";
import { Link } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { useTranslation } from "react-i18next";

export function EmailVerificationPage() {
  const resendConfirmationEmailMutation = useSendConfirmationEmail();
  const { email } = EmailVerificationRoute.useSearch();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {t("auth.emailVerificationPage.title")}
          </CardTitle>
          <CardDescription>
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground">
                {t("auth.emailVerificationPage.sentTo")}
              </p>
              <p className="text-brand-dark font-medium">{email}</p>
              <p className="text-muted-foreground text-center text-sm">
                {t("auth.emailVerificationPage.instructions")}
              </p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div
            className={`group text-brand-dark flex items-center rounded-md bg-[#fcf4d4] px-3 py-3`}
          >
            <span
              className={`bg-brand-dark mr-3 h-7 w-1 rounded-full transition-colors`}
            ></span>
            <div
              className={`text-brand-dark cursor-pointer rounded-md text-sm`}
            >
              <span className="mr-1 font-semibold">
                {t("auth.emailVerificationPage.noteLabel")}
              </span>
              {t("auth.emailVerificationPage.noteDescription")}
            </div>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Button
              className="bg-brand-dark hover:bg-brand-dark/90 w-full cursor-pointer p-4"
              onClick={() => {
                if (email) {
                  resendConfirmationEmailMutation.mutate(email);
                }
              }}
              disabled={resendConfirmationEmailMutation.isPending}
            >
              {resendConfirmationEmailMutation.isPending ? (
                <Spinner className="h-5 w-5 border-2 invert" />
              ) : (
                t("auth.emailVerificationPage.resendButton")
              )}
            </Button>
            <Button variant="outline">
              <Link
                to={ROUTE_PATHS.AUTH.LOGIN}
                className="text-muted-foreground flex cursor-pointer items-center justify-center gap-2"
              >
                <MoveLeft />
                {t("auth.emailVerificationPage.returnButton")}
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground text-center text-xs">
            {t("auth.emailVerificationPage.helperText", {
              returnLabel: t("auth.emailVerificationPage.returnButton"),
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
