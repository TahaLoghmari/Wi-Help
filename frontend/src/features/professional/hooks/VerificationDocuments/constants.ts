import { FileBadge, GraduationCap, IdCard, Shield } from "lucide-react";
import { DocumentStatus, DocumentType } from "../../types/enums.types";
import type {
  DocumentDefinition,
  StatusKey,
} from "../../types/verification-documents.types";

export const DOCUMENT_DEFINITIONS: DocumentDefinition[] = [
  {
    type: DocumentType.Diploma,
    title: "Diploma",
    description: "Medical degree",
    Icon: GraduationCap,
  },
  {
    type: DocumentType.ProfessionalLicense,
    title: "Professional license",
    description: "State / national license",
    Icon: FileBadge,
  },
  {
    type: DocumentType.Id,
    title: "ID",
    description: "Government-issued",
    Icon: IdCard,
  },
  {
    type: DocumentType.Insurance,
    title: "Insurance",
    description: "Professional coverage",
    Icon: Shield,
  },
];

export const STATUS_STYLES: Record<
  StatusKey,
  { container: string; dot: string; label: string }
> = {
  [DocumentStatus.Verified]: {
    container:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:text-emerald-600",
    dot: "bg-emerald-500",
    label: "Verified",
  },
  [DocumentStatus.Pending]: {
    container: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-500",
    label: "Pending review",
  },
  [DocumentStatus.Rejected]: {
    container: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    label: "Requires attention",
  },
  NotUploaded: {
    container: "border-slate-200 bg-white text-slate-500",
    dot: "bg-slate-400",
    label: "Not uploaded",
  },
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
