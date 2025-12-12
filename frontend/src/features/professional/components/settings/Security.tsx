import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Spinner,
} from "@/components";
import {
  useChangePassword,
  changePasswordFormSchema,
  ChangePasswordDefaults,
  type ChangePasswordDto,
} from "@/features/auth";
import { Key } from "lucide-react";

export function Security() {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    mode: "onChange",
    defaultValues: ChangePasswordDefaults(),
  });

  const changePasswordMutation = useChangePassword();

  const onSubmit = async (
    formData: z.infer<typeof changePasswordFormSchema>,
  ) => {
    const dto: ChangePasswordDto = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };
    changePasswordMutation.mutate(dto, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4"
        >
          <div className="mb-1 border-slate-200 pb-3">
            <h3 className="text-brand-dark text-xs font-semibold tracking-tight">
              {t("professional.settings.security.title")}
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {t("professional.settings.security.subtitle")}
            </p>
          </div>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="block text-[11px] font-medium text-slate-700">
                    {t(
                      "professional.settings.security.form.currentPassword.label",
                    )}
                  </FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                      placeholder={t(
                        "professional.settings.security.form.currentPassword.placeholder",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.security.form.newPassword.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="password"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder={t(
                          "professional.settings.security.form.newPassword.placeholder",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="block text-[11px] font-medium text-slate-700">
                      {t(
                        "professional.settings.security.form.confirmNewPassword.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="password"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder={t(
                          "professional.settings.security.form.confirmNewPassword.placeholder",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={
                  !form.formState.isValid || changePasswordMutation.isPending
                }
                className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changePasswordMutation.isPending ? (
                  <Spinner className="h-3.5 w-3.5" />
                ) : (
                  <Key className="h-3.5 w-3.5 text-white" />
                )}
                {t("professional.settings.security.form.submit")}
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
