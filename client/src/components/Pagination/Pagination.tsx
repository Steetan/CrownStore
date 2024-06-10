import React from 'react'
import ReactPaginate from 'react-paginate'
import { useSelector } from 'react-redux'
import { setSelectedPage } from '../../redux/slices/filterSlice'
import { useAppDispatch, RootState } from '../../redux/store'

export const Pagination: React.FC<{ allPages: number }> = ({ allPages }) => {
	const dispatch = useAppDispatch()
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	const { selectedPage } = useSelector((state: RootState) => state.filterSlice)
	return (
		<ReactPaginate
			className={isDarkTheme ? 'pagination__block dark-theme' : 'pagination__block'}
			breakLabel='...'
			nextLabel='>'
			onPageChange={(e) => dispatch(setSelectedPage(e.selected + 1))}
			pageRangeDisplayed={5}
			pageCount={allPages}
			previousLabel='<'
			renderOnZeroPageCount={null}
			forcePage={selectedPage - 1}
		/>
	)
}
