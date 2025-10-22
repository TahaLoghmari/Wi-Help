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
  useForgotPassword,
  forgotPasswordFormSchema,
  type ForgotPasswordDto,
  ForgotPasswordDefautls,
} from "@/features/auth";
import { ROUTE_PATHS } from "@/config/routes";
import { Link } from "@tanstack/react-router";

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    mode: "onChange",
    defaultValues: ForgotPasswordDefautls(),
  });

  async function onSubmit(credentials: ForgotPasswordDto) {
    forgotPasswordMutation.mutate(credentials);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={!form.formState.isValid || forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? (
            <Spinner className="h-5 w-5 border-2 invert" />
          ) : (
            "Reset Password"
          )}
        </Button>
        <div className="flex w-full cursor-pointer items-center justify-center">
          <Link
            to={ROUTE_PATHS.AUTH.LOGIN}
            search={{ message: undefined }}
            className="text-primary font-semibold text-sm"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
