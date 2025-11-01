import type { UseFormReturn } from "react-hook-form";
import {
  useStepsStore,
  type registerFormSchema,
  COUNTRIES,
  useRegister,
  SPECIALIZATIONS,
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

interface ProfessionalFormProps {
  form: UseFormReturn<z.infer<typeof registerFormSchema>>;
}

export function ProfessionalForm({ form }: ProfessionalFormProps) {
  const { step, setStep } = useStepsStore();
  const registerMutation = useRegister();
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
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs placeholder:text-sm"
                        placeholder="Enter first name"
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
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs placeholder:text-sm"
                        placeholder="Enter last name"
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
                  <FormLabel className="text-xs text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="text-xs placeholder:text-sm"
                      placeholder="Enter email address"
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
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="text-xs placeholder:text-sm"
                        placeholder="Create password"
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
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="text-xs placeholder:text-sm"
                        placeholder="Confirm password"
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
                      Gender
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
                            placeholder="Select Gender"
                          >
                            {field.value === "male"
                              ? "Male"
                              : field.value === "female"
                                ? "Female"
                                : "Male"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
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
                    Date Of Birth
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
                            Select date
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
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-xs placeholder:text-sm"
                      placeholder="Enter phone number"
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
              Back
            </Button>
            <Button
              className="cursor-pointer bg-linear-to-r from-[#3fa6ff] to-[#00e984] transition-transform duration-200 hover:scale-101 hover:shadow-lg"
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
              Continue to Next Step
            </Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="grid gap-3">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="workplace.street"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-xs text-gray-700">
                    Street Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-xs placeholder:text-sm"
                      placeholder="Enter street address"
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
                name="workplace.city"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs placeholder:text-sm"
                        placeholder="Enter city"
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
                name="workplace.postalCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs text-gray-700">
                      Postal Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs placeholder:text-sm"
                        placeholder="Enter postal code"
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
              name="workplace.country"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-xs text-gray-700">
                    Country
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
                          placeholder="Select Country"
                        ></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country, idx) => (
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
          <div className="mt-10 mb-2 flex w-full items-center justify-between">
            <Button
              variant="outline"
              disabled={(step as number) === 1}
              onClick={() => {
                setStep(step - 1);
              }}
            >
              Back
            </Button>
            <Button
              className="cursor-pointer bg-linear-to-r from-[#3fa6ff] to-[#00e984] transition-transform duration-200 hover:scale-101 hover:shadow-lg"
              onClick={async () => {
                const isStep2Valid = await form.trigger([
                  "workplace.street",
                  "workplace.city",
                  "workplace.postalCode",
                  "workplace.country",
                ]);
                if (isStep2Valid) {
                  setStep(step + 1);
                }
              }}
            >
              Continue to Next Step
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
            <p className="font-semibold">Emergency Contact</p>
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-xs text-gray-700">
                    Specialization
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
                          placeholder="Select specialization"
                        ></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALIZATIONS.map((specialization, idx) => (
                          <SelectItem key={idx} value={specialization.value}>
                            {specialization.label}
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
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-xs text-gray-700">
                    Years Of Experience
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      className="text-xs placeholder:text-sm"
                      placeholder="Enter years of experience"
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
              Back
            </Button>
            <Button
              type="submit"
              className="cursor-pointer bg-linear-to-r from-[#3fa6ff] to-[#00e984] transition-transform duration-200 hover:scale-101 hover:shadow-lg"
              disabled={!form.formState.isValid || registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <Spinner className="h-5 w-5 border-2 invert" />
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
