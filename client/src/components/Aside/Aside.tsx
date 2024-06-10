import React, { ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import {
	setFromRangeFilter,
	setIsVisibleFilterPopup,
	setMaxPrice,
	setMinPrice,
	setSelectedPage,
	setSelectedRatingFilter,
	setToRangeFilter,
} from '../../redux/slices/filterSlice'
import {
	getCart,
	setCountProduct,
	setTotalCount,
	setTotalPrice,
} from '../../redux/slices/cartSlice'
import { Slider } from '@mui/material'
import axios from 'axios'

export const Aside = () => {
	const [arrPriceValue, setArrPriceValue] = React.useState([0, 0])
	const [selectedRating, setSelectedRating] = React.useState<null | number>(null)
	const { isVisibleFilterPopup, maxRangePrice, minRangePrice } = useSelector(
		(state: RootState) => state.filterSlice,
	)
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)

	const isFilter = React.useRef<HTMLDivElement>(null)
	const dispatch = useAppDispatch()

	const listRating = [
		'Товары с хорошим рейтингом',
		'Товары с плохим рейтингом',
		'Товары без оценки',
	]

	React.useEffect(() => {
		axios.get(`${process.env.REACT_APP_SERVER_URL}/products`).then(({ data }) => {
			let min = data[0].price
			let max = data[0].price

			data.forEach((item: any) => {
				min = item.price < min ? item.price : min
				max = item.price > max ? item.price : max
			})

			dispatch(setMinPrice(min))
			dispatch(setMaxPrice(max))
			dispatch(setFromRangeFilter(min))
			dispatch(setToRangeFilter(max))
			setArrPriceValue([min, max])
		})
	}, [])

	isVisibleFilterPopup
		? document.body.classList.add('active')
		: document.body.classList.remove('active')

	const setAside = () => {
		arrPriceValue[0] > arrPriceValue[1] && setArrPriceValue([arrPriceValue[1], arrPriceValue[0]])

		dispatch(
			setFromRangeFilter(
				Number(arrPriceValue[0] > arrPriceValue[1] ? arrPriceValue[1] : arrPriceValue[0]),
			),
		)
		dispatch(
			setToRangeFilter(
				Number(arrPriceValue[0] > arrPriceValue[1] ? arrPriceValue[0] : arrPriceValue[1]),
			),
		)

		dispatch(setSelectedRatingFilter(selectedRating))
		dispatch(setIsVisibleFilterPopup(false))

		getProductsCart()
		window.scrollTo(0, 0)
		dispatch(setSelectedPage(1))
	}

	const resetFilters = () => {
		setArrPriceValue([minRangePrice, maxRangePrice])
		dispatch(setFromRangeFilter(minRangePrice))
		dispatch(setToRangeFilter(maxRangePrice))
		dispatch(setSelectedRatingFilter(null))
		setSelectedRating(null)
		getProductsCart()
	}

	const getProductsCart = () => {
		let totalPrice = 0

		dispatch(getCart()).then((data) => {
			let arrCountProduct: { product: string; count: number }[] = []
			data.payload &&
				data.payload.results.forEach((item: any) => {
					totalPrice += item.price * item.totalcount
					arrCountProduct.push({ product: item.product_id, count: item.totalcount })
				})
			dispatch(setCountProduct(arrCountProduct))
			dispatch(setTotalPrice(totalPrice))
			dispatch(setTotalCount(data.payload?.results.length))
		})
	}

	const handleChange = (event: Event, newValue: number | number[]) => {
		setArrPriceValue(newValue as number[])
		console.log(event)
	}

	return (
		<div
			ref={isFilter}
			className={
				isVisibleFilterPopup
					? `aside active ${isDarkTheme ? 'dark-theme-background dark-theme' : ''}`
					: 'aside'
			}
		>
			<div className='aside-close-wrapper' onClick={() => setAside()}>
				<div className='aside-close'></div>
			</div>
			<h2 className='aside__main-title'>Фильтры</h2>
			<div className='aside__filter-main'>
				<h2 className='aside__title'>Диапазон</h2>
				<div className='aside__slider-wrap'>
					<Slider
						className='aside__slider'
						getAriaLabel={() => 'Temperature range'}
						value={arrPriceValue}
						max={maxRangePrice}
						min={minRangePrice}
						onChange={handleChange}
						valueLabelDisplay='auto'
					/>
				</div>
				<div className='aside__filter-inputs'>
					<input
						className='aside__filter-input'
						type='number'
						defaultValue={minRangePrice}
						placeholder='от'
						value={arrPriceValue[0]}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setArrPriceValue([Number(event.target.value), arrPriceValue[1]])
						}
					/>
					<input
						className='aside__filter-input'
						type='number'
						defaultValue={maxRangePrice}
						placeholder='до'
						value={arrPriceValue[1]}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setArrPriceValue([arrPriceValue[0], Number(event.target.value)])
						}
					/>
				</div>
			</div>
			<div className='aside__rating-main'>
				<h2 className='aside__title'>Рейтинг</h2>
				<div className='aside__rating-blocks'>
					{listRating.map((item, index) => (
						<h3
							className={
								selectedRating === index ? 'aside__rating-block active' : 'aside__rating-block'
							}
							onClick={() => setSelectedRating(index)}
							key={index}
						>
							{item}
						</h3>
					))}
				</div>
			</div>
			<div className='aside__buttons'>
				<button className='aside__button aside__button--reset' onClick={resetFilters}>
					Сбросить фильтры
				</button>
				<button className='aside__button' onClick={setAside}>
					Применить
				</button>
			</div>
		</div>
	)
}

export default Aside
