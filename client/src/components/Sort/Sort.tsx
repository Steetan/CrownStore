import React from 'react'
import { useSelector } from 'react-redux'
import { setSort, setTypeSort } from '../../redux/slices/filterSlice'
import { RootState, useAppDispatch } from '../../redux/store'

export const listSort = [
	{ name: 'популярности', sort: 'rating' },
	{ name: 'цене', sort: 'price' },
	{ name: 'алфавиту', sort: 'title' },
]

export const listTypeSort = [
	{ name: 'возрастанию', sort: 'asc' },
	{ name: 'убыванию', sort: 'desc' },
]

interface ISort {
	getProductsCart: any
	value: { name: string; sort: string }
}

export const Sort: React.FC<ISort> = React.memo(({ value, getProductsCart }) => {
	const [isVisible, setIsVisible] = React.useState(false)
	const { typeSort } = useSelector((state: RootState) => state.filterSlice)
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	const dispatch = useAppDispatch()
	const sortRef = React.useRef<HTMLDivElement>(null)

	const selectedSort = (index: { name: string; sort: string }) => {
		dispatch(setSort(index))
		setIsVisible(!isVisible)
		getProductsCart()
	}

	const selectedTypeSort = (type: { name: string; sort: string }) => {
		dispatch(setTypeSort(type))
		setIsVisible(!isVisible)
		getProductsCart()
	}

	React.useEffect(() => {
		const handleClickOutSide = (event: MouseEvent) => {
			const _event = event as MouseEvent & {
				path: Node[]
			}

			if (isVisible && sortRef.current && !_event.composedPath().includes(sortRef.current)) {
				setIsVisible(false)
			}
		}

		document.body.addEventListener('click', handleClickOutSide)

		return () => document.body.removeEventListener('click', handleClickOutSide)
	}, [isVisible])

	return (
		<div ref={sortRef} className='sort'>
			<div className='sort__label'>
				<svg
					className={isVisible ? 'arrowBottom active' : 'arrowBottom '}
					width='10'
					height='6'
					viewBox='0 0 10 6'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z'
						fill={isDarkTheme ? '#fff' : '#2C2C2C'}
					/>
				</svg>
				<b>Сортировка по:</b>
				<span onClick={() => setIsVisible(!isVisible)}>{value.name}</span>
			</div>

			<div
				className={
					isVisible
						? isDarkTheme
							? 'sort__popup  popup-enter-active dark-theme-background'
							: 'sort__popup  popup-enter-active'
						: isDarkTheme
						? 'sort__popup  popup-exit-active dark-theme-background'
						: 'sort__popup popup-exit-active'
				}
			>
				<ul>
					{listSort.map((item, index) => (
						<li
							onClick={() => selectedSort(item)}
							className={value.sort === item.sort ? 'active' : ''}
							key={index}
						>
							{item.name}
						</li>
					))}
				</ul>
				<ul style={{ marginTop: 10, borderTop: '1px solid #ccc' }}>
					{listTypeSort.map((item, index) => (
						<li
							onClick={() => selectedTypeSort(item)}
							className={typeSort.sort === item.sort ? 'active' : ''}
							key={index}
						>
							{item.name}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
})
