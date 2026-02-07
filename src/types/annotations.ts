// Annotation types for LLMbench
// Adapted from CCS-WB session.ts - codeFileId replaced with outputId

export interface AnnotationReplyData {
  id: string;
  content: string;
  createdAt: string;
  addedBy?: string;
  profileColor?: string;
}

export interface LineAnnotation {
  id: string;
  outputId: string;          // Which output panel this annotation belongs to (replaces codeFileId)
  lineNumber: number;
  endLineNumber?: number;
  lineContent: string;
  type: "observation" | "question" | "metaphor" | "pattern" | "context" | "critique";
  content: string;
  createdAt: string;
  orphaned?: boolean;
  addedBy?: string;
  replies?: AnnotationReplyData[];
}

export type LineAnnotationType = LineAnnotation["type"];

export const LINE_ANNOTATION_TYPES: LineAnnotationType[] = [
  "observation",
  "question",
  "metaphor",
  "pattern",
  "context",
  "critique",
];

export const LINE_ANNOTATION_LABELS: Record<LineAnnotationType, string> = {
  observation: "Observation",
  question: "Question",
  metaphor: "Metaphor",
  pattern: "Pattern",
  context: "Context",
  critique: "Critique",
};
