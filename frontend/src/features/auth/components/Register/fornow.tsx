

export function ForNow()
{
    return {step === 1 ? (
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                              <FormLabel>{t("common.firstName")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("auth.firstNamePlaceholder")}
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
                              <FormLabel>{t("common.lastName")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("auth.lastNamePlaceholder")}
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
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common.gender")}</FormLabel>
                            <FormControl>
                              <Select
                                key={`gender-${step}`}
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={t(
                                      "auth.genderMalePlaceholder",
                                    )}
                                  >
                                    {field.value === "male"
                                      ? t("auth.genderMalePlaceholder")
                                      : field.value === "female"
                                        ? t("auth.genderFemalePlaceholder")
                                        : t("auth.genderMalePlaceholder")}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">
                                    {t("auth.genderMalePlaceholder")}
                                  </SelectItem>
                                  <SelectItem value="female">
                                    {t("auth.genderFemalePlaceholder")}
                                  </SelectItem>
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
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common.email")}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder={t("auth.emailPlaceholder")}
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
                              <FormLabel>{t("common.password")}</FormLabel>
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
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                              <FormLabel>
                                {t("common.confirmPassword")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder={t(
                                    "auth.confirmPasswordPlaceholder",
                                  )}
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
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common.phoneNumber")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("auth.phoneNumberPlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      onClick={async () => {
                        const isStep1Valid = await form.trigger([
                          "firstName",
                          "lastName",
                          "gender",
                          "email",
                          "password",
                          "confirmPassword",
                          "phoneNumber",
                        ]);
                        if (isStep1Valid) {
                          setStep(2);
                        }
                      }}
                      className="mb-4 w-full bg-[#386d52] hover:bg-[#386d52]/90"
                    >
                      {t("common.continue")}
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>{t("common.dateOfBirth")}</FormLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date"
                                  className={` ${field.value ? "" : "text-muted-foreground"} w-full justify-between font-normal`}
                                >
                                  {field.value ? (
                                    new Date(field.value).toLocaleDateString(
                                      undefined,
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      },
                                    )
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
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) =>
                                    field.onChange(
                                      date ? date.toISOString() : "",
                                    )
                                  }
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
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common.address")}</FormLabel>
                            <FormControl>
                              <div className="flex items-center rounded-md border px-3 py-2 shadow-xs">
                                <MapPin className="text-muted-foreground h-5 w-5" />
                                <Input
                                  type="text"
                                  placeholder={t("auth.addressPlaceholder")}
                                  className="h-5 border-none py-0 shadow-none outline-none focus:border-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                      <Button
                        type="submit"
                        className="w-full bg-[#386d52]"
                        disabled={
                          !form.formState.isValid || registerMutation.isPending
                        }
                      >
                        {registerMutation.isPending ? (
                          <Spinner className="h-5 w-5 border-2 invert" />
                        ) : (
                          t("common.register")
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setStep(1);
                        }}
                      >
                        Previous
                      </Button>
                    </div>
                  </div>
                )}
}