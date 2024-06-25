import { FormControlLabel, Switch, TextField } from '@mui/material'
import React from 'react'
import ReactStars from 'react-stars'
import customAxios from '../../axios'
import { useForm } from 'react-hook-form'
import ReviewBlock from '../ReviewBlock/ReviewBlock'
import { IProduct, listSortReviews, listTypeSortReviews } from '../../pages/FullProduct'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { Collapse } from 'react-collapse'
import { getDate } from '../../utils/getDate'

export interface IReview {
	id: string
	user_id: string
	count_stars: number
	description: string
	product_id: string
	name_user: string
	fname_user: string
	user_imgurl: string
	date: string
}

interface IReviewComponent {
	id: string
	fetchRating: () => void
	fetchReviews: (sort: { sort: string; type: string }) => void
	idUser: string
	rating: number
	dataReviews: IReview[]
	dataProduct: IProduct
}

const Reviews: React.FC<IReviewComponent> = ({
	id,
	fetchReviews,
	fetchRating,
	idUser,
	rating,
	dataReviews,
	dataProduct,
}) => {
	const isAuth = localStorage.getItem('token')
	const [isChecked, setIsChecked] = React.useState(false)
	const [typeSort, setTypeSort] = React.useState(listSortReviews[0])
	const [orderSort, setOrderSort] = React.useState(listTypeSortReviews[0])
	const [userRating, setUserRating] = React.useState(0)
	const [isVisiblePopup, setIsVisiblePopup] = React.useState(false)
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	const sortRef = React.useRef<HTMLDivElement>(null)

	const { register, handleSubmit, setValue } = useForm<IReview>()

	const selectedSort = (index: { name: string; sort: string }) => {
		setIsVisiblePopup(!isVisiblePopup)
		setTypeSort(index)
		fetchReviews({ sort: index.sort, type: orderSort.sort })
	}

	const selectedTypeSort = (type: { name: string; sort: string }) => {
		setIsVisiblePopup(!isVisiblePopup)
		setOrderSort(type)
		fetchReviews({ sort: typeSort.sort, type: type.sort })
	}

	React.useEffect(() => {
		const handleClickOutSide = (event: MouseEvent) => {
			const _event = event as MouseEvent & {
				path: Node[]
			}

			if (sortRef.current && !_event.composedPath().includes(sortRef.current)) {
				setIsVisiblePopup(false)
			}
		}

		document.body.addEventListener('click', handleClickOutSide)

		return () => document.body.removeEventListener('click', handleClickOutSide)
	}, [])

	const onSubmit = async (values: IReview) => {
		if (userRating > 0) {
			try {
				await customAxios.post(`${process.env.REACT_APP_SERVER_URL}/reviews/${id}`, {
					...values,
					count_stars: userRating,
					date: getDate(),
				})

				await fetchReviews({ sort: typeSort.sort, type: orderSort.sort })
				await fetchRating()
				alert('Отзыв был успешно добавлен!')
			} catch (error) {
				console.log(error)
				alert('Не удалось добавить отзыв!')
			}

			setUserRating(0)
			setValue('description', '')
		} else {
			alert('Укажите количество звезд')
		}
	}

	const onDelReview = async (item: IReview) => {
		if (window.confirm('Вы действительно хотите удалить отзыв?')) {
			try {
				await customAxios.delete(`${process.env.REACT_APP_SERVER_URL}/reviews/${item.id}`)

				await fetchReviews({ sort: typeSort.sort, type: orderSort.sort })
				await fetchRating()
			} catch (error) {
				console.log(error)
			}
		}
	}

	return (
		<div className='reviews'>
			<div className='reviews__top'>
				<h3 className='reviews__title'>Общий рейтинг {Number(rating).toFixed(1)}⭐</h3>
				<div ref={sortRef} className='reviews__sort-block'>
					<button className='reviews__sort-btn' onClick={() => setIsVisiblePopup(!isVisiblePopup)}>
						{typeSort.name}
					</button>
					{isVisiblePopup && (
						<div
							className={
								isDarkTheme
									? 'sort__popup sort__popup--reviews dark-theme-background'
									: 'sort__popup sort__popup--reviews'
							}
						>
							<ul>
								{listSortReviews.map((item, index) => (
									<li
										onClick={() => selectedSort(item)}
										className={typeSort.sort === item.sort ? 'active' : ''}
										key={index}
									>
										{item.name}
									</li>
								))}
							</ul>
							<ul style={{ marginTop: 10, borderTop: '1px solid #ccc' }}>
								{listTypeSortReviews.map((item, index) => (
									<li
										onClick={() => selectedTypeSort(item)}
										className={orderSort.sort === item.sort ? 'active' : ''}
										key={index}
									>
										{item.name}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
			{isAuth && (
				<div className='reviews__create-block'>
					<div className='reviews__create-switch'>
						<h4>Добавить отзыв</h4>
						<FormControlLabel
							value={isChecked}
							onChange={() => setIsChecked(!isChecked)}
							control={<Switch />}
							label=''
						/>
					</div>
					<Collapse isOpened={isChecked}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className='form-block__inputs'>
								<ReactStars
									count={5}
									onChange={(newRating: number) => setUserRating(newRating)}
									size={30}
									value={userRating}
									color2={'#ffd700'}
									half={false}
								/>
								<TextField
									placeholder='Описание (необязательно)'
									multiline
									rows={7}
									maxRows={8}
									{...register('description')}
								/>
								<div className='form-block__btns'>
									<button type='submit' className='button button--footer button--reviews'>
										Добавить отзыв
									</button>
								</div>
							</div>
						</form>
					</Collapse>
				</div>
			)}
			<div className='reviews__main-block'>
				{dataReviews.map((item) => (
					<ReviewBlock
						item={item}
						key={item.id}
						onDelReview={onDelReview}
						idUser={idUser}
						dataProduct={dataProduct}
					/>
				))}
				{!dataReviews.length && (
					<h2 className='reviews__empty-title'>
						Нет отзывов? Значит, ты первый, кто оценит этот шедевральный товар!😉
					</h2>
				)}
			</div>
		</div>
	)
}

export default Reviews
