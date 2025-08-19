import { keepPreviousData, useQuery } from '@tanstack/react-query'
import css from './App.module.css'
import { fetchNotes } from '../../services/noteService'
import { useState } from 'react';
import NoteList  from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import { useDebounce } from 'use-debounce';

export default function App() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["myNotes", debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    enabled: page !== 0,
    placeholderData: keepPreviousData
  });

  const totalPages = data?.totalPages ?? 0;

  const openModal = ()=>setIsModalOpen(true)
  const closeModal = ()=>setIsModalOpen(false)

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onSelect={(page) => setPage(page)} />}
        <button className={css.button} onClick={openModal}>Create note +</button>
      </header>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong</p>}
      {isSuccess && data?.notes.length === 0 && <p>No notes found</p>}
      {data?.notes && data?.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            onClose={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
