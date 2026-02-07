"use client";

import { useState, useCallback } from "react";
import type { LineAnnotation, LineAnnotationType } from "@/types";
import type { InlineEditState } from "@/components/annotations/cm-annotations";

/**
 * Per-panel annotation state management for LLMbench
 * Simplified from CCS-WB useAnnotationsSync (no collaborative sync for MVP)
 */
export function useAnnotations(outputId: string) {
  const [annotations, setAnnotations] = useState<LineAnnotation[]>([]);
  const [editState, setEditState] = useState<InlineEditState>({
    lineNumber: null,
    annotationId: null,
    initialType: "observation",
    initialContent: "",
  });

  // Start creating a new annotation at a line
  const startAnnotation = useCallback(
    (startLine: number, endLine?: number) => {
      setEditState({
        lineNumber: endLine ?? startLine,
        startLineNumber: endLine ? startLine : undefined,
        annotationId: null,
        initialType: "observation",
        initialContent: "",
      });
    },
    []
  );

  // Start editing an existing annotation
  const startEditAnnotation = useCallback(
    (id: string) => {
      const ann = annotations.find((a) => a.id === id);
      if (!ann) return;
      setEditState({
        lineNumber: ann.endLineNumber ?? ann.lineNumber,
        startLineNumber: ann.endLineNumber ? ann.lineNumber : undefined,
        annotationId: id,
        initialType: ann.type,
        initialContent: ann.content,
      });
    },
    [annotations]
  );

  // Submit annotation (create or update)
  const submitAnnotation = useCallback(
    (type: LineAnnotationType, content: string) => {
      if (editState.annotationId) {
        // Update existing
        setAnnotations((prev) =>
          prev.map((a) =>
            a.id === editState.annotationId ? { ...a, type, content } : a
          )
        );
      } else if (editState.lineNumber) {
        // Create new
        const newAnnotation: LineAnnotation = {
          id: crypto.randomUUID(),
          outputId,
          lineNumber: editState.startLineNumber ?? editState.lineNumber,
          endLineNumber: editState.startLineNumber
            ? editState.lineNumber
            : undefined,
          lineContent: "",
          type,
          content,
          createdAt: new Date().toISOString(),
        };
        setAnnotations((prev) => [...prev, newAnnotation]);
      }
      // Clear edit state
      setEditState({
        lineNumber: null,
        annotationId: null,
        initialType: "observation",
        initialContent: "",
      });
    },
    [editState, outputId]
  );

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setEditState({
      lineNumber: null,
      annotationId: null,
      initialType: "observation",
      initialContent: "",
    });
  }, []);

  // Delete annotation
  const deleteAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Replace all annotations (for loading saved state)
  const setAllAnnotations = useCallback((anns: LineAnnotation[]) => {
    setAnnotations(anns);
  }, []);

  return {
    annotations,
    editState,
    startAnnotation,
    startEditAnnotation,
    submitAnnotation,
    cancelEdit,
    deleteAnnotation,
    setAllAnnotations,
  };
}
