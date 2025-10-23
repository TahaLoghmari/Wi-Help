import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Route as EmailVerifiedRoute } from "@/routes/auth/email-verified";
import { useTranslation } from "react-i18next";

export function EmailVerifiedPage() {
  const { t } = useTranslation();
  const { status } = EmailVerifiedRoute.useSearch();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {status === "success"
              ? t("auth.emailVerifiedPage.successTitle")
              : t("auth.emailVerifiedPage.failedTitle")}
          </CardTitle>
          <CardDescription>
            {status === "success"
              ? t("auth.emailVerifiedPage.successDescription")
              : t("auth.emailVerifiedPage.failedDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
