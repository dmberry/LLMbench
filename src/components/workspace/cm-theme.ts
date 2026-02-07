/**
 * CodeMirror theme for LLMbench
 * Adapted from CCS-WB cm-theme.ts
 * Stripped of syntax highlighting; configured for prose display
 * Uses CSS variables from globals.css for editorial design consistency
 */

import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";

// Light theme - editorial prose aesthetic
const proseLightTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "hsl(var(--card))",
      color: "hsl(var(--foreground))",
      height: "100%",
    },
    ".cm-scroller": {
      overflow: "auto",
    },
    ".cm-content": {
      fontFamily: "var(--font-source-serif), 'Source Serif 4', Georgia, 'Times New Roman', serif",
      caretColor: "hsl(var(--burgundy))",
      padding: "8px 0",
      lineHeight: "1.7",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "hsl(var(--burgundy))",
      borderLeftWidth: "2px",
    },
    ".cm-gutters": {
      backgroundColor: "hsl(var(--cream) / 0.3)",
      color: "hsl(var(--muted-foreground))",
      borderRight: "1px solid hsl(var(--parchment) / 0.5)",
      paddingRight: "8px",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 8px 0 16px",
      minWidth: "40px",
      textAlign: "right",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "hsl(var(--burgundy) / 0.1)",
    },
    ".cm-activeLine": {
      backgroundColor: "hsl(var(--cream) / 0.5)",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: "hsl(var(--burgundy) / 0.15)",
      },
    ".cm-selectionMatch": {
      backgroundColor: "hsl(var(--gold) / 0.2)",
    },
    ".cm-searchMatch": {
      backgroundColor: "hsl(var(--gold) / 0.3)",
      outline: "1px solid hsl(var(--gold) / 0.5)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "hsl(var(--gold) / 0.5)",
    },
    // Annotation widget styling
    ".cm-annotation-widget": {
      borderRight: "2px solid",
      backgroundColor: "transparent",
      padding: "2px 12px 2px var(--annotation-indent, 56px)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "var(--annotation-font-size, 11px)",
      width: "100%",
    },
    ".cm-annotation-bar": {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flex: "1",
      minWidth: "0",
      padding: "3px 10px 3px 6px",
      borderRadius: "4px",
      transition: "background-color 0.15s, opacity 0.15s",
      opacity: "var(--annotation-opacity, 0.6)",
    },
    ".cm-annotation-widget:hover .cm-annotation-bar": {
      opacity: "1 !important",
    },
    ".cm-annotation-type-badge": {
      fontFamily: "system-ui, sans-serif",
      fontSize: "9px",
      fontWeight: "600",
      padding: "1px 6px",
      borderRadius: "9px",
      whiteSpace: "nowrap",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
      flexShrink: "0",
      transition: "opacity 0.15s, transform 0.15s",
    },
    ".cm-annotation-content": {
      flex: "1",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontStyle: "italic",
      color: "hsl(var(--slate))",
      transition: "opacity 0.15s",
      wordWrap: "break-word",
      overflowWrap: "anywhere",
      minWidth: "0",
    },
    ".cm-annotation-actions": {
      display: "flex",
      gap: "4px",
      flexShrink: "0",
      opacity: "0.3",
      transition: "opacity 0.15s",
    },
    ".cm-annotation-widget:hover .cm-annotation-actions": {
      opacity: "1",
    },
    ".cm-annotation-btn": {
      padding: "1px 4px",
      fontSize: "8px",
      color: "hsl(var(--muted-foreground))",
      cursor: "pointer",
      border: "none",
      background: "none",
      textTransform: "lowercase",
    },
    ".cm-annotation-btn:hover": {
      color: "hsl(var(--foreground))",
    },
    ".cm-annotation-btn-delete:hover": {
      color: "hsl(0 80% 50%)",
    },
    // Inline annotation editor
    ".cm-annotation-editor": {
      alignItems: "center",
    },
    ".cm-annotation-type-container": {
      display: "flex",
      alignItems: "center",
      gap: "2px",
      flexShrink: "0",
    },
    ".cm-annotation-type-select": {
      fontFamily: "system-ui, sans-serif",
      fontSize: "10px",
      fontWeight: "600",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: "0 2px",
    },
    ".cm-annotation-type-select:focus": {
      outline: "none",
    },
    ".cm-annotation-input": {
      flex: "1",
      fontFamily: "system-ui, sans-serif",
      fontStyle: "italic",
      fontSize: "11px",
      color: "hsl(var(--slate))",
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "1px solid hsl(var(--parchment))",
      padding: "2px 4px",
      minWidth: "150px",
    },
    ".cm-annotation-input:focus": {
      outline: "none",
      borderBottomColor: "hsl(var(--burgundy) / 0.5)",
    },
    ".cm-annotation-input::placeholder": {
      color: "hsl(var(--muted-foreground))",
      fontStyle: "italic",
    },
    ".cm-annotation-btn-submit": {
      backgroundColor: "hsl(var(--burgundy))",
      color: "hsl(var(--ivory))",
      borderRadius: "2px",
      padding: "2px 6px",
    },
    ".cm-annotation-btn-submit:hover": {
      backgroundColor: "hsl(var(--burgundy) / 0.9)",
      color: "hsl(var(--ivory))",
    },
    ".cm-annotation-btn-submit:disabled": {
      opacity: "0.5",
      cursor: "not-allowed",
    },
    // Annotate gutter
    ".cm-annotate-gutter": {
      cursor: "pointer",
    },
    ".cm-annotate-gutter .cm-gutterElement": {
      padding: "0 8px 0 16px",
      minWidth: "40px",
      textAlign: "right",
    },
    ".cm-annotate-gutter-marker": {
      display: "inline-block",
      position: "relative",
    },
    ".cm-annotate-gutter-number": {
      display: "inline",
    },
    ".cm-annotate-gutter-plus": {
      display: "none",
      fontWeight: "bold",
      color: "hsl(var(--burgundy))",
    },
    ".cm-annotate-gutter .cm-gutterElement:hover .cm-annotate-gutter-number": {
      display: "none",
    },
    ".cm-annotate-gutter .cm-gutterElement:hover .cm-annotate-gutter-plus": {
      display: "inline",
    },
    ".cm-annotate-gutter .cm-gutterElement:hover": {
      backgroundColor: "hsl(var(--burgundy) / 0.15)",
    },
    // Dimmed lines
    ".cm-line-dimmed": {
      opacity: "0.12",
      transition: "opacity 0.15s",
    },
    ".cm-line-dimmed:hover": {
      opacity: "0.4",
    },
  },
  { dark: false }
);

// Dark theme variant
const proseDarkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "hsl(var(--card))",
      color: "hsl(var(--foreground))",
      height: "100%",
    },
    ".cm-scroller": {
      overflow: "auto",
    },
    ".cm-content": {
      fontFamily: "var(--font-source-serif), 'Source Serif 4', Georgia, 'Times New Roman', serif",
      caretColor: "hsl(var(--burgundy))",
      padding: "8px 0",
      lineHeight: "1.7",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "hsl(var(--burgundy))",
      borderLeftWidth: "2px",
    },
    ".cm-gutters": {
      backgroundColor: "hsl(var(--cream) / 0.3)",
      color: "hsl(var(--muted-foreground))",
      borderRight: "1px solid hsl(var(--parchment) / 0.5)",
      paddingRight: "8px",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 8px 0 16px",
      minWidth: "40px",
      textAlign: "right",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "hsl(var(--burgundy) / 0.15)",
    },
    ".cm-activeLine": {
      backgroundColor: "hsl(var(--cream) / 0.3)",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: "hsl(var(--burgundy) / 0.25)",
      },
    ".cm-selectionMatch": {
      backgroundColor: "hsl(var(--gold) / 0.25)",
    },
    ".cm-searchMatch": {
      backgroundColor: "hsl(var(--gold) / 0.3)",
      outline: "1px solid hsl(var(--gold) / 0.5)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "hsl(var(--gold) / 0.5)",
    },
    // Annotation styling (same as light but with dark mode adjustments)
    ".cm-annotation-widget": {
      borderRight: "2px solid",
      backgroundColor: "transparent",
      padding: "2px 12px 2px var(--annotation-indent, 56px)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "var(--annotation-font-size, 11px)",
      width: "100%",
    },
    ".cm-annotation-bar": {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flex: "1",
      minWidth: "0",
      padding: "3px 10px 3px 6px",
      borderRadius: "4px",
      transition: "background-color 0.15s, opacity 0.15s",
      opacity: "var(--annotation-opacity, 0.6)",
    },
    ".cm-annotation-widget:hover .cm-annotation-bar": {
      opacity: "1 !important",
    },
    ".cm-annotation-type-badge": {
      fontFamily: "system-ui, sans-serif",
      fontSize: "9px",
      fontWeight: "600",
      padding: "1px 6px",
      borderRadius: "9px",
      whiteSpace: "nowrap",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
      flexShrink: "0",
      transition: "opacity 0.15s, transform 0.15s",
    },
    ".cm-annotation-content": {
      flex: "1",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontStyle: "italic",
      color: "hsl(var(--slate))",
      transition: "opacity 0.15s",
      wordWrap: "break-word",
      overflowWrap: "anywhere",
      minWidth: "0",
    },
    ".cm-annotation-actions": {
      display: "flex",
      gap: "4px",
      flexShrink: "0",
      opacity: "0.3",
      transition: "opacity 0.15s",
    },
    ".cm-annotation-widget:hover .cm-annotation-actions": {
      opacity: "1",
    },
    ".cm-annotation-btn": {
      padding: "1px 4px",
      fontSize: "8px",
      color: "hsl(var(--muted-foreground))",
      cursor: "pointer",
      border: "none",
      background: "none",
      textTransform: "lowercase",
    },
    ".cm-annotation-btn:hover": {
      color: "hsl(var(--foreground))",
    },
    ".cm-annotation-btn-delete:hover": {
      color: "hsl(0 60% 60%)",
    },
    ".cm-annotation-editor": {
      alignItems: "center",
    },
    ".cm-annotation-type-container": {
      display: "flex",
      alignItems: "center",
      gap: "2px",
      flexShrink: "0",
    },
    ".cm-annotation-type-select": {
      fontFamily: "system-ui, sans-serif",
      fontSize: "10px",
      fontWeight: "600",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: "0 2px",
    },
    ".cm-annotation-type-select:focus": {
      outline: "none",
    },
    ".cm-annotation-input": {
      flex: "1",
      fontFamily: "system-ui, sans-serif",
      fontStyle: "italic",
      fontSize: "11px",
      color: "hsl(var(--slate))",
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "1px solid hsl(var(--parchment) / 0.3)",
      padding: "2px 4px",
      minWidth: "150px",
    },
    ".cm-annotation-input:focus": {
      outline: "none",
      borderBottomColor: "hsl(var(--burgundy) / 0.5)",
    },
    ".cm-annotation-input::placeholder": {
      color: "hsl(var(--muted-foreground))",
      fontStyle: "italic",
    },
    ".cm-annotation-btn-submit": {
      backgroundColor: "hsl(var(--burgundy))",
      color: "hsl(var(--ivory))",
      borderRadius: "2px",
      padding: "2px 6px",
    },
    ".cm-annotation-btn-submit:hover": {
      backgroundColor: "hsl(var(--burgundy) / 0.9)",
      color: "hsl(var(--ivory))",
    },
    ".cm-annotation-btn-submit:disabled": {
      opacity: "0.5",
      cursor: "not-allowed",
    },
    // Annotate gutter
    ".cm-annotate-gutter": {
      cursor: "pointer",
    },
    ".cm-annotate-gutter .cm-gutterElement": {
      padding: "0 8px 0 16px",
      minWidth: "40px",
      textAlign: "right",
    },
    ".cm-annotate-gutter-marker": {
      display: "inline-block",
      position: "relative",
    },
    ".cm-annotate-gutter-number": {
      display: "inline",
    },
    ".cm-annotate-gutter-plus": {
      display: "none",
      fontWeight: "bold",
      color: "hsl(var(--burgundy))",
    },
    ".cm-annotate-gutter .cm-gutterElement:hover .cm-annotate-gutter-number": {
      display: "none",
    },
    ".cm-annotate-gutter .cm-gutterElement:hover .cm-annotate-gutter-plus": {
      display: "inline",
    },
    ".cm-annotate-gutter .cm-gutterElement:hover": {
      backgroundColor: "hsl(var(--burgundy) / 0.2)",
    },
    // Dimmed lines
    ".cm-line-dimmed": {
      opacity: "0.10",
      transition: "opacity 0.15s",
    },
    ".cm-line-dimmed:hover": {
      opacity: "0.35",
    },
  },
  { dark: true }
);

/**
 * Get the prose theme extension for CodeMirror
 */
export function getProseTheme(isDark: boolean): Extension {
  return isDark ? proseDarkTheme : proseLightTheme;
}

/**
 * Get font size theme extension
 */
export function getFontSizeTheme(fontSize: number): Extension {
  return EditorView.theme({
    "&": {
      fontSize: `${fontSize}px`,
    },
    ".cm-gutters": {
      fontSize: `${fontSize}px`,
    },
    ".cm-content": {
      lineHeight: "1.7",
    },
  });
}

// ---------- font family options ----------

export const FONT_OPTIONS = [
  { id: "source-serif" as const, label: "Source Serif 4", css: "var(--font-source-serif), 'Source Serif 4', Georgia, serif" },
  { id: "libre-baskerville" as const, label: "Libre Baskerville", css: "var(--font-libre-baskerville), 'Libre Baskerville', Georgia, serif" },
  { id: "inter" as const, label: "Inter", css: "var(--font-inter), 'Inter', system-ui, sans-serif" },
  { id: "system" as const, label: "System Default", css: "system-ui, -apple-system, sans-serif" },
] as const;

export type FontOptionId = (typeof FONT_OPTIONS)[number]["id"];

export function getFontCss(id: FontOptionId): string {
  return FONT_OPTIONS.find((f) => f.id === id)?.css ?? FONT_OPTIONS[0].css;
}

/**
 * Get font family theme extension for prose and annotation fonts
 */
export function getFontFamilyTheme(
  proseFamilyCss: string,
  annotationFamilyCss: string,
  annotationFontSize: number = 11,
): Extension {
  return EditorView.theme({
    ".cm-content": {
      fontFamily: proseFamilyCss,
    },
    ".cm-annotation-content": {
      fontFamily: annotationFamilyCss,
    },
    ".cm-annotation-widget": {
      fontSize: `${annotationFontSize}px`,
    },
    ".cm-annotation-input": {
      fontSize: `${annotationFontSize}px`,
    },
  });
}
