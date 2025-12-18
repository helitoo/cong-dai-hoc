"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { getPost } from "@/lib/localStorage/post";

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

import EditorMenubar from "@/components/content-editor/editor-menubar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { CmtContent, CmtContentValidator } from "@/lib/types/forum/comment";
import { PostContent, PostContentValidator } from "@/lib/types/forum/post";

// Default post content

const defaultContent = `
<h1>
  Chào đằng ấy
</h1>
<p>
  Đây là một ví dụ <em>đơn giản</em> về cách sử dụng <strong>trình soạn thảo văn bản của Cổng đại học</strong>, dựa trên <em>TipTap</em>.
  Dĩ nhiên là nó hỗ trợ đủ các loại định dạng mà bạn có thể nghĩ ra. Nào, hãy đọc danh sách dưới đây trước:
</p>
<ul>
  <li>
    Đây là một danh sách <em>không có thứ tự</em>,
  </li>
  <li>
    Nó có <em>hai dòng</em>.
  </li>
</ul>
<p></P>
<p>
  <em>Thật tuyệt đúng không?</em> Tiếp theo, cùng xem qua <em>codeblock</em> này, nó hỗ trợ định dạng <strong>HTML, CSS, JS, Python, C/C++, SQL và Bash</strong> tự động!
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p></P>
<p>
  <em>Tốt!</em> Nhưng vẫn chưa hết đâu! Các bạn tự mình trải nghiệm các chức năng khác của trang này, hoặc ấn và nút (❓) để xem hướng dẫn chi tiết nha!
</p>
<blockquote>
  Wow, âmzing gud chóp 👏
  <br />
  — Cổng Đại học
</blockquote>
`;

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
  // Starter kit
  StarterKit,

  // Underline
  Underline,

  // Link
  Link.configure({
    HTMLAttributes: {
      class: "link",
    },
  }),

  // Text align
  TextAlign.configure({
    types: ["paragraph", "heading"],
    defaultAlignment: "justify",
  }),

  // Image
  Image,
  ImageResize,

  // Table
  TableKit,

  // Codeblock low light
  CodeBlockLowlight.configure({
    lowlight,
  }),

  // Math
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
  propContent = "",
  type = "post",
}: {
  propContent?: string;
  type?: "post" | "cmt";
}) {
  // Form init

  let form = null;
  if (type === "post")
    form = useForm<PostContent>({
      resolver: zodResolver(PostContentValidator),
      defaultValues: {
        content: defaultContent,
      },
    });
  else
    form = useForm<CmtContent>({
      resolver: zodResolver(CmtContentValidator),
      defaultValues: {
        content: "",
      },
    });

  // Titap editor init
  const editor = useEditor({
    extensions,
    content: "",
    immediatelyRender: false,
  });

  if (!editor) return <></>;

  // Content init
  useEffect(() => {
    if (!form || type !== "post") return;

    let temp = propContent;

    if (!temp) temp = getPost();
    if (!temp) temp = defaultContent;

    editor.commands.setContent(temp);
    form.setValue("content", temp);
  }, [editor]);

  // Content listener
  editor.on("update", () => {
    form.setValue("content", editor.getHTML(), { shouldValidate: true });
  });

  // Return component
  return (
    <div className="box p-0 flex flex-col">
      <EditorMenubar
        editor={editor}
        className="flex w-full items-center justify-center gap-1 shadow-md py-1"
      />
      <Form {...form}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <EditorContent
                  editor={editor}
                  spellCheck={false}
                  className="overflow-auto pt-4 pb-1 px-10 md:px-20"
                  style={{ height: "75vh" }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
}
