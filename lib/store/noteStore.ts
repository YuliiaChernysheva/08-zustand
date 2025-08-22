import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CreateNoteData } from "../api";

const defaultDraft: CreateNoteData = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteDraft = {
  draft: CreateNoteData;
  setDraft: (note: CreateNoteData) => void;
  clearDraft: () => void;
  privateKey: string;
};

export const useNoteDraft = create<NoteDraft>()(
  persist(
    (set) => {
      return {
        draft: defaultDraft,
        privateKey: "asd",
        setDraft: (newData: CreateNoteData) => set({ draft: newData }),
        clearDraft: () => set({ draft: defaultDraft }),
      };
    },
    {
      name: "draft",
      partialize: (state) => {
        return { draft: state.draft };
      },
    }
  )
);
