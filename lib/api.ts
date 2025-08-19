import axios from "axios";
import type { Note, NewNoteData } from "../types/note";

const myToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${myToken}`,
  },
});

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export type FetchNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
};

// export type CategoryType = {
//   id: string;
//   name: string;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
// };

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
  tag,
}: FetchNotesParams): Promise<NotesResponse> => {
  const params: FetchNotesParams = {
    page,
    perPage,
    tag,
  };

  // if (tag) {
  //   params.categoryId = tag;
  // }

  if (search) {
    params.search = search;
  }

  const response = await axiosInstance.get<NotesResponse>("/notes", {
    params,
  });

  return response.data;
};

export const addNote = async (noteData: NewNoteData): Promise<Note> => {
  const response = await axiosInstance.post<Note>("/notes", noteData);
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${noteId}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axiosInstance.get<Note>(`/notes/${id}`);
  return response.data;
};

// export const getCategories = async () => {
//   const { data } = await axios.get<CategoryType[]>(`/categories`);
//   return data;
// };
