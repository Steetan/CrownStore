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

	const setCategory = React.useCallback((index: number, item: string) => {
		dispatch(setCategoryId(index))
		dispatch(setNameCategory(item))
		setIsVisiblePopup(false)
	}, [])

	React.useEffect(() => {
		popupRef.current?.classList.add('popup')
	}, [])

	const onOpenCategories = () => {
		setTimeout(() => {
			setIsVisiblePopup(true)
		}, 50)
	}

	const onCloseCategories = () => {
		popupRef.current?.classList.remove('popup')
		setIsVisiblePopup(false)
	}

	return (
		<div
			className='categories-main'
			onMouseEnter={() => onOpenCategories()}
			onMouseLeave={() => onCloseCategories()}
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
