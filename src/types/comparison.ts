// Comparison types for local persistence
import type { LineAnnotation } from "./annotations";
import type { OutputProvenance } from "./ai-settings";

export interface ComparisonOutput {
  text: string;
  provenance: OutputProvenance;
  error?: string;
}

export interface SavedComparison {
  id: string;
  name: string;
  prompt: string;
  outputA: ComparisonOutput | null;
  outputB: ComparisonOutput | null;
  annotationsA: LineAnnotation[];
  annotationsB: LineAnnotation[];
  createdAt: string;
  updatedAt: string;
}
