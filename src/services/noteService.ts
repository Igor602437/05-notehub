import axios from 'axios';
import type { NewNote, Note } from '../types/note';

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;
axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  query: string = '',
  page: number
): Promise<FetchNotesResponse> {
  const axiosOptions = {
    params: {
      search: query,
      page,
      perPage: 12,
    },
  };
  const response = await axios.get<FetchNotesResponse>('/notes', axiosOptions);

  return response.data;
}

export async function createNote(values: NewNote): Promise<Note> {
  const response = await axios.post<Note>('/notes', values);

  return response.data;
}

export async function deleteNote(noteId: string): Promise<void> {
  await axios.delete(`/notes/${noteId}`);
}
