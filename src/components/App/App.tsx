import { keepPreviousData, useQuery } from '@tanstack/react-query'
import css from './App.module.css'
import { fetchNotes } from '../../services/noteService'
import { useState } from 'react';
import NoteList  from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function App() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["myNotes", page, searchValue],
    queryFn: () => fetchNotes(page, searchValue),
    enabled: page !== 0,
    placeholderData: keepPreviousData
  });

  const totalPages = data?.totalPages || 1;

  const handleSearch = useDebouncedCallback((search: string) => {
    setSearchValue(search);
    setPage(1);
  }, 500);

  const openModal = ()=>setIsModalOpen(true)
  const closeModal = ()=>setIsModalOpen(false)

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onSelect={(page) => setPage(page)} />}
        <button className={css.button} onClick={openModal}>Create note +</button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage value='backend'/>}
      {isSuccess && data?.notes.length === 0 && <ErrorMessage value='request'/>}
      {data?.notes && data?.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            onClose={closeModal}
            onSuccess={() => setPage(1)}
          />
        </Modal>
      )}
    </div>
  );
}
