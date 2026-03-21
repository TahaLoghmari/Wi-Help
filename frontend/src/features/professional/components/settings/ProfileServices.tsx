import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib";
import {
  GetCurrentProfessional,
  UpdateProfessional,
  GetServicesBySpecialization,
} from "@/features/professional";

export function ProfileServices() {
  const { t } = useTranslation();
  const { data: professional } = GetCurrentProfessional();
  const { data: availableServices = [] } = GetServicesBySpecialization(
    professional?.specialization?.id,
  );
  const updateServicesMutation = UpdateProfessional();

  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => professional?.services?.map((s) => s.id) ?? [],
  );

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    updateServicesMutation.mutate({ serviceIds: selectedIds });
  };

  const selectedServices = availableServices.filter((s) =>
    selectedIds.includes(s.id),
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-brand-dark text-xs font-semibold tracking-tight">
            {t("professional.settings.services.title")}
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {t("professional.settings.services.subtitle")}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="shadow-none">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="h-9 w-full justify-between text-xs"
            >
              {selectedServices.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1">
                  {selectedServices.slice(0, 3).map((s) => (
                    <Badge
                      variant="secondary"
                      key={s.id}
                      className="text-[11px]"
                    >
                      {t(s.key)}
                    </Badge>
                  ))}
                  {selectedServices.length > 3 && (
                    <Badge variant="outline">
                      +{selectedServices.length - 3}{" "}
                      {t("professional.settings.services.more")}
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-[11px]">
                  {t("professional.settings.services.placeholder")}
                </p>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0">
            <Command>
              <CommandInput
                placeholder={t("professional.settings.services.search")}
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>
                  {t("professional.settings.services.notFound")}
                </CommandEmpty>
                <CommandGroup>
                  {availableServices.map((service) => (
                    <CommandItem
                      key={service.id}
                      value={t(service.key)}
                      onSelect={() => {
                        toggle(service.id);
                        setOpen(true);
                      }}
                    >
                      {t(service.key)}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedIds.includes(service.id)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex w-full items-center justify-end">
          <button
            className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-white transition-colors"
            type="button"
            onClick={handleSave}
            disabled={updateServicesMutation.isPending}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              data-lucide="save"
              className="lucide lucide-save h-3.5 w-3.5 text-white"
            >
              <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
              <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
              <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
            </svg>
            {t("professional.settings.services.save")}
          </button>
        </div>
      </div>
    </section>
  );
}
