"use client";

import { useState } from "react";
import css from "./page.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Link from "next/link";
import { Tag } from "@/types/note";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearch = useDebouncedCallback((search: string) => {
    setDebouncedSearch(search);
  }, 300);

  const handleSearchChange = (search: string) => {
    setSearch(search);
    setPage(1);
    handleSearch(search);
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        search: debouncedSearch,
        page,
        tag: tag !== "All" ? (tag as Tag) : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onSearch={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination page={page} total={data.totalPages} onChange={setPage} />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Could not fetch the list of notes</p>}
      {isSuccess && data.notes.length === 0 && <p>No notes found</p>}
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
