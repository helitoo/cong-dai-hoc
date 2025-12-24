import { create } from "zustand";

export type ContentEditorProps = {
  authorId: string | undefined;
  acceptTitling: boolean;
  acceptPublicing: boolean;
  acceptPinning: boolean;
  acceptReferencing: boolean;
  topicId: string;
  defaultTitle: string | undefined;
  defaultPid: string | undefined;
  refPostId: string | undefined;
  limitContentLength: number;
  defaultContent: string;
};

type EditorState = {
  open: boolean;
  payload: ContentEditorProps | undefined;

  openEditor: (payload: ContentEditorProps) => void;
  closeEditor: () => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  open: false,
  payload: undefined,

  openEditor: (payload) =>
    set({
      open: true,
      payload,
    }),

  closeEditor: () =>
    set({
      open: false,
      payload: undefined,
    }),
}));
