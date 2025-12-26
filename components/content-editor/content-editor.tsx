"use client";

import { X } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";

// Tiptap extensions

import StarterKit from "@tiptap/starter-kit";

import Underline from "@tiptap/extension-underline";

import Link from "@tiptap/extension-link";

import TextAlign from "@tiptap/extension-text-align";

import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";

import Mathematics from "@tiptap/extension-mathematics";
import "katex/dist/katex.min.css";

import { TableKit } from "@tiptap/extension-table";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import bash from "highlight.js/lib/languages/bash";
import cpp from "highlight.js/lib/languages/cpp";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import html from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github.css";
import { createLowlight } from "lowlight";

import { Button } from "@/components/ui/button";
import EditorMenubar from "@/components/content-editor/editor-menubar";
import ContentConfirmation from "@/components/content-editor/content-confirmation";
import type { ContentEditorProps } from "@/components/editor-store";

// Default tiptap extension

const lowlight = createLowlight();
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", javascript);
lowlight.register("cpp", cpp);
lowlight.register("py", python);
lowlight.register("sql", sql);
lowlight.register("sh", bash);

const extensions = [
  StarterKit,
  Underline,
  Link.configure({
    HTMLAttributes: {
      class: "link",
    },
  }),
  TextAlign.configure({
    types: ["paragraph", "heading"],
    defaultAlignment: "justify",
  }),
  Image,
  ImageResize,
  TableKit,
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Mathematics.configure({
    inlineOptions: {
      onClick: (node: any, pos: number) => {
        const katex = prompt("Sửa công thức:", node.attrs.latex);
        if (katex && (window as any).__editor) {
          const e = (window as any).__editor;
          e.chain()
            .setNodeSelection(pos)
            .updateInlineMath({ latex: katex })
            .focus()
            .run();
        }
      },
    },
    blockOptions: {
      onClick: (node: any, pos: number) => {
        const katex = prompt("Sửa công thức:", node.attrs.latex);
        if (katex && (window as any).__editor) {
          const e = (window as any).__editor;
          e.chain()
            .setNodeSelection(pos)
            .updateBlockMath({ latex: katex })
            .focus()
            .run();
        }
      },
    },
  }),
  //
];

export default function ContentEditor({
  authorId,
  defaultPid,
  defaultTitle,
  acceptTitling,
  acceptPublicing,
  acceptPinning,
  acceptReferencing,
  topicId,
  refPostId,
  limitContentLength,
  defaultContent,
  closeEditorHandler,
}: ContentEditorProps & { closeEditorHandler: () => void }) {
  // Titap editor init
  const editor = useEditor({
    extensions,
    content: defaultContent,
    immediatelyRender: false,
  });

  if (!editor) return <></>;

  // Return component
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex w-full items-center justify-center py-1 shrink-0 border-b">
        <EditorMenubar editor={editor} />

        <ContentConfirmation
          authorId={authorId}
          defaultPid={defaultPid}
          defaultTitle={defaultTitle}
          acceptTitling={acceptTitling}
          acceptPublicing={acceptPublicing}
          acceptPinning={acceptPinning}
          acceptReferencing={acceptReferencing}
          topicId={topicId}
          refPostId={refPostId}
          limitContentLength={limitContentLength}
          content={editor.getHTML()}
        />

        <Button size="icon" variant="ghost" onClick={closeEditorHandler}>
          <X className="size-5 text-red-500" />
        </Button>
      </div>

      <EditorContent
        editor={editor}
        spellCheck={false}
        className="flex-1 min-h-0 overflow-y-scroll pt-4 pb-1 px-10 md:px-20 mb-10 border-b"
      />
    </div>
  );
}
