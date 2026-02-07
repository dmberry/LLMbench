import { diffWords } from "diff";

export type DiffSegment = {
  text: string;
  type: "common" | "added" | "removed";
};

/**
 * Compute word-level diff between two texts.
 * Returns two arrays of segments: one for each panel.
 * Panel A shows "removed" highlights (words only in A).
 * Panel B shows "added" highlights (words only in B).
 * Common words are unmarked in both.
 */
export function computeWordDiff(
  textA: string,
  textB: string
): { segmentsA: DiffSegment[]; segmentsB: DiffSegment[] } {
  const changes = diffWords(textA, textB);

  const segmentsA: DiffSegment[] = [];
  const segmentsB: DiffSegment[] = [];

  for (const change of changes) {
    if (change.added) {
      // Only in B
      segmentsB.push({ text: change.value, type: "added" });
    } else if (change.removed) {
      // Only in A
      segmentsA.push({ text: change.value, type: "removed" });
    } else {
      // Common to both
      segmentsA.push({ text: change.value, type: "common" });
      segmentsB.push({ text: change.value, type: "common" });
    }
  }

  return { segmentsA, segmentsB };
}
