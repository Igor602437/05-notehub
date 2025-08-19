import css from './Pagination.module.css'
import ReactPaginate from "react-paginate";

interface PaginationProps {
  page: number;
  totalPages: number;
  onSelect: (page: number) => void;
}

export default function Pagination({ page, totalPages, onSelect }: PaginationProps) {
	
  return (
    <ReactPaginate
	pageCount={totalPages}
	pageRangeDisplayed={5}
	marginPagesDisplayed={1}
	onPageChange={({ selected }) => onSelect(selected + 1)}
	forcePage={page - 1}
	containerClassName={css.pagination}
	activeClassName={css.active}
	nextLabel="→"
	previousLabel="←"
/>
  )
}
