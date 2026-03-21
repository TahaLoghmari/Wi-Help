import type { ProblemDetailsDto } from "@/types";
import { Link } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { toast } from "sonner";
import i18n from "i18next";

interface handleApiErrorProps {
  apiError: ProblemDetailsDto | Error;
  email?: string;
}

export function handleApiError({ apiError, email }: handleApiErrorProps) {
  const t = i18n.t.bind(i18n);

  if (apiError instanceof TypeError) {
    toast.error(t("errors.connectionError"));
    return;
  }

  if (apiError instanceof Error) {
    toast.error(t("errors.defaultErrorDescription"));
    return;
  }

  const resolvedTitle = t(`errors.backend.${apiError.title}`, {
    defaultValue: t("errors.defaultErrorDescription"),
  });
  const showResendLink =
    email && apiError.title === "Identity.EmailNotConfirmed";

  toast.error(resolvedTitle, {
    description: showResendLink ? (
      <Link
        to={ROUTE_PATHS.AUTH.EMAIL_VERIFICATION}
        search={{ email }}
        className="text-muted-foreground hover:text-muted-foreground/20 underline"
      >
        {t("errors.resendEmail")}
      </Link>
    ) : undefined,
  });
}
