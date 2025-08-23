"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import css from "./NoteForm.module.css";
import type { Tag } from "@/types/note";
import { addNote } from "@/lib/api";
import { useNoteDraft } from "@/lib/store/noteStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NoteForm = () => {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraft();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: (newNote: typeof draft) => addNote(newNote),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/All");
    },
    onError: () => {
      alert("Failed to create note");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDraft({ ...draft, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    mutation.mutate(
      {
        ...draft,
        tag: draft.tag as Tag,
      },
      {
        onSettled: () => setIsSubmitting(false),
      }
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag || "Todo"}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>
      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create note"}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
