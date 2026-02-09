import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Button,
} from "@/components/ui";
import {
  useRegisterPatient,
  useRegisterProfessional,
  registerFormSchema,
  PatientFormDefaults,
  ProfessionalFormDefaults,
  useRegisterRoleStore,
  PatientForm,
  ProfessionalForm,
  useStepsStore,
  useGetGoogleOAuthUrl,
} from "@/features/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { useTranslation } from "react-i18next";
import GoogleIcon from "@/assets/googleIcon.svg";

export function Register() {
  const { registerRole, setRegisterRole } = useRegisterRoleStore();
  const { step, setStep } = useStepsStore();
  const { t } = useTranslation();
  const registerPatientMutation = useRegisterPatient();
  const registerProfessionMutation = useRegisterProfessional();
  const getGoogleOAuthUrlMutation = useGetGoogleOAuthUrl();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    mode: "onChange",
    defaultValues:
      registerRole === "patient"
        ? PatientFormDefaults()
        : ProfessionalFormDefaults(),
  });

  const steps =
    registerRole === "patient"
      ? [
          t("auth.steps.personalInfo"),
          t("auth.steps.addressInfo"),
          t("auth.steps.emergencyContact"),
        ]
      : [
          t("auth.steps.personalInfo"),
          t("auth.steps.addressInfo"),
          t("auth.steps.professionalInfo"),
        ];

  const onSubmit = async (credentials: z.infer<typeof registerFormSchema>) => {
    if (registerRole === "patient") registerPatientMutation.mutate(credentials);
    else registerProfessionMutation.mutate(credentials);
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="gap-2">
        <CardHeader className="gap-1">
          <div className="flex justify-end gap-1 text-[13px] text-gray-700">
            <p>{t("auth.alreadyHaveAccount")} </p>
            <Link
              to={ROUTE_PATHS.AUTH.LOGIN}
              className="font-semibold text-sky-500 underline-offset-4 hover:text-sky-500/90"
            >
              {t("common.login")}
            </Link>
          </div>
          <CardTitle className="text-lg font-bold">
            {t("auth.createAccount")}
          </CardTitle>
          <CardDescription className="text-xs text-gray-600">
            {t("auth.chooseRole")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mt-1 grid">
                <div className="flex flex-col">
                  <p className="mb-2 text-xs font-semibold text-gray-600">
                    {t("auth.stepOf", { step, total: 3 })}
                  </p>
                  <Progress
                    value={step === 1 ? 0 : step === 2 ? 50 : 100}
                    className="text-[#386d52]"
                  />
                  <div className="mt-1 mb-4 flex w-full items-center justify-between">
                    {steps.map((step, idx) => (
                      <p key={idx} className="text-xs text-gray-400">
                        {step}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="mb-8 flex w-full items-center rounded-md bg-gray-100 p-1 transition-all duration-300">
                  <div
                    className={`flex flex-1 cursor-pointer justify-center gap-1 rounded-md p-2 py-2.5 text-xs font-semibold transition-all duration-300 ${registerRole === "patient" ? "text-primary bg-white shadow-sm" : "bg-gray-100 text-gray-600"}`}
                    onClick={() => {
                      setStep(1);
                      setRegisterRole("patient");
                      form.reset(PatientFormDefaults(), {
                        keepDefaultValues: false,
                      });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      fill="currentColor"
                      className={`h-4 w-4 ${registerRole === "patient" ? "text-[#5da5fd]" : "text-gray-600"}`}
                    >
                      <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" />
                    </svg>
                    <p>{t("auth.roles.patient")}</p>
                  </div>
                  <div
                    className={`flex flex-1 cursor-pointer justify-center gap-1 rounded-md p-2 py-2.5 text-xs font-semibold transition-all duration-300 ${registerRole === "professional" ? "bg-white shadow-sm" : "bg-gray-100 text-gray-600"}`}
                    onClick={() => {
                      setStep(1);
                      setRegisterRole("professional");
                      form.reset(ProfessionalFormDefaults(), {
                        keepDefaultValues: false,
                      });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      fill="currentColor"
                      className={`h-4 w-4 ${registerRole === "professional" ? "text-[#5da5fd]" : "text-gray-600"}`}
                    >
                      <path d="M320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72zM380 384.8C374.6 384.3 369 384 363.4 384L276.5 384C270.9 384 265.4 384.3 259.9 384.8L259.9 452.3C276.4 459.9 287.9 476.6 287.9 495.9C287.9 522.4 266.4 543.9 239.9 543.9C213.4 543.9 191.9 522.4 191.9 495.9C191.9 476.5 203.4 459.8 219.9 452.3L219.9 393.9C157 417 112 477.6 112 548.6C112 563.7 124.3 576 139.4 576L500.5 576C515.6 576 527.9 563.7 527.9 548.6C527.9 477.6 482.9 417.1 419.9 394L419.9 431.4C443.2 439.6 459.9 461.9 459.9 488L459.9 520C459.9 531 450.9 540 439.9 540C428.9 540 419.9 531 419.9 520L419.9 488C419.9 477 410.9 468 399.9 468C388.9 468 379.9 477 379.9 488L379.9 520C379.9 531 370.9 540 359.9 540C348.9 540 339.9 531 339.9 520L339.9 488C339.9 461.9 356.6 439.7 379.9 431.4L379.9 384.8z" />
                    </svg>
                    <p>{t("auth.roles.professional")}</p>
                  </div>
                </div>

                {/* Google Sign Up Button */}
                <div className="mb-6 flex flex-col gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      const role =
                        registerRole === "patient" ? "Patient" : "Professional";
                      getGoogleOAuthUrlMutation.mutate(role);
                    }}
                    disabled={getGoogleOAuthUrlMutation.isPending}
                  >
                    <img src={GoogleIcon} alt="Google" className="h-5 w-5" />
                    {t("auth.signUpWithGoogle")}
                  </Button>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      {t("auth.orContinueWith")}
                    </span>
                  </div>
                </div>

                {registerRole === "patient" && <PatientForm form={form} />}
                {registerRole === "professional" && (
                  <ProfessionalForm form={form} />
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t("auth.termsAgreement")} <a href="#">{t("auth.termsOfService")}</a>{" "}
        {t("common.and")} <a href="#">{t("auth.privacyPolicy")}</a>.
      </div>
    </div>
  );
}
