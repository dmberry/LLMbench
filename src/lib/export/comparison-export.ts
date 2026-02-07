/**
 * Export utilities for LLMbench comparisons
 * Supports JSON, Markdown, plain text, and PDF export formats
 */

import type { SavedComparison } from "@/types";
import type { LineAnnotation } from "@/types";

/**
 * Export comparison as structured JSON
 */
export function exportAsJSON(comparison: SavedComparison): string {
  return JSON.stringify(comparison, null, 2);
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
    lines.push(
      `**Model:** ${p.modelDisplayName} (${p.provider}) | **Temperature:** ${p.temperature} | **Response time:** ${(p.responseTimeMs / 1000).toFixed(1)}s`
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
    lines.push(
      `**Model:** ${p.modelDisplayName} (${p.provider}) | **Temperature:** ${p.temperature} | **Response time:** ${(p.responseTimeMs / 1000).toFixed(1)}s`
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
    lines.push(
      `PANEL A \u2014 ${p.modelDisplayName} (t=${p.temperature}, ${(p.responseTimeMs / 1000).toFixed(1)}s)`
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
    lines.push(
      `PANEL B \u2014 ${p.modelDisplayName} (t=${p.temperature}, ${(p.responseTimeMs / 1000).toFixed(1)}s)`
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

/**
 * Export comparison as PDF document
 */
export async function exportAsPDF(comparison: SavedComparison): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPage(needed: number) {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  }

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(comparison.name || "Untitled Comparison", margin, y);
  y += 10;

  // Metadata
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Created: ${new Date(comparison.createdAt).toLocaleString()}`,
    margin,
    y
  );
  y += 5;

  // Prompt
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Prompt", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const promptLines = doc.splitTextToSize(comparison.prompt, maxWidth);
  checkPage(promptLines.length * 5);
  doc.text(promptLines, margin, y);
  y += promptLines.length * 5 + 6;

  // Helper to render a panel section
  function renderPanel(
    label: string,
    output: SavedComparison["outputA"],
    annotations: LineAnnotation[]
  ) {
    checkPage(20);

    // Panel header
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    let headerText = label;
    if (output?.provenance) {
      const p = output.provenance;
      headerText += ` \u2014 ${p.modelDisplayName} (t=${p.temperature}, ${(p.responseTimeMs / 1000).toFixed(1)}s)`;
    }
    doc.text(headerText, margin, y);
    y += 4;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Output text
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    if (output?.text) {
      const textLines = doc.splitTextToSize(output.text, maxWidth);
      for (const line of textLines) {
        checkPage(5);
        doc.text(line, margin, y);
        y += 4.5;
      }
    } else if (output?.error) {
      doc.setTextColor(200, 0, 0);
      doc.text(`Error: ${output.error}`, margin, y);
      doc.setTextColor(30, 30, 30);
      y += 5;
    }
    y += 4;

    // Annotations
    if (annotations.length > 0) {
      checkPage(10);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Annotations", margin, y);
      y += 5;

      for (const ann of annotations) {
        checkPage(10);
        const prefix = ANNOTATION_PREFIXES[ann.type] ?? ann.type.toUpperCase();
        const lineRef = ann.endLineNumber
          ? `L${ann.lineNumber}-${ann.endLineNumber}`
          : `L${ann.lineNumber}`;
        const color = ANNOTATION_PDF_COLORS[ann.type] ?? [100, 100, 100];

        // Badge
        doc.setFillColor(color[0], color[1], color[2]);
        doc.roundedRect(margin, y - 3, 10, 4.5, 1, 1, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(prefix, margin + 1, y);

        // Line ref + content
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        const annText = `${lineRef}: ${ann.content}`;
        const annLines = doc.splitTextToSize(annText, maxWidth - 14);
        doc.text(annLines, margin + 13, y);
        y += annLines.length * 4 + 2;
      }
    }
    y += 8;
  }

  renderPanel("Panel A", comparison.outputA, comparison.annotationsA);
  renderPanel("Panel B", comparison.outputB, comparison.annotationsB);

  // Footer
  checkPage(10);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text("Exported from LLMbench", margin, y);

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
