import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Briefcase,
  Calendar,
  MapPin,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Spinner,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Checkbox,
} from "@/components";
import {
  experienceFormSchema,
  useGetExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
  type ExperienceDto,
} from "@/features/professional";

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

interface ExperienceFormProps {
  experience?: ExperienceDto;
  onCancel: () => void;
  isEditing?: boolean;
}

function ExperienceForm({
  experience,
  onCancel,
  isEditing = false,
}: ExperienceFormProps) {
  const { t } = useTranslation();
  const createExperienceMutation = useCreateExperience();
  const updateExperienceMutation = useUpdateExperience();

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: experience?.title ?? "",
      organization: experience?.organization ?? "",
      location: experience?.location ?? "",
      description: experience?.description ?? "",
      startYear: experience?.startYear ?? "",
      endYear: experience?.endYear ?? "",
      isCurrentPosition: experience?.isCurrentPosition ?? false,
    },
  });

  const isCurrentPosition = form.watch("isCurrentPosition");

  const onSubmit = async (values: ExperienceFormValues) => {
    const data = {
      ...values,
      endYear: values.isCurrentPosition ? null : values.endYear,
    };

    if (isEditing && experience) {
      updateExperienceMutation.mutate(
        {
          experienceId: experience.id,
          request: data,
        },
        { onSuccess: () => onCancel() },
      );
    } else {
      createExperienceMutation.mutate(data, { onSuccess: () => onCancel() });
    }
  };

  const isPending =
    createExperienceMutation.isPending || updateExperienceMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="block text-[10px] font-medium text-slate-600">
                  {t("professional.settings.experience.form.title.label")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                    placeholder={t(
                      "professional.settings.experience.form.title.placeholder",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="block text-[10px] font-medium text-slate-600">
                  {t(
                    "professional.settings.experience.form.organization.label",
                  )}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                    placeholder={t(
                      "professional.settings.experience.form.organization.placeholder",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="block text-[10px] font-medium text-slate-600">
                {t("professional.settings.experience.form.location.label")}
              </FormLabel>
              <FormControl>
                <input
                  type="text"
                  className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                  placeholder={t(
                    "professional.settings.experience.form.location.placeholder",
                  )}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="startYear"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="block text-[10px] font-medium text-slate-600">
                  {t("professional.settings.experience.form.startYear.label")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                    placeholder={t(
                      "professional.settings.experience.form.startYear.placeholder",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endYear"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="block text-[10px] font-medium text-slate-600">
                  {t("professional.settings.experience.form.endYear.label")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    placeholder={t(
                      "professional.settings.experience.form.endYear.placeholder",
                    )}
                    disabled={isCurrentPosition}
                    {...field}
                    value={isCurrentPosition ? "" : (field.value ?? "")}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isCurrentPosition"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 pt-5">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-4 w-4"
                  />
                </FormControl>
                <FormLabel className="cursor-pointer text-[10px] font-normal text-slate-600">
                  {t("professional.settings.experience.form.currentPosition")}
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="block text-[10px] font-medium text-slate-600">
                {t("professional.settings.experience.form.description.label")}
              </FormLabel>
              <FormControl>
                <textarea
                  className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full resize-none rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                  rows={3}
                  placeholder={t(
                    "professional.settings.experience.form.description.placeholder",
                  )}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-600 transition-colors hover:bg-slate-50"
          >
            <X className="h-3.5 w-3.5" />
            {t("professional.settings.experience.form.cancel")}
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-white transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Spinner className="h-3.5 w-3.5 border-2 border-white/30 border-t-white" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {isEditing
              ? t("professional.settings.experience.form.update")
              : t("professional.settings.experience.form.save")}
          </button>
        </div>
      </form>
    </Form>
  );
}

interface ExperienceCardProps {
  experience: ExperienceDto;
  onEdit: () => void;
  onDelete: () => void;
}

function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  const { t } = useTranslation();
  const dateRange = experience.isCurrentPosition
    ? `${experience.startYear} – ${t("professional.settings.experience.present")}`
    : experience.endYear
      ? `${experience.startYear} – ${experience.endYear}`
      : experience.startYear;

  return (
    <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
            <Briefcase className="h-3.5 w-3.5 text-emerald-500" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-tight text-slate-900">
              {experience.title}
            </p>
            <p className="text-[10px] text-slate-500">
              {experience.organization}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/80 px-2 py-0.5 text-[10px] text-slate-600">
                <Calendar className="h-3 w-3" />
                {dateRange}
              </span>
              {experience.location && (
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                  <MapPin className="h-3 w-3" />
                  {experience.location}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Edit experience"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center rounded-full border border-rose-100 bg-white p-1.5 text-rose-500 transition-colors hover:bg-rose-50"
            aria-label="Delete experience"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      {experience.description && (
        <p className="pl-9 text-[10px] leading-relaxed text-slate-600">
          {experience.description}
        </p>
      )}
    </article>
  );
}

export function Experience() {
  const { t } = useTranslation();
  const { data: experiences, isLoading } = useGetExperiences();
  const deleteExperienceMutation = useDeleteExperience();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(
    null,
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteExperienceMutation.mutate(deleteConfirmId, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <Spinner className="border-brand-dark h-6 w-6 border-2 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="mb-1 border-b border-slate-200 pb-3">
        <h3 className="text-brand-dark text-xs font-semibold tracking-tight">
          {t("professional.settings.experience.title")}
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {t("professional.settings.experience.subtitle")}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-start">
        <button
          type="button"
          onClick={() => setIsAddingNew(true)}
          disabled={isAddingNew}
          className="text-brand-dark hover:border-brand-blue/70 hover:bg-brand-blue/10 inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-[11px] transition-colors disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("professional.settings.experience.add")}
        </button>
      </div>
      <section className="flex flex-col gap-3 bg-white p-3 sm:p-4">
        <div className="space-y-3">
          {isAddingNew && (
            <div className="border-brand-blue/30 bg-brand-blue/5 rounded-xl border p-3">
              <p className="text-brand-dark mb-3 text-[11px] font-medium">
                {t("professional.settings.experience.addNew")}
              </p>
              <ExperienceForm onCancel={() => setIsAddingNew(false)} />
            </div>
          )}

          {experiences && experiences.length > 0 ? (
            experiences.map((experience) =>
              editingExperienceId === experience.id ? (
                <div
                  key={experience.id}
                  className="border-brand-blue/30 bg-brand-blue/5 rounded-xl border p-3"
                >
                  <p className="text-brand-dark mb-3 text-[11px] font-medium">
                    {t("professional.settings.experience.edit")}
                  </p>
                  <ExperienceForm
                    experience={experience}
                    isEditing
                    onCancel={() => setEditingExperienceId(null)}
                  />
                </div>
              ) : (
                <ExperienceCard
                  key={experience.id}
                  experience={experience}
                  onEdit={() => setEditingExperienceId(experience.id)}
                  onDelete={() => setDeleteConfirmId(experience.id)}
                />
              ),
            )
          ) : !isAddingNew ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 p-16 text-center">
              <Briefcase className="mb-2 h-8 w-8 text-slate-300" />
              <p className="text-[11px] text-slate-500">
                {t("professional.settings.experience.empty")}
              </p>
            </div>
          ) : null}
        </div>

        {experiences && experiences.length > 0 && (
          <p className="mt-2 text-[10px] text-slate-400">
            {t("professional.settings.experience.hint")}
          </p>
        )}
      </section>

      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("professional.settings.experience.delete.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("professional.settings.experience.delete.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("professional.settings.experience.delete.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-500 hover:bg-rose-600"
            >
              {deleteExperienceMutation.isPending ? (
                <Spinner className="h-4 w-4 border-2 border-white/30 border-t-white" />
              ) : (
                t("professional.settings.experience.delete.confirm")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
