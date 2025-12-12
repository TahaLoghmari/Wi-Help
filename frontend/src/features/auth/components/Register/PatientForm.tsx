import type { UseFormReturn } from "react-hook-form";
import {
  useStepsStore,
  type registerFormSchema,
  getCountries,
  getRelationships,
  useRegisterPatient,
} from "@/features/auth";
import type z from "zod";
import {
  Button,
  Calendar,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@/components";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/config/i18n";

interface PatientFormProps {
  form: UseFormReturn<z.infer<typeof registerFormSchema>>;
}

export function PatientForm({ form }: PatientFormProps) {
  const { t } = useTranslation();
  const { step, setStep } = useStepsStore();
  const registerPatientMutation = useRegisterPatient();
  const [open, setOpen] = useState(false);
  return (
    <>
      {step == 1 && (
        <div className="grid gap-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      {t("forms.labels.firstName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs placeholder:text-sm"
                        placeholder={t("placeholders.firstName")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      {t("forms.labels.lastName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs placeholder:text-sm"
                        placeholder={t("placeholders.lastName")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-700">
                    {t("common.email")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="text-xs placeholder:text-sm"
                      placeholder={t("placeholders.email")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      {t("forms.labels.password")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="text-xs placeholder:text-sm"
                        placeholder={t("placeholders.createPassword")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      {t("forms.labels.confirmPassword")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="text-xs placeholder:text-sm"
                        placeholder={t("placeholders.confirmPassword")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      {t("forms.labels.gender")}
                    </FormLabel>
                    <FormControl>
                      <Select
                        key={`gender-${step}`}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            className="text-xs placeholder:text-xs"
                            placeholder={t("placeholders.selectGender")}
                          >
                            {field.value === "male"
                              ? t("common.male")
                              : field.value === "female"
                                ? t("common.female")
                                : t("common.male")}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">
                            {t("common.male")}
                          </SelectItem>
                          <SelectItem value="female">
                            {t("common.female")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs text-gray-700">
                    {t("forms.labels.dateOfBirth")}
                  </FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className={` ${field.value ? "" : "text-muted-foreground"} w-full justify-between font-normal`}
                      >
                        {field.value ? (
                          new Date(field.value).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        ) : (
                          <div className="flex items-center gap-4">
                            <CalendarIcon />
                            {t("common.selectDate")}
                          </div>
                        )}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        defaultMonth={
                          field.value ? new Date(field.value) : undefined
                        }
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(date ? date.toISOString() : "");
                          setOpen(false);
                        }}
                        captionLayout="dropdown"
                        className="rounded-lg border shadow-sm"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-700">
                    {t("forms.labels.phoneNumber")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-xs placeholder:text-sm"
                      placeholder={t("placeholders.phoneNumber")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-10 mb-2 flex w-full items-center justify-between">
            <Button
              variant="outline"
              disabled={(step as number) === 1}
              onClick={() => {
                setStep(step - 1);
              }}
            >
              {t("common.back")}
            </Button>
            <Button
              className="bg-brand-dark hover:bg-brand-dark cursor-pointer transition-transform duration-200 hover:scale-101 hover:shadow-lg"
              onClick={async () => {
                const isStep1Valid = await form.trigger([
                  "firstName",
                  "lastName",
                  "email",
                  "password",
                  "confirmPassword",
                  "gender",
                  "dateOfBirth",
                  "phoneNumber",
                ]);
                if (isStep1Valid) {
                  setStep(step + 1);
                }
              }}
            >
              {t("common.continue")}
            </Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="grid gap-3">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-xs text-gray-700">
                    {t("forms.labels.streetAddress")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-xs placeholder:text-sm"
                      placeholder={t("placeholders.streetAddress")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      {t("forms.labels.country")}
                    </FormLabel>
                    <FormControl>
                      <Select
                        key={`country-${step}`}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            className="text-xs placeholder:text-xs"
                            placeholder={t("placeholders.selectCountry")}
                          ></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {getCountries(i18n.language).map((country, idx) => (
                            <SelectItem key={idx} value={country.value}>
                              {t(country.label)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      {t("forms.labels.state")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs placeholder:text-sm"
                        placeholder={t("placeholders.state")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      {t("forms.labels.city")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs placeholder:text-sm"
                        placeholder={t("placeholders.city")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="address.postalCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      {t("forms.labels.postalCode")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs placeholder:text-sm"
                        placeholder={t("placeholders.postalCode")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mt-10 mb-2 flex w-full items-center justify-between">
            <Button
              variant="outline"
              disabled={(step as number) === 1}
              onClick={() => {
                setStep(step - 1);
              }}
            >
              {t("common.back")}
            </Button>
            <Button
              className="bg-brand-dark hover:bg-brand-dark cursor-pointer transition-transform duration-200 hover:scale-101 hover:shadow-lg"
              onClick={async () => {
                const isStep2Valid = await form.trigger([
                  "address.street",
                  "address.city",
                  "address.postalCode",
                  "address.country",
                  "address.state",
                ]);
                if (isStep2Valid) {
                  setStep(step + 1);
                }
              }}
            >
              {t("common.continue")}
            </Button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="currentColor"
              className="h-4 w-4 text-sky-500"
            >
              <path d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z" />
            </svg>
            <p className="font-semibold">{t("auth.steps.emergencyContact")}</p>
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="emergencyContact.fullName"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-xs text-gray-700">
                    {t("common.name")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-xs placeholder:text-sm"
                      placeholder={t("placeholders.emergencyContactName")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="emergencyContact.phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      {t("forms.labels.phoneNumber")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs placeholder:text-sm"
                        placeholder={t("placeholders.phoneNumber")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="emergencyContact.relationship"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      {t("forms.labels.relationship")}
                    </FormLabel>
                    <FormControl>
                      <Select
                        key={`relationship-${step}`}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            className="text-xs placeholder:text-xs"
                            placeholder={t("placeholders.selectRelationship")}
                          ></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {getRelationships(i18n.language).map(
                            (relationship, idx) => (
                              <SelectItem key={idx} value={relationship.value}>
                                {t(relationship.label)}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mt-10 mb-2 flex w-full items-center justify-between">
            <Button
              variant="outline"
              disabled={(step as number) === 1}
              onClick={() => {
                setStep(step - 1);
              }}
            >
              {t("common.back")}
            </Button>
            <Button
              type="submit"
              className="bg-brand-dark hover:bg-brand-dark cursor-pointer transition-transform duration-200 hover:scale-101 hover:shadow-lg"
              disabled={registerPatientMutation.isPending}
            >
              {registerPatientMutation.isPending ? (
                <Spinner className="h-5 w-5 border-2 invert" />
              ) : (
                t("common.register")
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
