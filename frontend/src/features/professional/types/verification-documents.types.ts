import type { ComponentType, SVGProps } from "react";
import type {
  DocumentStatus,
  DocumentType,
  VerificationDocumentDto,
} from "@/features/professional";

export type StatusKey = DocumentStatus | "NotUploaded";

export interface DocumentDefinition {
  type: DocumentType;
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface StatusStyle {
  container: string;
  dot: string;
  label: string;
}

export type VerificationDocumentMap = Partial<
  Record<DocumentType, VerificationDocumentDto>
>;
