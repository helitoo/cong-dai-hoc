"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Tiptap extensions

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Mathematics from "@tiptap/extension-mathematics";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import "katex/dist/katex.min.css";
import ImageResize from "tiptap-extension-resize-image";

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

import ContentConfirmation from "@/components/content-editor/content-confirmation";
import EditorMenubar from "@/components/content-editor/editor-menubar";
import type { ContentEditorProps } from "@/components/editor-store";
import { Button } from "@/components/ui/button";

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

export const EditorConfirmationSchema = z.object({
  title: z.string().optional(),
  author_id: z.string(),
  is_public: z.boolean(),
  is_pinned: z.boolean(),
  accecpt_ref: z.boolean(),
  content: z.string().min(1),
});

export type EditorConfirmation = z.infer<typeof EditorConfirmationSchema>;

// Component
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
  const form = useForm<EditorConfirmation>({
    resolver: zodResolver(EditorConfirmationSchema),
    defaultValues: {
      title: defaultTitle,
      author_id: authorId,
      is_public: acceptPublicing,
      is_pinned: acceptPinning,
      accecpt_ref: acceptReferencing,
      content: defaultContent,
    },
  });

  // Titap editor init
  const editor = useEditor({
    extensions,
    content: defaultContent,
    immediatelyRender: false,
    onUpdate({ editor }) {
      form.setValue("content", editor.getHTML(), {
        shouldValidate: true,
      });
    },
  });

  // Return component
  return (
    <>
      {topicId && editor && (
        <div className="w-full h-full flex flex-col">
          <div className="flex w-full items-center justify-center py-1 shrink-0 border-b">
            <EditorMenubar editor={editor} />

            <ContentConfirmation
              form={form}
              defaultPid={defaultPid}
              acceptTitling={acceptTitling}
              acceptPublicing={acceptPublicing}
              acceptPinning={acceptPinning}
              acceptReferencing={acceptReferencing}
              refPostId={refPostId}
              topicId={topicId}
              limitContentLength={limitContentLength}
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
      )}
    </>
  );
}
