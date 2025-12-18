import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";

// When user click on the table -> Return true
export function useTableSidebar(editor: Editor | null) {
  // State of table: Is clicked, or not
  const [isOpenTable, setisOpenTable] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const handler = () => {
      const isInTable =
        editor.isActive("table") || editor.isActive("tableCell");

      if (isInTable) {
        setisOpenTable(true);
      } else {
        setisOpenTable(false);
      }
    };

    editor.on("selectionUpdate", handler);

    return () => {
      editor?.off("selectionUpdate", handler);
    };
  }, [editor]);

  return { isOpenTable };
}
