"use client";

import {
  Undo,
  Redo,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Bold,
  Italic,
  Underline,
  Link,
  TextAlignStart,
  TextAlignJustify,
  TextAlignCenter,
  TextAlignEnd,
  ListOrdered,
  List,
  Logs,
  MessageSquareMore,
  Code,
  MessageSquareCode,
  MessageSquareQuote,
  Import,
  Sigma,
  Image,
  Minus,
  Grid3X3,
  ArrowUpToLine,
  ArrowDownToLine,
  ArrowLeftToLine,
  ArrowRightToLine,
  TableColumnsSplit,
  TableRowsSplit,
  Table2,
  TableCellsMerge,
  TableCellsSplit,
  Send,
  X,
  SigmaSquare,
  CircleQuestionMark,
  CircleEllipsis,
} from "lucide-react";

import { setPost } from "@/lib/localStorage/post";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Note from "@/components/note";

import DropdownTriggerBtn from "@/components/dropdown-trigger-button";

import {
  toggleLink,
  insertBlockMath,
  insertInlineMath,
  insertImage,
} from "@/components/content-editor/tiptap-commands";

import { useTableSidebar } from "@/components/content-editor/table-listener";
import PostConfirmation from "@/components/content-editor/post-confirmation";
import CmtConfirmation from "@/components/content-editor/cmt-confirmation";

// Component
export default function EditorMenubar({
  editor,
  className = "",
  type = "post",
}: {
  editor: Editor;
  className?: string;
  type?: "post" | "cmt";
}) {
  const router = useRouter();

  // Editor states

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      canUndo: ctx.editor.can().chain().undo().run() ?? false,
      canRedo: ctx.editor.can().chain().redo().run() ?? false,

      isParagraph: ctx.editor.isActive("paragraph") ?? false,
      isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
      isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
      isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
      isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,

      isBold: ctx.editor.isActive("bold") ?? false,
      isItalic: ctx.editor.isActive("italic") ?? false,
      isUnderline: ctx.editor.isActive("underline") ?? false,
      isLink: ctx.editor.isActive("link") ?? false,

      isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
      isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
      isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
      isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }),

      isBulletList: ctx.editor.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor.isActive("orderedList") ?? false,

      isCode: ctx.editor.isActive("code") ?? false,
      isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
      isBlockquote: ctx.editor.isActive("blockquote") ?? false,
    }),
  });

  // For table commands

  const { isOpenTable } = useTableSidebar(editor);

  // Commands list

  type CmdNode = {
    renderWhen?: boolean;
    stateField?: keyof typeof state;
    onClick?: () => void;
    icon?: ReactNode;
    label?: ReactNode;
    tooltip?: string;
    subNodes?: CmdNode[];
  };

  const normalCmdNodes: CmdNode[] = [
    {
      icon: <Pilcrow className="button-icon" />,
      subNodes: [
        {
          stateField: "isParagraph",
          onClick: () => editor.chain().focus().setParagraph().run(),
          icon: <Pilcrow className="button-icon" />,
          label: <>Thường</>,
        },
        {
          stateField: "isHeading1",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          icon: <Heading1 className="button-icon" />,
          label: <>Tiêu đề cấp 1</>,
        },
        {
          stateField: "isHeading2",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          icon: <Heading2 className="button-icon" />,
          label: <>Tiêu đề cấp 2</>,
        },
        {
          stateField: "isHeading3",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          icon: <Heading3 className="button-icon" />,
          label: <>Tiêu đề cấp 3</>,
        },
        {
          stateField: "isHeading4",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 4 }).run(),
          icon: <Heading4 className="button-icon" />,
          label: <>Tiêu đề cấp 4</>,
        },
      ],
    },
    {
      stateField: "isBold",
      onClick: () => editor.chain().focus().toggleBold().run(),
      icon: <Bold className="button-icon" />,
    },
    {
      stateField: "isItalic",
      onClick: () => editor.chain().focus().toggleItalic().run(),
      icon: <Italic className="button-icon" />,
    },
    {
      stateField: "isUnderline",
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      icon: <Underline className="button-icon" />,
    },
    {
      stateField: "isLink",
      onClick: () => toggleLink(editor, state.isLink),
      icon: <Link className="button-icon" />,
    },
    {
      icon: <TextAlignStart className="button-icon" />,
      subNodes: [
        {
          stateField: "isAlignJustify",
          onClick: () => editor.chain().focus().setTextAlign("justify").run(),
          icon: <TextAlignJustify className="button-icon" />,
          label: <>Căn đều</>,
        },
        {
          stateField: "isAlignCenter",
          onClick: () => editor.chain().focus().setTextAlign("center").run(),
          icon: <TextAlignCenter className="button-icon" />,
          label: <>Căn giữa</>,
        },
        {
          stateField: "isAlignRight",
          onClick: () => editor.chain().focus().setTextAlign("right").run(),
          icon: <TextAlignEnd className="button-icon" />,
          label: <>Căn phải</>,
        },
      ],
    },
    {
      icon: <Logs className="button-icon" />,
      subNodes: [
        {
          stateField: "isOrderedList",
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          icon: <ListOrdered className="button-icon" />,
          label: <>DS có thứ tự</>,
        },
        {
          stateField: "isBulletList",
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          icon: <List className="button-icon" />,
          label: <>DS ko thứ tự</>,
        },
      ],
    },
    {
      icon: <MessageSquareMore className="button-icon" />,
      subNodes: [
        {
          stateField: "isCode",
          onClick: () => editor.chain().focus().toggleCodeBlock().run(),
          icon: <Code className="button-icon" />,
          label: (
            <>
              Dòng code
              <Note content="Code được chèn trong dòng chung với các ký tự khác" />
            </>
          ),
        },
        {
          stateField: "isCodeBlock",
          onClick: () => editor.chain().focus().toggleCodeBlock().run(),
          icon: <MessageSquareCode className="button-icon" />,
          label: (
            <>
              Khối code
              <Note content="Code được chèn độc 1 dòng riêng" />
            </>
          ),
        },
        {
          stateField: "isBlockquote",
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          icon: <MessageSquareQuote className="button-icon" />,
          label: <>Khối trích dẫn</>,
        },
      ],
    },
    {
      icon: <Import className="button-icon" />,
      subNodes: [
        {
          onClick: () => insertInlineMath(editor),
          icon: <Sigma className="button-icon" />,
          label: (
            <>
              Dòng Công thức
              <Note content="CT được chèn trong dòng chung với các ký tự khác" />
            </>
          ),
        },
        {
          onClick: () => insertBlockMath(editor),
          icon: <SigmaSquare className="button-icon" />,
          label: (
            <>
              Khối Công thức
              <Note content="CT được chèn độc 1 dòng riêng" />
            </>
          ),
        },
        {
          onClick: () => insertImage(editor),
          icon: <Image className="button-icon" />,
          label: <>Hình ảnh</>,
        },
        {
          onClick: () =>
            editor.commands.insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: false,
            }),
          icon: <Grid3X3 className="button-icon" />,
          label: <>Bảng</>,
        },
        {
          onClick: () => editor.chain().focus().setHorizontalRule().run(),
          icon: <Minus className="button-icon" />,
          label: <>Nét gạch ngang</>,
        },
      ],
    },
    {
      renderWhen: isOpenTable,
      icon: <Grid3X3 className="button-icon" />,
      subNodes: [
        {
          onClick: () => editor.commands.addColumnBefore(),
          icon: <ArrowRightToLine className="button-icon" />,
          label: <>Thêm cột b.trái</>,
        },
        {
          onClick: () => editor.commands.addColumnAfter(),
          icon: <ArrowLeftToLine className="button-icon" />,
          label: <>Thêm cột b.phải</>,
        },
        {
          onClick: () => editor.commands.deleteColumn(),
          icon: <TableColumnsSplit className="button-icon" />,
          label: <>Xóa cột</>,
        },
        {
          onClick: () => editor.commands.addRowBefore(),
          icon: <ArrowDownToLine className="button-icon" />,
          label: <>Thêm hàng b.trên</>,
        },
        {
          onClick: () => editor.commands.addRowAfter(),
          icon: <ArrowUpToLine className="button-icon" />,
          label: <>Thêm hàng b.dưới</>,
        },
        {
          onClick: () => editor.commands.deleteRow(),
          icon: <TableRowsSplit className="button-icon" />,
          label: <>Xóa hàng</>,
        },
        {
          onClick: () => editor.commands.mergeCells(),
          icon: <TableCellsMerge className="button-icon" />,
          label: <>Gộp ô</>,
        },
        {
          onClick: () => editor.commands.splitCell(),
          icon: <TableCellsSplit className="button-icon" />,
          label: <>Tách ô</>,
        },
        {
          onClick: () => editor.commands.toggleHeaderCell(),
          icon: <Table2 className="button-icon" />,
          label: <>Tô màu ô</>,
        },
      ],
    },
    {
      icon: <CircleEllipsis className="button-icon" />,
      subNodes: [
        {
          onClick: () => {
            setPost(editor.getHTML());
            router.back();
          },
          icon: <X className="button-icon text-red-500!" />,
          label: (
            <>
              Lưu & Đóng
              <Note content="Nội dung hiện tại sẽ ghi đè các nội dung được lưu trước đó!" />
            </>
          ),
        },
        {
          onClick: () => {},
          icon: <CircleQuestionMark className="button-icon" />,
          label: <>Hướng dẫn</>,
        },
      ],
    },
  ];

  // Commands list generator

  const cmdListGenerator = (nodes: CmdNode[]) => {
    return nodes.map((node, i) => {
      if (node.subNodes) {
        // Get the first icon which is activated, else, get it's parent's icon
        const activeSubNode =
          node.subNodes.find((sn) => sn.stateField && state[sn.stateField]) ||
          node;

        return (
          <DropdownMenu key={i}>
            <DropdownMenuTrigger asChild>
              <DropdownTriggerBtn variant="ghost" size="icon">
                {activeSubNode.icon}
              </DropdownTriggerBtn>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {node.subNodes.map((sub, j) => (
                <DropdownMenuItem
                  key={j}
                  className={
                    sub.stateField && state[sub.stateField] ? "bg-accent" : ""
                  }
                  onClick={sub.onClick ? () => sub.onClick!() : undefined}
                >
                  {sub.icon} {sub.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      } else
        return (
          <Button
            key={i}
            variant="ghost"
            size="icon"
            onClick={node.onClick ? () => node.onClick!() : undefined}
            className={
              node.stateField && state[node.stateField] ? "bg-accent" : ""
            }
          >
            {node.icon}
          </Button>
        );
    });
  };

  // Return component

  return (
    <div className={`${className}`}>
      {/* Undo / Redo */}
      <Button
        variant="ghost"
        size="icon"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="button-icon" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className="button-icon" />
      </Button>

      {/* Render normal commands */}
      {cmdListGenerator(normalCmdNodes)}

      {/* Send command */}
      {type === "post" ? (
        <PostConfirmation content={editor.getHTML()} isAdmin={false} />
      ) : (
        <CmtConfirmation content={editor.getHTML()} />
      )}
    </div>
  );
}
