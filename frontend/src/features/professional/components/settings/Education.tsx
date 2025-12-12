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
  GraduationCap,
  Calendar,
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
  educationFormSchema,
  useGetEducations,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
  type EducationDto,
} from "@/features/professional";

type EducationFormValues = z.infer<typeof educationFormSchema>;

interface EducationFormProps {
  education?: EducationDto;
  onCancel: () => void;
  isEditing?: boolean;
}

function EducationForm({
  education,
  onCancel,
  isEditing = false,
}: EducationFormProps) {
  const { t } = useTranslation();
  const createEducationMutation = useCreateEducation();
  const updateEducationMutation = useUpdateEducation();

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      institution: education?.institution ?? "",
      degree: education?.degree ?? "",
      fieldOfStudy: education?.fieldOfStudy ?? "",
      country: education?.country ?? "",
      startYear: education?.startYear ?? "",
      endYear: education?.endYear ?? "",
      isCurrentlyStudying: education?.isCurrentlyStudying ?? false,
    },
  });

  const isCurrentlyStudying = form.watch("isCurrentlyStudying");

  const onSubmit = async (values: EducationFormValues) => {
    const data = {
      ...values,
      endYear: values.isCurrentlyStudying ? null : values.endYear,
    };

    if (isEditing && education) {
      updateEducationMutation.mutate(
        {
          educationId: education.id,
          request: data,
        },
        { onSuccess: () => onCancel() },
      );
    } else {
      createEducationMutation.mutate(data, { onSuccess: () => onCancel() });
    }
  };

  const isPending =
    createEducationMutation.isPending || updateEducationMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="block text-[10px] font-medium text-slate-600">
                  {t("professional.settings.education.form.institution.label")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                    placeholder={t(
                      "professional.settings.education.form.institution.placeholder",
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
            name="degree"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="block text-[10px] font-medium text-slate-600">
                  {t("professional.settings.education.form.degree.label")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                    placeholder={t(
                      "professional.settings.education.form.degree.placeholder",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fieldOfStudy"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="block text-[10px] font-medium text-slate-600">
                  {t("professional.settings.education.form.fieldOfStudy.label")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                    placeholder={t(
                      "professional.settings.education.form.fieldOfStudy.placeholder",
                    )}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="block text-[10px] font-medium text-slate-600">
                  {t("professional.settings.education.form.country.label")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                    placeholder={t(
                      "professional.settings.education.form.country.placeholder",
                    )}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="startYear"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="block text-[10px] font-medium text-slate-600">
                  {t("professional.settings.education.form.startYear.label")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                    placeholder={t(
                      "professional.settings.education.form.startYear.placeholder",
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
                  {t("professional.settings.education.form.endYear.label")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    placeholder={t(
                      "professional.settings.education.form.endYear.placeholder",
                    )}
                    disabled={isCurrentlyStudying}
                    {...field}
                    value={isCurrentlyStudying ? "" : (field.value ?? "")}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isCurrentlyStudying"
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
                  {t("professional.settings.education.form.currentlyStudying")}
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-600 transition-colors hover:bg-slate-50"
          >
            <X className="h-3.5 w-3.5" />
            {t("professional.settings.education.form.cancel")}
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
              ? t("professional.settings.education.form.update")
              : t("professional.settings.education.form.save")}
          </button>
        </div>
      </form>
    </Form>
  );
}

interface EducationCardProps {
  education: EducationDto;
  onEdit: () => void;
  onDelete: () => void;
}

function EducationCard({ education, onEdit, onDelete }: EducationCardProps) {
  const { t } = useTranslation();
  const dateRange = education.isCurrentlyStudying
    ? `${education.startYear} – ${t("professional.settings.education.present")}`
    : education.endYear
      ? `${education.startYear} – ${education.endYear}`
      : education.startYear;

  return (
    <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
            <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="truncate font-medium tracking-tight text-slate-900">
                {education.institution}
              </span>
              <span className="hidden text-slate-300 sm:inline">•</span>
              <span className="truncate text-slate-500">
                {education.degree}
                {education.country && `, ${education.country}`}
              </span>
            </div>
            {education.fieldOfStudy && (
              <p className="mt-0.5 text-[10px] text-slate-500">
                {education.fieldOfStudy}
              </p>
            )}
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100/80 px-2 py-0.5 text-[10px] text-slate-600">
              <Calendar className="h-3 w-3" />
              <span>{dateRange}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Edit education"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center rounded-full border border-rose-100 bg-white p-1.5 text-rose-500 transition-colors hover:bg-rose-50"
            aria-label="Delete education"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function Education() {
  const { t } = useTranslation();
  const { data: educations, isLoading } = useGetEducations();
  const deleteEducationMutation = useDeleteEducation();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(
    null,
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteEducationMutation.mutate(deleteConfirmId, {
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
          {t("professional.settings.education.title")}
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {t("professional.settings.education.subtitle")}
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
          {t("professional.settings.education.add")}
        </button>
      </div>
      <section className="flex flex-col gap-3 bg-white p-3 sm:p-4">
        <div className="space-y-3">
          {isAddingNew && (
            <div className="border-brand-blue/30 bg-brand-blue/5 rounded-xl border p-3">
              <p className="text-brand-dark mb-3 text-[11px] font-medium">
                {t("professional.settings.education.addNew")}
              </p>
              <EducationForm onCancel={() => setIsAddingNew(false)} />
            </div>
          )}

          {educations && educations.length > 0 ? (
            educations.map((education) =>
              editingEducationId === education.id ? (
                <div
                  key={education.id}
                  className="border-brand-blue/30 bg-brand-blue/5 rounded-xl border p-3"
                >
                  <p className="text-brand-dark mb-3 text-[11px] font-medium">
                    {t("professional.settings.education.edit")}
                  </p>
                  <EducationForm
                    education={education}
                    isEditing
                    onCancel={() => setEditingEducationId(null)}
                  />
                </div>
              ) : (
                <EducationCard
                  key={education.id}
                  education={education}
                  onEdit={() => setEditingEducationId(education.id)}
                  onDelete={() => setDeleteConfirmId(education.id)}
                />
              ),
            )
          ) : !isAddingNew ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 p-16 text-center">
              <GraduationCap className="mb-2 h-8 w-8 text-slate-300" />
              <p className="text-[11px] text-slate-500">
                {t("professional.settings.education.empty")}
              </p>
            </div>
          ) : null}
        </div>

        {educations && educations.length > 0 && (
          <p className="mt-2 text-[10px] text-slate-400">
            {t("professional.settings.education.hint")}
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
              {t("professional.settings.education.delete.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("professional.settings.education.delete.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("professional.settings.education.delete.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-500 hover:bg-rose-600"
            >
              {deleteEducationMutation.isPending ? (
                <Spinner className="h-4 w-4 border-2 border-white/30 border-t-white" />
              ) : (
                t("professional.settings.education.delete.confirm")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
