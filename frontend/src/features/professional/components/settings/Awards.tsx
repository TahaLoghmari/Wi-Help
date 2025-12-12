import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { Plus, Pencil, Trash2, Save, X, Medal, Calendar } from "lucide-react";
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
} from "@/components";
import {
  awardFormSchema,
  useGetAwards,
  useCreateAward,
  useUpdateAward,
  useDeleteAward,
  type AwardDto,
} from "@/features/professional";

type AwardFormValues = z.infer<typeof awardFormSchema>;

interface AwardFormProps {
  award?: AwardDto;
  onCancel: () => void;
  isEditing?: boolean;
}

function AwardForm({ award, onCancel, isEditing = false }: AwardFormProps) {
  const { t } = useTranslation();
  const createAwardMutation = useCreateAward();
  const updateAwardMutation = useUpdateAward();

  const form = useForm<AwardFormValues>({
    resolver: zodResolver(awardFormSchema),
    defaultValues: {
      title: award?.title ?? "",
      issuer: award?.issuer ?? "",
      description: award?.description ?? "",
      yearReceived: award?.yearReceived ?? "",
    },
  });

  const onSubmit = async (values: AwardFormValues) => {
    if (isEditing && award) {
      updateAwardMutation.mutate(
        {
          awardId: award.id,
          request: values,
        },
        { onSuccess: () => onCancel() },
      );
    } else {
      createAwardMutation.mutate(values, { onSuccess: () => onCancel() });
    }
  };

  const isPending =
    createAwardMutation.isPending || updateAwardMutation.isPending;

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
                  {t("professional.settings.awards.form.title.label")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                    placeholder={t(
                      "professional.settings.awards.form.title.placeholder",
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
            name="yearReceived"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="block text-[10px] font-medium text-slate-600">
                  {t("professional.settings.awards.form.yearReceived.label")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                    placeholder={t(
                      "professional.settings.awards.form.yearReceived.placeholder",
                    )}
                    maxLength={4}
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
          name="issuer"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="block text-[10px] font-medium text-slate-600">
                {t("professional.settings.awards.form.issuer.label")}
              </FormLabel>
              <FormControl>
                <input
                  type="text"
                  className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                  placeholder={t(
                    "professional.settings.awards.form.issuer.placeholder",
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
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="block text-[10px] font-medium text-slate-600">
                {t("professional.settings.awards.form.description.label")}
              </FormLabel>
              <FormControl>
                <textarea
                  className="placeholder:text-muted-foreground focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full resize-none rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] focus:ring-1 focus:outline-none"
                  rows={3}
                  placeholder={t(
                    "professional.settings.awards.form.description.placeholder",
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
            {t("professional.settings.awards.form.cancel")}
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
              ? t("professional.settings.awards.form.update")
              : t("professional.settings.awards.form.save")}
          </button>
        </div>
      </form>
    </Form>
  );
}

interface AwardCardProps {
  award: AwardDto;
  onEdit: () => void;
  onDelete: () => void;
}

function AwardCard({ award, onEdit, onDelete }: AwardCardProps) {
  return (
    <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
            <Medal className="h-3.5 w-3.5 text-amber-500" />
          </span>
          <div className="text-[11px] text-slate-800">
            <p className="font-medium tracking-tight">{award.title}</p>
            {award.issuer && (
              <p className="text-[10px] text-slate-500">{award.issuer}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
            <Calendar className="h-3 w-3" />
            {award.yearReceived}
          </span>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Edit award"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center rounded-full border border-rose-100 bg-white p-1.5 text-rose-500 transition-colors hover:bg-rose-50"
            aria-label="Delete award"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      {award.description && (
        <p className="pl-9 text-[10px] leading-relaxed text-slate-600">
          {award.description}
        </p>
      )}
    </article>
  );
}

export function Awards() {
  const { data: awards, isLoading } = useGetAwards();
  const deleteAwardMutation = useDeleteAward();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAwardId, setEditingAwardId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteAwardMutation.mutate(deleteConfirmId, {
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
          {t("professional.settings.awards.title")}
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {t("professional.settings.awards.subtitle")}
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
          {t("professional.settings.awards.add")}
        </button>
      </div>
      <section className="flex flex-col gap-3 bg-white p-3 sm:p-4">
        <div className="space-y-3">
          {isAddingNew && (
            <div className="border-brand-blue/30 bg-brand-blue/5 rounded-xl border p-3">
              <p className="text-brand-dark mb-3 text-[11px] font-medium">
                {t("professional.settings.awards.addNew")}
              </p>
              <AwardForm onCancel={() => setIsAddingNew(false)} />
            </div>
          )}

          {awards && awards.length > 0 ? (
            awards.map((award) =>
              editingAwardId === award.id ? (
                <div
                  key={award.id}
                  className="border-brand-blue/30 bg-brand-blue/5 rounded-xl border p-3"
                >
                  <p className="text-brand-dark mb-3 text-[11px] font-medium">
                    {t("professional.settings.awards.edit")}
                  </p>
                  <AwardForm
                    award={award}
                    isEditing
                    onCancel={() => setEditingAwardId(null)}
                  />
                </div>
              ) : (
                <AwardCard
                  key={award.id}
                  award={award}
                  onEdit={() => setEditingAwardId(award.id)}
                  onDelete={() => setDeleteConfirmId(award.id)}
                />
              ),
            )
          ) : !isAddingNew ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 p-16 text-center">
              <Medal className="mb-2 h-8 w-8 text-slate-300" />
              <p className="text-[11px] text-slate-500">
                {t("professional.settings.awards.empty")}
              </p>
            </div>
          ) : null}
        </div>

        {awards && awards.length > 0 && (
          <p className="mt-2 text-[10px] text-slate-400">
            {t("professional.settings.awards.hint")}
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
              {t("professional.settings.awards.delete.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("professional.settings.awards.delete.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("professional.settings.awards.delete.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-500 hover:bg-rose-600"
            >
              {deleteAwardMutation.isPending ? (
                <Spinner className="h-4 w-4 border-2 border-white/30 border-t-white" />
              ) : (
                t("professional.settings.awards.delete.confirm")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
