"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useEditorStore } from "@/components/editor-store";
import ContentEditor from "@/components/content-editor/content-editor";

export default function FloatingEditor() {
  const { open, payload, closeEditor } = useEditorStore();

  const [height, setHeight] = useState(300);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startY.current = e.clientY;
    startHeight.current = height;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const delta = startY.current - e.clientY;
    setHeight(
      Math.min(
        Math.max(100, startHeight.current + delta),
        window.innerHeight * 0.9
      )
    );
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  if (!open || !payload) return null;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 bottom-0 z-50 bg-background border-t shadow-xl transition-transform duration-300",
        open ? "translate-y-0" : "translate-y-full"
      )}
      style={{ height }}
    >
      {/* Drag handle */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="h-4 cursor-ns-resize flex justify-center items-center touch-none"
      >
        <div className="h-1.5 w-12 rounded-full bg-muted" />
      </div>

      <ContentEditor {...payload} closeEditorHandler={closeEditor} />
    </div>
  );
}
