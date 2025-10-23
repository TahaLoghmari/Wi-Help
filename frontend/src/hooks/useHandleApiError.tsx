import type { ProblemDetailsDto } from "@/types/api.types";
import { Link } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { toast } from "sonner";
import i18n from "i18next";

interface handleApiErrorProps {
  apiError: ProblemDetailsDto;
  email?: string;
}

export function handleApiError({ apiError, email }: handleApiErrorProps) {
  const t = i18n.t.bind(i18n);

  if (apiError instanceof TypeError) {
    toast.error(t("errors.connectionError"), {
      description: (
        <p className="text-muted-foreground text-xs">
          {t("errors.connectionErrorDescription")}
        </p>
      ),
    });
    return;
  }
  toast.error(apiError.title, {
    description: (
      <div className="flex flex-1 flex-col gap-2">
        <p className="text-muted-foreground text-xs">{apiError.detail}</p>

        {/* this is for the toast error when email is not verified */}
        {email && apiError.title === "Email not Verified" && (
          <Link
            to={ROUTE_PATHS.AUTH.EMAIL_VERIFICATION}
            search={{ email }}
            className="text-muted-foreground hover:text-muted-foreground/20 underline"
          >
            {t("errors.resendEmail")}
          </Link>
        )}

        {apiError.errors && (
          <ul className="border-muted-foreground text-muted-foreground mt-1 border-l-2 pl-3 text-sm">
            {Object.values(apiError.errors)
              .flat()
              .map((error, i) => (
                <li key={i} className="mb-1">
                  {typeof error === "string" ? error : String(error)}
                </li>
              ))}
          </ul>
        )}
      </div>
    ),
  });
}
