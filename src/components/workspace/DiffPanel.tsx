"use client";

import { useMemo } from "react";
import type { DiffSegment } from "@/lib/diff/word-diff";

type LineSegment = { text: string; type: DiffSegment["type"] };
type Line = LineSegment[];

/**
 * Split an array of diff segments into lines.
 * Each segment may contain newlines; this splits them so each Line
 * represents one visual line of text.
 */
function segmentsToLines(segments: DiffSegment[]): Line[] {
  const lines: Line[] = [[]];

  for (const seg of segments) {
    const parts = seg.text.split("\n");
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        // Start a new line
        lines.push([]);
      }
      if (parts[i].length > 0) {
        lines[lines.length - 1].push({ text: parts[i], type: seg.type });
      }
    }
  }

  return lines;
}

function SegmentSpan({ segment }: { segment: LineSegment }) {
  if (segment.type === "common") {
    return <span>{segment.text}</span>;
  }
  if (segment.type === "removed") {
    return (
      <span className="bg-red-200/60 dark:bg-red-800/40 text-red-900 dark:text-red-200 rounded-sm px-px">
        {segment.text}
      </span>
    );
  }
  // added
  return (
    <span className="bg-green-200/60 dark:bg-green-800/40 text-green-900 dark:text-green-200 rounded-sm px-px">
      {segment.text}
    </span>
  );
}

export function DiffRenderedText({
  segments,
  fontSize,
  fontFamily,
}: {
  segments: DiffSegment[];
  fontSize: number;
  fontFamily: string;
}) {
  const lines = useMemo(() => segmentsToLines(segments), [segments]);
  const gutterWidth = String(lines.length).length;

  return (
    <div
      className="leading-relaxed"
      style={{ fontSize: `${fontSize}px`, fontFamily }}
    >
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span
            className="shrink-0 select-none text-right pr-3 pl-2 text-muted-foreground/50"
            style={{
              minWidth: `${gutterWidth + 2}ch`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: `${fontSize - 1}px`,
            }}
          >
            {i + 1}
          </span>
          <span className="whitespace-pre-wrap flex-1 pr-4">
            {line.length === 0 ? "\u200B" : line.map((seg, j) => (
              <SegmentSpan key={j} segment={seg} />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
