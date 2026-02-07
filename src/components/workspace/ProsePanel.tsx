"use client";

/**
 * ProsePanel - CodeMirror 6 wrapper for LLM output display
 *
 * Adapted from CCS-WB CodeMirrorEditor.tsx
 * Stripped: syntax highlighting, language loading, edit mode, font selection
 * Added: prose-optimised theme, always read-only, serif font, annotation support
 *
 * Displaying LLM prose in a code-style editor creates productive
 * defamiliarisation, making the text look less like natural language
 * and more like an object of analysis. The annotation infrastructure
 * (inline widgets, gutter markers, colour-coded badges) works without modification.
 */

import { useEffect, useRef, useMemo, useCallback } from "react";
import { EditorState, Compartment, Extension } from "@codemirror/state";
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  keymap,
} from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import {
  search,
  searchKeymap,
  highlightSelectionMatches,
} from "@codemirror/search";
import { getProseTheme, getFontSizeTheme, getFontFamilyTheme } from "./cm-theme";
import type { LineAnnotation, LineAnnotationType } from "@/types";
import {
  createSimpleAnnotationsExtension,
  createAnnotateGutter,
  createSubtleAnnotationHighlightExtension,
  createHighlightAnnotatedLinesExtension,
  type InlineEditState,
  type InlineEditCallbacks,
  type AnnotationDisplaySettings,
  DEFAULT_ANNOTATION_DISPLAY_SETTINGS,
} from "@/components/annotations/cm-annotations";

export interface ProsePanelProps {
  /** The text content to display (always read-only) */
  value: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Whether dark mode is active */
  isDark?: boolean;
  /** CSS class for the container */
  className?: string;
  /** Callback when scroll position changes */
  onScroll?: (scrollTop: number) => void;
  /** Ref to expose the EditorView for external scroll syncing */
  viewRef?: React.MutableRefObject<EditorView | null>;
  // Annotation props
  annotations?: LineAnnotation[];
  onLineClick?: (startLine: number, endLine?: number) => void;
  onEditAnnotation?: (id: string) => void;
  onDeleteAnnotation?: (id: string) => void;
  inlineEditState?: InlineEditState;
  inlineEditCallbacks?: InlineEditCallbacks;
  annotationDisplaySettings?: AnnotationDisplaySettings;
  /** CSS font-family string for prose content */
  proseFontFamily?: string;
  /** CSS font-family string for annotation content */
  annotationFontFamily?: string;
  /** Font size in px for annotations */
  annotationFontSize?: number;
}

export function ProsePanel({
  value,
  fontSize = 14,
  isDark = false,
  className,
  onScroll,
  viewRef: externalViewRef,
  annotations = [],
  onLineClick,
  onEditAnnotation,
  onDeleteAnnotation,
  inlineEditState,
  inlineEditCallbacks,
  annotationDisplaySettings,
  proseFontFamily,
  annotationFontFamily,
  annotationFontSize,
}: ProsePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalViewRef = useRef<EditorView | null>(null);
  const lastValueRef = useRef(value);
  const isInitialMount = useRef(true);

  // Compartments for dynamic reconfiguration
  const themeCompartment = useRef(new Compartment());
  const fontSizeCompartment = useRef(new Compartment());
  const annotationsCompartment = useRef(new Compartment());
  const gutterCompartment = useRef(new Compartment());
  const lineHighlightsCompartment = useRef(new Compartment());
  const fontFamilyCompartment = useRef(new Compartment());

  const settings = annotationDisplaySettings ?? DEFAULT_ANNOTATION_DISPLAY_SETTINGS;

  const onScrollRef = useRef(onScroll);
  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  // Stable callbacks
  const stableOnEdit = useCallback(
    (id: string) => onEditAnnotation?.(id),
    [onEditAnnotation]
  );
  const stableOnDelete = useCallback(
    (id: string) => onDeleteAnnotation?.(id),
    [onDeleteAnnotation]
  );
  const stableOnLineClick = useCallback(
    (startLine: number, endLine?: number) => onLineClick?.(startLine, endLine),
    [onLineClick]
  );

  // Base extensions (static)
  const baseExtensions = useMemo(
    (): Extension[] => [
      highlightActiveLine(),
      highlightActiveLineGutter(),
      drawSelection(),
      search({ top: true }),
      highlightSelectionMatches(),
      keymap.of([...defaultKeymap, ...searchKeymap]),
      EditorView.lineWrapping,
      EditorState.readOnly.of(true),
    ],
    []
  );

  // Initialize editor
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const extensions: Extension[] = [
      ...baseExtensions,
      gutterCompartment.current.of(
        onLineClick
          ? createAnnotateGutter(stableOnLineClick)
          : []
      ),
      themeCompartment.current.of(getProseTheme(isDark)),
      fontSizeCompartment.current.of(getFontSizeTheme(fontSize)),
      annotationsCompartment.current.of(
        createSimpleAnnotationsExtension(
          annotations,
          stableOnEdit,
          stableOnDelete,
          isDark,
          inlineEditState,
          inlineEditCallbacks,
          undefined, // highlightedType
          settings
        )
      ),
      lineHighlightsCompartment.current.of(
        settings.lineHighlightIntensity !== "off"
          ? createSubtleAnnotationHighlightExtension(
              annotations,
              isDark,
              settings.lineHighlightIntensity
            )
          : settings.highlightAnnotatedLines
            ? createHighlightAnnotatedLinesExtension(annotations, true, isDark)
            : []
      ),
      fontFamilyCompartment.current.of(
        getFontFamilyTheme(
          proseFontFamily ?? "var(--font-source-serif), 'Source Serif 4', Georgia, serif",
          annotationFontFamily ?? "system-ui, -apple-system, sans-serif",
          annotationFontSize ?? 11
        )
      ),
      EditorView.domEventHandlers({
        scroll(_event, view) {
          if (onScrollRef.current) {
            onScrollRef.current(view.scrollDOM.scrollTop);
          }
          return false;
        },
      }),
    ];

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    internalViewRef.current = view;
    if (externalViewRef) externalViewRef.current = view;
    lastValueRef.current = value;
    isInitialMount.current = false;

    return () => {
      view.destroy();
      internalViewRef.current = null;
      if (externalViewRef) externalViewRef.current = null;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update value when prop changes
  useEffect(() => {
    const view = internalViewRef.current;
    if (!view || isInitialMount.current) return;

    if (value !== lastValueRef.current) {
      const currentValue = view.state.doc.toString();
      if (value !== currentValue) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: value },
        });
        lastValueRef.current = value;
      }
    }
  }, [value]);

  // Update theme
  useEffect(() => {
    if (isInitialMount.current) return;
    internalViewRef.current?.dispatch({
      effects: themeCompartment.current.reconfigure(getProseTheme(isDark)),
    });
  }, [isDark]);

  // Update font size
  useEffect(() => {
    if (isInitialMount.current) return;
    internalViewRef.current?.dispatch({
      effects: fontSizeCompartment.current.reconfigure(
        getFontSizeTheme(fontSize)
      ),
    });
  }, [fontSize]);

  // Update annotations + line highlights
  useEffect(() => {
    if (isInitialMount.current) return;
    internalViewRef.current?.dispatch({
      effects: [
        annotationsCompartment.current.reconfigure(
          createSimpleAnnotationsExtension(
            annotations,
            stableOnEdit,
            stableOnDelete,
            isDark,
            inlineEditState,
            inlineEditCallbacks,
            undefined, // highlightedType
            settings
          )
        ),
        lineHighlightsCompartment.current.reconfigure(
          settings.lineHighlightIntensity !== "off"
            ? createSubtleAnnotationHighlightExtension(
                annotations,
                isDark,
                settings.lineHighlightIntensity
              )
            : settings.highlightAnnotatedLines
              ? createHighlightAnnotatedLinesExtension(annotations, true, isDark)
              : []
        ),
      ],
    });
  }, [
    annotations,
    stableOnEdit,
    stableOnDelete,
    isDark,
    inlineEditState,
    inlineEditCallbacks,
    settings,
  ]);

  // Update gutter when onLineClick changes
  useEffect(() => {
    if (isInitialMount.current) return;
    internalViewRef.current?.dispatch({
      effects: gutterCompartment.current.reconfigure(
        onLineClick
          ? createAnnotateGutter(stableOnLineClick)
          : []
      ),
    });
  }, [onLineClick, stableOnLineClick]);

  // Update font families and annotation font size
  useEffect(() => {
    if (isInitialMount.current) return;
    internalViewRef.current?.dispatch({
      effects: fontFamilyCompartment.current.reconfigure(
        getFontFamilyTheme(
          proseFontFamily ?? "var(--font-source-serif), 'Source Serif 4', Georgia, serif",
          annotationFontFamily ?? "system-ui, -apple-system, sans-serif",
          annotationFontSize ?? 11
        )
      ),
    });
  }, [proseFontFamily, annotationFontFamily, annotationFontSize]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: "100%", width: "100%", overflow: "auto" }}
    />
  );
}
