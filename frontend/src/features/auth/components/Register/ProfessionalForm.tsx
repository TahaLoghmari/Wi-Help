import type { UseFormReturn } from "react-hook-form";
import {
  useStepsStore,
  type registerFormSchema,
  getCountries,
  useRegisterProfessional,
  getSpecializations,
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

interface ProfessionalFormProps {
  form: UseFormReturn<z.infer<typeof registerFormSchema>>;
}

export function ProfessionalForm({ form }: ProfessionalFormProps) {
  const { t, i18n } = useTranslation();
  const { step, setStep } = useStepsStore();
  const registerProfessionalMutation = useRegisterProfessional();
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
                              {country.label}
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
              <path d="M64 112C64 85.5 85.5 64 112 64L160 64C177.7 64 192 78.3 192 96C192 113.7 177.7 128 160 128L128 128L128 256C128 309 171 352 224 352C277 352 320 309 320 256L320 128L288 128C270.3 128 256 113.7 256 96C256 78.3 270.3 64 288 64L336 64C362.5 64 384 85.5 384 112L384 256C384 333.4 329 398 256 412.8L256 432C256 493.9 306.1 544 368 544C429.9 544 480 493.9 480 432L480 346.5C442.7 333.3 416 297.8 416 256C416 203 459 160 512 160C565 160 608 203 608 256C608 297.8 581.3 333.4 544 346.5L544 432C544 529.2 465.2 608 368 608C270.8 608 192 529.2 192 432L192 412.8C119 398 64 333.4 64 256L64 112zM512 288C529.7 288 544 273.7 544 256C544 238.3 529.7 224 512 224C494.3 224 480 238.3 480 256C480 273.7 494.3 288 512 288z" />
            </svg>
            <p className="font-semibold">{t("auth.steps.professionalInfo")}</p>
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-xs text-gray-700">
                    {t("forms.labels.specialization")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      key={`speciality-${step}`}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          className="text-xs placeholder:text-xs"
                          placeholder={t("placeholders.selectSpecialization")}
                        ></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {getSpecializations(i18n.language).map(
                          (specialization, idx) => (
                            <SelectItem key={idx} value={specialization.value}>
                              {specialization.label}
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
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-xs text-gray-700">
                    {t("forms.labels.experience")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      className="text-xs placeholder:text-sm"
                      placeholder={t("placeholders.experience")}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
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
              type="submit"
              className="bg-brand-dark hover:bg-brand-dark cursor-pointer transition-transform duration-200 hover:scale-101 hover:shadow-lg"
              disabled={registerProfessionalMutation.isPending}
            >
              {registerProfessionalMutation.isPending ? (
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
