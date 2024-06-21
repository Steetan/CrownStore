import React from 'react'
import { useSelector } from 'react-redux'
import { setCategoryId, setNameCategory } from '../../redux/slices/filterSlice'
import { RootState, useAppDispatch } from '../../redux/store'

export const arrCategories = [
	'Все',
	'Катриджи',
	'Системные блоки',
	'Мониторы',
	'Видеокарты',
	'HDD',
	'Блоки питания',
	'Принтеры',
	'Клавиатуры',
	'Мыши',
	'Наушники',
]

export const Categories: React.FC = React.memo(() => {
	const [isVisiblePopup, setIsVisiblePopup] = React.useState(false)
	const { categoryId } = useSelector((state: RootState) => state.filterSlice)
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	const dispatch = useAppDispatch()
	const popupRef = React.useRef<HTMLDivElement>(null)
	const popupCategory = React.useRef<HTMLDivElement>(null)

	const setCategory = React.useCallback((index: number, item: string) => {
		dispatch(setCategoryId(index))
		dispatch(setNameCategory(item))
		setIsVisiblePopup(false)
	}, [])

	React.useEffect(() => {
		popupRef.current?.classList.add('popup')
	}, [])

	React.useEffect(() => {
		const handleClickOutSide = (event: MouseEvent) => {
			const _event = event as MouseEvent & {
				path: Node[]
			}

			if (
				isVisiblePopup &&
				popupCategory.current &&
				!_event.composedPath().includes(popupCategory.current)
			) {
				setIsVisiblePopup(false)
			}
		}

		document.body.addEventListener('click', handleClickOutSide)

		return () => document.body.removeEventListener('click', handleClickOutSide)
	}, [isVisiblePopup])

	return (
		<div
			ref={popupCategory}
			className='categories-main'
			onClick={() => setIsVisiblePopup(!isVisiblePopup)}
		>
			<button className='button button--menu button--black'>Категории</button>
			<div
				ref={popupRef}
				className={
					isVisiblePopup
						? isDarkTheme
							? 'categories  popup-enter-active dark-theme-background'
							: 'categories  popup-enter-active'
						: isDarkTheme
						? 'categories  popup-exit-active dark-theme-background'
						: 'categories popup-exit-active'
				}
			>
				<ul>
					{arrCategories.map((item, index) => (
						<li
							key={index}
							onClick={() => setCategory(index, item)}
							className={categoryId === index ? 'active' : ''}
						>
							{item}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
})
