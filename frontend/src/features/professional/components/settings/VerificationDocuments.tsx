import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import {
  DocumentType,
  GetVerificationDocuments,
  UploadVerificationDocument,
  type StatusKey,
  type VerificationDocumentDto,
  type VerificationDocumentMap,
} from "@/features/professional";
import {
  DOCUMENT_DEFINITIONS,
  MAX_FILE_SIZE,
  STATUS_STYLES,
} from "@/features/professional/hooks/VerificationDocuments";
import { cn } from "@/lib";
import { Spinner } from "@/components";

export function VerificationDocuments() {
  const { data, isLoading } = GetVerificationDocuments();
  const uploadDocumentMutation = UploadVerificationDocument();
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);

  const documentsByType = useMemo<VerificationDocumentMap>(() => {
    if (!data) return {};

    return data.reduce(
      (acc, document) => {
        acc[document.type] = document;
        return acc;
      },
      {} as Record<DocumentType, VerificationDocumentDto>,
    );
  }, [data]);

  const handleFileChange = useCallback(
    (type: DocumentType, event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";

      if (!file) return;
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("Document size must be 5 MB or less.");
        return;
      }

      setUploadingType(type);
      uploadDocumentMutation.mutate(
        { documentType: type, document: file },
        {
          onSettled: () => {
            setUploadingType((current) => (current === type ? null : current));
          },
        },
      );
    },
    [uploadDocumentMutation],
  );

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <Spinner className="border-brand-dark h-6 w-6 border-2 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4" id="settings-panel-verification">
      <div className="mb-1 border-b border-slate-200 pb-3">
        <h3 className="text-brand-dark text-xs font-semibold tracking-tight">
          Verification Documents
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Upload and manage the documents used to verify your professional
          identity. Updates may require compliance review.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
        {DOCUMENT_DEFINITIONS.map(({ type, title, description, Icon }) => {
          const document = documentsByType[type];
          const statusKey: StatusKey = document?.status ?? "NotUploaded";
          const statusStyle = STATUS_STYLES[statusKey];
          const isUploading = uploadingType === type;

          return (
            <article
              key={type}
              className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-slate-700">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
                    <Icon className="h-3.5 w-3.5 text-slate-500" />
                  </span>
                  <div>
                    <p className="font-medium tracking-tight text-slate-900">
                      {title}
                    </p>
                    <p className="text-[10px] text-slate-500">{description}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
                    statusStyle.container,
                  )}
                >
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", statusStyle.dot)}
                  />
                  <span>{statusStyle.label}</span>
                </span>
              </div>

              <label
                htmlFor={`document-upload-${type}`}
                className={cn(
                  "group hover:border-brand-blue/70 hover:bg-brand-blue/5 relative mt-1 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white/60 px-3 py-4 text-[11px] text-slate-700 transition-colors",
                  "cursor-pointer",
                )}
              >
                <input
                  id={`document-upload-${type}`}
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(event) => handleFileChange(type, event)}
                />
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
                    {isUploading ? (
                      <Spinner className="border-t-brand-dark h-4 w-4 border-2 border-slate-300" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-brand-dark font-medium tracking-tight">
                      {isUploading
                        ? "Uploading..."
                        : "Click to upload document"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      PDF up to 5 MB
                    </span>
                  </div>
                </div>
                {document?.documentUrl && (
                  <a
                    href={document.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#00799f] underline underline-offset-2"
                  >
                    View last uploaded file
                  </a>
                )}
              </label>
            </article>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
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
              data-lucide="info"
              className="lucide lucide-info h-3 w-3"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
          </span>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            Uploading a new document will reset its status to
            <span className="font-medium text-slate-700"> Pending</span>
            while our compliance team reviews the update.
          </p>
        </div>
        <p className="text-[11px] text-slate-400">
          Typical review time: 1–2 business days.
        </p>
      </div>
    </div>
  );
}
