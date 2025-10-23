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

export function ResetPasswordPage() {
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
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("auth.resetPassword")}</CardTitle>
          <CardDescription>
            {t("auth.resetPasswordDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
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
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={
                  !form.formState.isValid || resetPasswordMutation.isPending
                }
              >
                {resetPasswordMutation.isPending ? (
                  <Spinner className="h-5 w-5 border-2 invert" />
                ) : (
                  t("auth.updatePassword")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
