import React from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { getCart, setCountProduct, setTotalCount, setTotalPrice } from '../redux/slices/cartSlice'
import { RootState, useAppDispatch } from '../redux/store'
import ButtonCart from '../components/ButtonCart/ButtonCart'
import Reviews, { IReview } from '../components/Reviews/Reviews'
import customAxios from '../axios'
import { translateDate } from '../utils/translateDate'
import { useSelector } from 'react-redux'
import { setFetchFavorites } from '../redux/slices/productSlice'
import { Tooltip } from 'react-tooltip'

export interface IProduct {
	imgurl: string
	title: string
	description: string
	id: string
	price: number
	discount: number
	rating: number
	count: number
	favorite_id?: string
}

export const listSortReviews = [
	{ name: 'все', sort: '>= 0' },
	{ name: 'положительные', sort: '>= 4' },
	{ name: 'отрицательные', sort: '<= 2' },
]

export const listTypeSortReviews = [
	{ name: 'сначала старые', sort: 'asc' },
	{ name: 'сначала новые', sort: 'desc' },
]

const FullProduct: React.FC = () => {
	const { id } = useParams()
	const [dataProduct, setDataProduct] = React.useState<IProduct>({
		imgurl: '',
		title: '',
		description: '',
		price: 0,
		discount: 0,
		id: '',
		rating: 0,
		count: 0,
	})
	const [idUser, setIdUser] = React.useState('')
	const [dataReviews, setDataReviews] = React.useState<IReview[]>([])
	const [rating, setRating] = React.useState(0)
	const [copyLinkText, setCopyLinkText] = React.useState('Скопировать ссылку')
	const [isCheckedFavoriteMe, setIsCheckedFavoriteMe] = React.useState(false)
	const { fetchFavorites } = useSelector((state: RootState) => state.productSlice)
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)

	const dispatch = useAppDispatch()

	const fetchReviews = async (sort: { sort: string; type: string }) => {
		try {
			axios
				.get(`${process.env.REACT_APP_SERVER_URL}/reviews/${id}`, {
					params: { ...sort },
				})
				.then(({ data }) => setDataReviews(translateDate(data)))
		} catch (error) {
			console.log(error)
		}
	}

	const fetchRating = async () => {
		try {
			axios
				.get(`${process.env.REACT_APP_SERVER_URL}/${id}`)
				.then(({ data }) => setRating(data[0].rating))
		} catch (error) {
			console.log(error)
		}
	}

	React.useEffect(() => {
		try {
			customAxios
				.get(`${process.env.REACT_APP_SERVER_URL}/auth/me`)
				.then(({ data }) => setIdUser(data.decoded.id))

			axios.get(`${process.env.REACT_APP_SERVER_URL}/${id}`).then(({ data }) => {
				setDataProduct(data[0])
				setRating(data[0].rating)
			})

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

			getProductsCart()
			fetchReviews({ sort: listSortReviews[0].sort, type: listTypeSortReviews[0].sort })
		} catch (error) {
			console.log(error)
		}

		localStorage.getItem('token') &&
			customAxios.get(`${process.env.REACT_APP_SERVER_URL}/favorites/get`).then(({ data }) => {
				dispatch(setFetchFavorites(data))
				data?.forEach((item: IProduct) => {
					if (!JSON.parse(localStorage.getItem('arrFavorites') || '[]').includes(item.id)) {
						const updatedArrFavorites = JSON.parse(localStorage.getItem('arrFavorites') || '[]')
						updatedArrFavorites.push(item.id)
						localStorage.setItem('arrFavorites', JSON.stringify(updatedArrFavorites))
					}
				})
			})

		!localStorage.getItem('token') &&
			JSON.parse(localStorage.getItem('arrFavorites') || '[]')?.length &&
			axios
				.get(`${process.env.REACT_APP_SERVER_URL}/favorites/get/arrbyid`, {
					params: { arrFavorites: localStorage.getItem('arrFavorites') },
				})
				.then(({ data }) => {
					dispatch(setFetchFavorites(data))
				})
	}, [])

	React.useEffect(() => {
		setIsCheckedFavoriteMe(
			fetchFavorites?.filter((obj: IProduct) => obj.id === id).length ? true : false,
		)
	}, [fetchFavorites])

	const getArrFavorites = (isPost: boolean) => {
		localStorage.getItem('token') &&
			(isPost
				? customAxios.post(`${process.env.REACT_APP_SERVER_URL}/favorites/${id}`)
				: customAxios.delete(`/favorites/${id}`))
		setIsCheckedFavoriteMe(isPost)

		const updatedArrFavorites = JSON.parse(localStorage.getItem('arrFavorites') || '[]')

		isPost
			? updatedArrFavorites.push(id)
			: updatedArrFavorites.splice(updatedArrFavorites.indexOf(id), 1)

		localStorage.setItem('arrFavorites', JSON.stringify(updatedArrFavorites))
	}

	const onClickFavorite = () => {
		!isCheckedFavoriteMe ? getArrFavorites(true) : getArrFavorites(false)
	}

	return dataProduct ? (
		<div>
			<div className='container container--fullProduct'>
				<div className='product-block__image product-block__image--full'>
					<img
						src={`${process.env.REACT_APP_SERVER_URL}/uploads/productImg/${dataProduct.imgurl}`}
						alt='ava'
					/>
				</div>
				<div className='product-block__block-desc'>
					<h2 className='product-block__title--fullProduct'>{dataProduct.title}</h2>
					<p
						className='product-block__desc'
						dangerouslySetInnerHTML={{
							__html: dataProduct.description.replace(/\n/g, '<br>'),
						}}
					/>
					<div className='product-block__bottom--fullproduct'>
						<div className='product-block__bottom--fullproduct-left'>
							{!Boolean(dataProduct.discount) && (
								<div className='product-block__price'>{dataProduct.price} ₽</div>
							)}
							{Boolean(dataProduct.discount) && (
								<div className='product-block__price product-block__price--discount'>
									<div className='product-block__price--discount-top'>
										<p>{dataProduct.price}₽</p>
										<span>{dataProduct.discount}%</span>
									</div>
									<h4>
										{Math.floor(
											dataProduct.price -
												dataProduct.price *
													((dataProduct.discount ? dataProduct.discount : 0) / 100),
										)}{' '}
										₽
									</h4>
								</div>
							)}

							<ButtonCart
								id={dataProduct.id}
								price={dataProduct.price}
								discount={dataProduct.discount}
								title={dataProduct.title}
								imgurl={dataProduct.imgurl}
								count={dataProduct.count}
							/>
						</div>
						<div className='product-block__bottom--fullproduct-right'>
							<>
								<svg
									className='product-block__favorites-btn'
									onClick={() => onClickFavorite()}
									version='1.0'
									xmlns='http://www.w3.org/2000/svg'
									width='512.000000pt'
									height='512.000000pt'
									viewBox='0 0 512.000000 512.000000'
									preserveAspectRatio='xMidYMid meet'
								>
									<g
										transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
										fill={isCheckedFavoriteMe ? '#ffca28' : '#ccc'}
										stroke='none'
									>
										<path
											d='M2470 4994 c-83 -30 -152 -91 -207 -184 -11 -19 -152 -303 -313 -630
-161 -327 -294 -596 -295 -598 -1 -1 -309 -47 -685 -102 -375 -54 -698 -104
-719 -111 -165 -53 -263 -182 -248 -326 3 -30 20 -84 37 -121 28 -62 58 -93
363 -392 183 -178 412 -404 511 -501 l179 -176 -118 -684 c-133 -775 -133
-778 -75 -895 66 -135 204 -190 365 -149 39 10 283 133 678 340 l618 325 617
-325 c395 -208 638 -330 677 -340 161 -41 299 14 365 149 58 117 58 120 -75
895 l-118 684 174 171 c96 95 326 320 511 501 310 304 340 335 368 397 40 85
48 156 26 230 -30 106 -147 200 -279 227 -29 6 -346 54 -706 106 -360 53 -655
96 -656 98 -1 1 -136 274 -300 607 -164 332 -309 622 -322 644 -37 57 -106
120 -160 146 -63 30 -154 35 -213 14z'
										/>
									</g>
								</svg>
								<Tooltip anchorSelect='.product-block__favorites-btn' place='bottom'>
									Добавить в избранное
								</Tooltip>
							</>
							<button
								style={isDarkTheme ? { color: '#fff' } : {}}
								className='product-block__link'
								onClick={() => {
									navigator.clipboard.writeText(window.location.href)
									setCopyLinkText('Скопировано')
								}}
							>
								{copyLinkText}
								<img src={require(`../assets/link.png`)} alt='Product' />
							</button>
						</div>
					</div>
				</div>
			</div>
			<Reviews
				id={dataProduct.id}
				fetchReviews={fetchReviews}
				fetchRating={fetchRating}
				idUser={idUser}
				dataReviews={dataReviews}
				rating={rating}
				dataProduct={dataProduct}
			/>
			<div className='button--fullproduct'>
				<Link to='/' className='button button--black'>
					<span>Вернуться назад</span>
				</Link>
			</div>
		</div>
	) : (
		<div className='product-block__empty'>
			<h2 className='product-block__empty-title'>Товар отсутствует!😬</h2>
			<Link to='/' className='button button--black button--orders'>
				<span>Вернуться на главную страницу</span>
			</Link>
		</div>
	)
}

export default FullProduct
