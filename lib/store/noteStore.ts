import { NewNoteData } from "@/types/note";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultDraft: NewNoteData = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteDraft = {
  draft: NewNoteData;
  setDraft: (note: NewNoteData) => void;
  clearDraft: () => void;
};

export const useNoteDraft = create<NoteDraft>()(
  persist(
    (set) => ({
      draft: defaultDraft,
      setDraft: (note) =>
        set(() => ({
          draft: note,
        })),
      clearDraft: () => set(() => ({ draft: { ...defaultDraft } })),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
