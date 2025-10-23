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
              <p className="font-medium text-gray-900">{email}</p>
              <p className="text-muted-foreground text-center text-sm">
                {t("auth.emailVerificationPage.instructions")}
              </p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex w-full items-center justify-center rounded-lg border border-[#00394a] bg-[#00546e]/90 p-4">
            <p className="text-sm text-[#3fa6ff]">
              <strong>{t("auth.emailVerificationPage.noteLabel")}</strong>{" "}
              {t("auth.emailVerificationPage.noteDescription")}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Button
              className="w-full cursor-pointer p-4 bg-[#14d3ac]"
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
