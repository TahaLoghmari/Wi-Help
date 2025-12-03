import { useForm } from "react-hook-form";
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
import { Key, Shield } from "lucide-react";

export function Security() {
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
              Security
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Keep your account secure with a strong password.
            </p>
          </div>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="block text-[11px] font-medium text-slate-700">
                    Current password
                  </FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                      placeholder="Enter current password"
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
                      New password
                    </FormLabel>
                    <FormControl>
                      <input
                        type="password"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder="At least 6 characters"
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
                      Confirm new password
                    </FormLabel>
                    <FormControl>
                      <input
                        type="password"
                        className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                        placeholder="Re-enter new password"
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
                Update password
              </button>
            </div>
          </div>

          <div className="mt-1 space-y-3 border-t border-dashed border-slate-200 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-slate-700">
                <Shield className="h-3.5 w-3.5 text-slate-400" />
                <div>
                  <p className="font-medium tracking-tight text-slate-900">
                    Two-factor authentication
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Add an extra layer of security using SMS or an authenticator
                    app.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
