/**
 * Export utilities for LLMbench comparisons
 * Supports JSON, Markdown, plain text, and PDF export formats
 */

import type { SavedComparison } from "@/types";
import type { LineAnnotation } from "@/types";
import type { DiffSegment } from "@/lib/diff/word-diff";

/** Count words in a string */
function wordCount(text: string | undefined): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Export comparison as structured JSON
 */
export function exportAsJSON(comparison: SavedComparison): string {
  // Augment with computed word counts
  const augmented = {
    ...comparison,
    outputA: comparison.outputA
      ? { ...comparison.outputA, wordCount: wordCount(comparison.outputA.text) }
      : comparison.outputA,
    outputB: comparison.outputB
      ? { ...comparison.outputB, wordCount: wordCount(comparison.outputB.text) }
      : comparison.outputB,
  };
  return JSON.stringify(augmented, null, 2);
}

/**
 * Export comparison as Markdown document with inline annotations as footnotes
 */
export function exportAsMarkdown(comparison: SavedComparison): string {
  const lines: string[] = [];

  lines.push(`# ${comparison.name || "Untitled Comparison"}`);
  lines.push("");
  lines.push(`**Created:** ${new Date(comparison.createdAt).toLocaleDateString()}`);
  lines.push(`**Updated:** ${new Date(comparison.updatedAt).toLocaleDateString()}`);
  lines.push("");

  // Prompt
  lines.push("## Prompt");
  lines.push("");
  lines.push(comparison.prompt);
  lines.push("");

  // Panel A
  lines.push("---");
  lines.push("");
  lines.push("## Panel A");
  if (comparison.outputA?.provenance) {
    const p = comparison.outputA.provenance;
    lines.push("");
    const wc = wordCount(comparison.outputA?.text);
    lines.push(
      `**Model:** ${p.modelDisplayName} (${p.provider}) | **Temperature:** ${p.temperature} | **Response time:** ${(p.responseTimeMs / 1000).toFixed(1)}s | **Words:** ${wc.toLocaleString()}`
    );
  }
  lines.push("");
  if (comparison.outputA?.text) {
    lines.push(comparison.outputA.text);
  } else if (comparison.outputA?.error) {
    lines.push(`*Error: ${comparison.outputA.error}*`);
  }
  lines.push("");

  // Panel A annotations
  if (comparison.annotationsA.length > 0) {
    lines.push("### Annotations (Panel A)");
    lines.push("");
    for (const ann of comparison.annotationsA) {
      const lineRef = ann.endLineNumber
        ? `L${ann.lineNumber}-${ann.endLineNumber}`
        : `L${ann.lineNumber}`;
      lines.push(
        `- **[${ann.type.toUpperCase()}]** (${lineRef}): ${ann.content}`
      );
    }
    lines.push("");
  }

  // Panel B
  lines.push("---");
  lines.push("");
  lines.push("## Panel B");
  if (comparison.outputB?.provenance) {
    const p = comparison.outputB.provenance;
    lines.push("");
    const wc = wordCount(comparison.outputB?.text);
    lines.push(
      `**Model:** ${p.modelDisplayName} (${p.provider}) | **Temperature:** ${p.temperature} | **Response time:** ${(p.responseTimeMs / 1000).toFixed(1)}s | **Words:** ${wc.toLocaleString()}`
    );
  }
  lines.push("");
  if (comparison.outputB?.text) {
    lines.push(comparison.outputB.text);
  } else if (comparison.outputB?.error) {
    lines.push(`*Error: ${comparison.outputB.error}*`);
  }
  lines.push("");

  // Panel B annotations
  if (comparison.annotationsB.length > 0) {
    lines.push("### Annotations (Panel B)");
    lines.push("");
    for (const ann of comparison.annotationsB) {
      const lineRef = ann.endLineNumber
        ? `L${ann.lineNumber}-${ann.endLineNumber}`
        : `L${ann.lineNumber}`;
      lines.push(
        `- **[${ann.type.toUpperCase()}]** (${lineRef}): ${ann.content}`
      );
    }
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("*Exported from LLMbench*");

  return lines.join("\n");
}

// ---------- annotation type prefix mapping ----------

const ANNOTATION_PREFIXES: Record<string, string> = {
  observation: "OBS",
  question: "Q",
  metaphor: "MET",
  pattern: "PAT",
  context: "CTX",
  critique: "CRT",
};

// ---------- plain text export ----------

function formatAnnotationsText(annotations: LineAnnotation[]): string {
  if (annotations.length === 0) return "";
  const lines: string[] = ["", "  Annotations:"];
  for (const ann of annotations) {
    const prefix = ANNOTATION_PREFIXES[ann.type] ?? ann.type.toUpperCase();
    const lineRef = ann.endLineNumber
      ? `L${ann.lineNumber}-${ann.endLineNumber}`
      : `L${ann.lineNumber}`;
    lines.push(`    [${prefix}] ${lineRef}: ${ann.content}`);
  }
  return lines.join("\n");
}

/**
 * Export comparison as formatted plain text
 */
export function exportAsText(comparison: SavedComparison): string {
  const bar = "\u2550".repeat(55);
  const dash = "\u2500".repeat(40);
  const lines: string[] = [];

  lines.push(bar);
  lines.push("LLMBENCH COMPARISON LOG");
  lines.push(bar);
  lines.push(`Comparison: ${comparison.name || "Untitled"}`);
  lines.push(`Created: ${new Date(comparison.createdAt).toLocaleString()}`);
  lines.push(`Prompt: ${comparison.prompt}`);
  lines.push("");

  // Panel A
  if (comparison.outputA?.provenance) {
    const p = comparison.outputA.provenance;
    const wc = wordCount(comparison.outputA?.text);
    lines.push(
      `PANEL A \u2014 ${p.modelDisplayName} (t=${p.temperature}, ${(p.responseTimeMs / 1000).toFixed(1)}s, ${wc.toLocaleString()} words)`
    );
  } else {
    lines.push("PANEL A");
  }
  lines.push(dash);
  if (comparison.outputA?.text) {
    lines.push(comparison.outputA.text);
  } else if (comparison.outputA?.error) {
    lines.push(`[Error: ${comparison.outputA.error}]`);
  }
  lines.push(formatAnnotationsText(comparison.annotationsA));
  lines.push("");

  // Panel B
  if (comparison.outputB?.provenance) {
    const p = comparison.outputB.provenance;
    const wc = wordCount(comparison.outputB?.text);
    lines.push(
      `PANEL B \u2014 ${p.modelDisplayName} (t=${p.temperature}, ${(p.responseTimeMs / 1000).toFixed(1)}s, ${wc.toLocaleString()} words)`
    );
  } else {
    lines.push("PANEL B");
  }
  lines.push(dash);
  if (comparison.outputB?.text) {
    lines.push(comparison.outputB.text);
  } else if (comparison.outputB?.error) {
    lines.push(`[Error: ${comparison.outputB.error}]`);
  }
  lines.push(formatAnnotationsText(comparison.annotationsB));
  lines.push("");

  lines.push(bar);
  lines.push("Exported from LLMbench");

  return lines.join("\n");
}

// ---------- PDF export ----------

// Annotation badge colours matching CCS-WB (RGB values)
const ANNOTATION_PDF_COLORS: Record<string, [number, number, number]> = {
  observation: [96, 165, 250],
  question: [251, 191, 36],
  metaphor: [192, 132, 252],
  pattern: [74, 222, 128],
  context: [148, 163, 184],
  critique: [157, 78, 89],
};

// Diff highlight colours for PDF (RGB)
const DIFF_REMOVED_COLOR: [number, number, number] = [180, 40, 40];
const DIFF_ADDED_COLOR: [number, number, number] = [30, 130, 50];
const DIFF_REMOVED_BG: [number, number, number] = [255, 230, 230];
const DIFF_ADDED_BG: [number, number, number] = [230, 255, 235];
const DIFF_COMMON_COLOR: [number, number, number] = [30, 30, 30];

export interface PdfDiffData {
  segmentsA: DiffSegment[];
  segmentsB: DiffSegment[];
}

/**
 * Export comparison as PDF document with side-by-side panels.
 * Uses landscape A4 for adequate column width.
 * If diffData is provided, highlights unique words per panel.
 */
export async function exportAsPDF(
  comparison: SavedComparison,
  diffData?: PdfDiffData
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth(); // ~297
  const pageHeight = doc.internal.pageSize.getHeight(); // ~210
  const margin = 12;
  const gap = 6;
  const colWidth = (pageWidth - margin * 2 - gap) / 2;
  const colAx = margin;
  const colBx = margin + colWidth + gap;
  const textSize = 9;
  const lineH = 3.8;
  const bottomMargin = margin + 8;

  let y = margin;

  function newPage() {
    doc.addPage();
    y = margin;
  }

  function checkPage(needed: number) {
    if (y + needed > pageHeight - bottomMargin) {
      newPage();
    }
  }

  // ---- Title + metadata (full width) ----
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(comparison.name || "Untitled Comparison", margin, y);
  y += 7;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Created: ${new Date(comparison.createdAt).toLocaleString()}` +
      (diffData ? "  \u2022  Diff mode" : ""),
    margin,
    y
  );
  y += 5;

  // Prompt
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Prompt", margin, y);
  y += 5;
  doc.setFontSize(textSize);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  const fullWidth = pageWidth - margin * 2;
  const promptLines = doc.splitTextToSize(comparison.prompt, fullWidth);
  checkPage(promptLines.length * lineH + 4);
  doc.text(promptLines, margin, y);
  y += promptLines.length * lineH + 5;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 3;

  // ---- Column headers ----
  function renderColumnHeader(
    x: number,
    label: string,
    output: SavedComparison["outputA"],
    tintColor: [number, number, number]
  ) {
    // Tinted background
    doc.setFillColor(tintColor[0], tintColor[1], tintColor[2]);
    doc.rect(x, y - 0.5, colWidth, 6, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    let header = label;
    if (output?.provenance) {
      const p = output.provenance;
      header += ` \u2014 ${p.modelDisplayName}`;
    }
    doc.text(header, x + 2, y + 3.5);

    if (output?.provenance) {
      const p = output.provenance;
      const wc = wordCount(output?.text);
      const meta = `${wc.toLocaleString()} words  t=${p.temperature}  ${(p.responseTimeMs / 1000).toFixed(1)}s`;
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(meta, x + colWidth - 2, y + 3.5, { align: "right" });
    }
  }

  const headerY = y;
  renderColumnHeader(colAx, "Panel A", comparison.outputA, [235, 240, 255]);
  y = headerY;
  renderColumnHeader(colBx, "Panel B", comparison.outputB, [255, 248, 235]);
  y += 8;

  // ---- Render text in columns ----

  // Pre-split both panels into wrapped lines (or diff-coloured word chunks)
  doc.setFontSize(textSize);
  doc.setFont("helvetica", "normal");

  /**
   * Render plain text in a column, returning final y position.
   */
  function renderPlainColumn(
    x: number,
    startY: number,
    text: string
  ): number {
    const lines = doc.splitTextToSize(text, colWidth - 4);
    let cy = startY;
    for (const line of lines) {
      if (cy + lineH > pageHeight - bottomMargin) {
        newPage();
        cy = y;
      }
      doc.setTextColor(30, 30, 30);
      doc.text(line, x + 2, cy);
      cy += lineH;
    }
    return cy;
  }

  /**
   * Render diff-highlighted text in a column using word-by-word
   * positioning with coloured backgrounds for unique segments.
   */
  function renderDiffColumn(
    x: number,
    startY: number,
    segments: DiffSegment[],
    uniqueType: "removed" | "added"
  ): number {
    const colLeft = x + 2;
    const colRight = x + colWidth - 2;
    let cx = colLeft;
    let cy = startY;

    const uniqueColor = uniqueType === "removed" ? DIFF_REMOVED_COLOR : DIFF_ADDED_COLOR;
    const uniqueBg = uniqueType === "removed" ? DIFF_REMOVED_BG : DIFF_ADDED_BG;

    for (const seg of segments) {
      // Split segment into words preserving whitespace
      const tokens = seg.text.split(/(\s+)/);
      for (const token of tokens) {
        if (token.length === 0) continue;

        // Handle newlines
        if (/\n/.test(token)) {
          const nlCount = (token.match(/\n/g) || []).length;
          for (let n = 0; n < nlCount; n++) {
            cy += lineH;
            cx = colLeft;
            if (cy > pageHeight - bottomMargin) {
              newPage();
              cy = y;
            }
          }
          continue;
        }

        const tw = doc.getTextWidth(token);

        // Wrap if needed (but not for pure whitespace)
        if (cx + tw > colRight && token.trim().length > 0) {
          cy += lineH;
          cx = colLeft;
          if (cy > pageHeight - bottomMargin) {
            newPage();
            cy = y;
          }
          // Skip leading whitespace on new line
          if (token.trim().length === 0) continue;
        }

        if (seg.type === uniqueType) {
          // Draw background highlight
          doc.setFillColor(uniqueBg[0], uniqueBg[1], uniqueBg[2]);
          doc.rect(cx - 0.2, cy - 3, tw + 0.4, lineH + 0.2, "F");
          doc.setTextColor(uniqueColor[0], uniqueColor[1], uniqueColor[2]);
        } else {
          doc.setTextColor(DIFF_COMMON_COLOR[0], DIFF_COMMON_COLOR[1], DIFF_COMMON_COLOR[2]);
        }

        doc.text(token, cx, cy);
        cx += tw;
      }
    }

    return cy + lineH;
  }

  // Render both columns in parallel, tracking y per column
  const textStartY = y;
  let yA = textStartY;
  let yB = textStartY;

  if (comparison.outputA?.text) {
    if (diffData) {
      yA = renderDiffColumn(colAx, textStartY, diffData.segmentsA, "removed");
    } else {
      yA = renderPlainColumn(colAx, textStartY, comparison.outputA.text);
    }
  } else if (comparison.outputA?.error) {
    doc.setTextColor(200, 0, 0);
    doc.text(`Error: ${comparison.outputA.error}`, colAx + 2, textStartY);
    yA = textStartY + lineH;
  }

  if (comparison.outputB?.text) {
    if (diffData) {
      yB = renderDiffColumn(colBx, textStartY, diffData.segmentsB, "added");
    } else {
      yB = renderPlainColumn(colBx, textStartY, comparison.outputB.text);
    }
  } else if (comparison.outputB?.error) {
    doc.setTextColor(200, 0, 0);
    doc.text(`Error: ${comparison.outputB.error}`, colBx + 2, textStartY);
    yB = textStartY + lineH;
  }

  y = Math.max(yA, yB) + 5;

  // ---- Annotations (below both columns, full width per panel) ----
  function renderAnnotations(
    label: string,
    annotations: LineAnnotation[],
    x: number,
    width: number
  ) {
    if (annotations.length === 0) return;
    checkPage(10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`${label} Annotations`, x, y);
    y += 4;

    for (const ann of annotations) {
      checkPage(8);
      const prefix = ANNOTATION_PREFIXES[ann.type] ?? ann.type.toUpperCase();
      const lineRef = ann.endLineNumber
        ? `L${ann.lineNumber}-${ann.endLineNumber}`
        : `L${ann.lineNumber}`;
      const color = ANNOTATION_PDF_COLORS[ann.type] ?? [100, 100, 100];

      // Badge
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(x, y - 2.5, 9, 4, 1, 1, "F");
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(prefix, x + 0.8, y + 0.3);

      // Content
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      const annText = `${lineRef}: ${ann.content}`;
      const annLines = doc.splitTextToSize(annText, width - 12);
      doc.text(annLines, x + 11, y + 0.3);
      y += annLines.length * 3.5 + 1.5;
    }
    y += 3;
  }

  renderAnnotations("Panel A", comparison.annotationsA, colAx, colWidth);
  renderAnnotations("Panel B", comparison.annotationsB, colBx, colWidth);

  // Footer
  checkPage(8);
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text("Exported from LLMbench", margin, pageHeight - margin);

  // Download
  const filename = `${(comparison.name || "comparison").replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`;
  doc.save(filename);
}

/**
 * Trigger a file download in the browser
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
