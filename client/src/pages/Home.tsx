import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setFilters, setIsVisibleFilterPopup, setSelectedPage } from '../redux/slices/filterSlice'
import { fetchProducts, setFetchFavorites } from '../redux/slices/productSlice'
import { RootState, useAppDispatch } from '../redux/store'
import customAxios from '../axios'
import qs from 'qs'

import {
	ProductBlock,
	ProductBlockSkeleton,
	Pagination,
	Categories,
	Sort,
	listSort,
	listTypeSort,
	HomeSlider,
} from '../components'
import {
	getCart,
	setCountProduct,
	setTotalCount,
	setTotalPrice,
	setTotalPriceServices,
} from '../redux/slices/cartSlice'
import { fetchAdminMe, fetchUserMe, setIsAdmin, setIsAuth } from '../redux/slices/authSlice'
import { IProduct } from './FullProduct'
import axios from 'axios'

export interface IProductBlock {
	id?: string | undefined
	title: string
	description?: string
	imgurl: string
	price: number
	count?: number
	countProduct?: { product: string; count: number }[]
	discount?: number
	isAuth?: boolean
	fetchFavorites?: IProduct[]
	rating?: any
}

const Home = () => {
	const [allPages, setAllPages] = React.useState<number>(1)
	const isAuth = useSelector((state: RootState) => state.authSlice.isAuth)
	// const {fetchFavorites} = useSelector((state: RootState) => state.productSlice)
	// const [fetchFavorites, setFetchFavorites] = React.useState<IProduct[]>([])

	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const isSearch = React.useRef(false)
	const isMounted = React.useRef(false)

	const {
		categoryId,
		sort,
		typeSort,
		nameCategory,
		searchInput,
		selectedPage,
		fromRangeFilter,
		toRangeFilter,
		selectedRatingFilter,
		maxRangePrice,
		minRangePrice,
	} = useSelector((state: RootState) => state.filterSlice)
	const { items, status } = useSelector((state: RootState) => state.productSlice)
	const { countProduct } = useSelector((state: RootState) => state.cartSlice)
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)

	React.useEffect(() => {
		localStorage.getItem('token') &&
			customAxios.post(`${process.env.REACT_APP_SERVER_URL}/favorites/post/arr`, {
				arrFavorites: JSON.parse(localStorage.getItem('arrFavorites') || '[]'),
			})

		if (window.location.search) {
			const params = qs.parse(window.location.search.substring(1))

			const sort = listSort.find((obj) => obj.sort === params.sortProperty)
			const typeSort = listTypeSort.find((obj) => obj.sort === params.typeSortProperty)

			dispatch(
				setFilters({
					...params,
					sort,
					typeSort,
				}),
			)
		}

		isSearch.current = false

		dispatch(setIsAuth(Boolean(localStorage.getItem('token'))))

		try {
			const fetchMe = async () => {
				await dispatch(fetchUserMe()).then((data) => {
					data.payload ? setIsAuth(true) : setIsAuth(false)
				})

				await dispatch(fetchAdminMe()).then((data) => {
					data.payload.error ? dispatch(setIsAdmin(false)) : dispatch(setIsAdmin(true))
				})

				fetchMe()
			}
		} catch (error) {
			console.log(error)
		}

		localStorage.getItem('arrService') && localStorage.removeItem('arrService')
		dispatch(setTotalPriceServices(0))
	}, [])

	const getProducts = async () => {
		const categoryParam: string = `${`categoryid=${categoryId}`}`
		const sortParam: string = `&sortBy=${sort.sort}`
		const orderParam: string = `&order=${typeSort.sort}`
		const inputParam: string = `${searchInput && `&search=${searchInput}`}`
		const selectedRating = selectedRatingFilter !== null ? String(selectedRatingFilter) : ''

		const data = await dispatch(
			fetchProducts({
				categoryParam,
				sortParam,
				orderParam,
				inputParam,
				selectedPage: String(selectedPage),
				fromRangeFilter: String(fromRangeFilter),
				toRangeFilter: String(toRangeFilter),
				selectedRating,
			}),
		)

		setAllPages(data.payload.totalPages)
	}

	React.useEffect(() => {
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
		if (!isSearch.current) {
			getProducts()
		}

		isSearch.current = false
	}, [
		categoryId,
		sort.sort,
		typeSort.sort,
		searchInput,
		selectedPage,
		fromRangeFilter,
		toRangeFilter,
		selectedRatingFilter,
	])

	React.useEffect(() => {
		if (isMounted.current) {
			const queryString = qs.stringify({
				sortProperty: sort.sort,
				typeSortProperty: typeSort.sort,
				categoryId,
				selectedPage,
				nameCategory,
			})

			navigate(`?${queryString}`)
		}
		isMounted.current = true
	}, [categoryId, sort.sort, typeSort.sort, selectedPage, nameCategory])

	React.useEffect(() => {
		getProductsCart()

		dispatch(setSelectedPage(1))
	}, [categoryId])

	const getProductsCart = () => {
		let totalPrice = 0

		dispatch(getCart()).then((data) => {
			let arrCountProduct: { product: string; count: number }[] = []
			data.payload &&
				data.payload.results.forEach((item: any) => {
					totalPrice += item.res_price * item.totalcount
					arrCountProduct.push({ product: item.product_id, count: item.totalcount })
				})
			dispatch(setCountProduct(arrCountProduct))
			dispatch(setTotalPrice(totalPrice))
			dispatch(setTotalCount(data.payload?.results.length))
		})
	}

	const setFilter = () => {
		dispatch(setIsVisibleFilterPopup(true))
		window.scrollTo(0, 0)
	}

	return (
		<div className='container'>
			<div className='slider-container'>
				<HomeSlider />
			</div>
			<div className='content__top'>
				<Categories />
				<div className='content-settings__right-block'>
					<Sort value={sort} getProductsCart={getProductsCart} />
					<div className='filter-button-wrapper'>
						<svg
							onClick={() => setFilter()}
							className='filter-button'
							version='1.0'
							xmlns='http://www.w3.org/2000/svg'
							width='512.000000pt'
							height='512.000000pt'
							viewBox='0 0 512.000000 512.000000'
							preserveAspectRatio='xMidYMid meet'
						>
							<g
								transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
								fill={isDarkTheme ? '#fff' : '#000000'}
								stroke='none'
							>
								<path
									d='M1365 4465 c-203 -44 -367 -175 -451 -360 l-25 -55 -313 0 c-308 0
-314 0 -357 -23 -24 -13 -57 -43 -74 -66 -27 -39 -30 -50 -30 -120 0 -68 3
-82 27 -117 15 -21 44 -50 65 -64 l36 -25 323 -5 323 -5 35 -70 c104 -207 302
-336 536 -352 298 -19 579 188 654 483 20 79 20 229 0 308 -29 115 -79 202
-168 292 -66 67 -98 91 -166 123 -139 67 -280 86 -415 56z m247 -451 c161
-113 97 -366 -97 -382 -201 -17 -315 225 -169 359 53 48 84 60 156 56 56 -2
74 -8 110 -33z'
								/>
								<path
									d='M2459 4027 c-24 -13 -57 -43 -74 -66 -27 -39 -30 -50 -30 -120 0 -68
3 -82 27 -117 15 -21 44 -50 65 -64 l37 -25 1196 0 1196 0 37 25 c21 14 50 43
65 64 24 35 27 49 27 116 0 67 -3 81 -27 116 -15 21 -44 50 -65 64 l-37 25
-1186 3 -1186 2 -45 -23z'
								/>
								<path
									d='M3276 3184 c-322 -69 -543 -384 -496 -706 45 -313 286 -535 600 -555
245 -15 484 123 598 344 l43 82 428 3 427 3 37 25 c21 14 50 43 65 64 24 35
27 49 27 116 0 67 -3 81 -27 116 -15 21 -44 50 -65 64 l-37 25 -428 3 -429 3
-15 36 c-55 131 -176 258 -306 323 -138 67 -275 85 -422 54z m256 -450 c162
-113 97 -366 -97 -382 -197 -16 -310 209 -177 352 69 74 193 87 274 30z'
								/>
								<path
									d='M219 2747 c-24 -13 -57 -43 -74 -66 -27 -39 -30 -50 -30 -120 0 -68
3 -82 27 -117 15 -21 44 -50 65 -64 l37 -25 1065 -3 c749 -2 1077 0 1104 8 20
6 54 25 74 43 114 100 90 277 -49 348 -36 18 -74 19 -1106 19 l-1069 0 -44
-23z'
								/>
								<path
									d='M1782 1905 c-86 -19 -200 -76 -272 -136 -66 -55 -150 -167 -176 -235
l-17 -44 -527 0 -527 0 -44 -23 c-24 -13 -57 -43 -74 -66 -27 -39 -30 -50 -30
-120 0 -68 3 -82 27 -117 15 -21 44 -50 65 -64 l37 -25 536 -3 537 -2 17 -44
c26 -69 110 -180 176 -235 113 -94 267 -151 410 -151 349 0 640 291 640 640 0
405 -381 711 -778 625z m252 -445 c20 -14 49 -43 64 -64 24 -35 27 -49 27
-116 0 -67 -3 -81 -27 -116 -15 -21 -44 -50 -65 -64 -31 -21 -48 -25 -113 -25
-65 0 -82 4 -113 25 -81 55 -118 161 -88 253 14 41 72 104 115 123 50 23 155
14 200 -16z'
								/>
								<path
									d='M2900 1474 c-173 -75 -161 -342 18 -394 26 -8 334 -10 998 -8 l960 3
37 25 c21 14 50 43 65 64 24 35 27 49 27 116 0 67 -3 81 -27 116 -15 21 -44
50 -65 64 l-37 25 -970 2 c-851 2 -975 0 -1006 -13z'
								/>
							</g>
						</svg>
						{(Number(fromRangeFilter !== minRangePrice) ||
							Number(toRangeFilter !== maxRangePrice) ||
							selectedRatingFilter !== null) && <div className='filter-button-notif'></div>}
					</div>
				</div>
			</div>
			<div className='content-settings'>
				<h2 className='content__title'>{nameCategory}</h2>
			</div>
			{searchInput && !items.length && (
				<div className='content__err'>
					<h2>Ничего не удалось найти 😓</h2>
				</div>
			)}
			{status === 'error' && !searchInput ? (
				<div className='content__err'>
					<h2>Произошла ошибка 😓</h2>
					<p>К сожалению, не удалось получить данные. Попробуйте повторить попытку позже.</p>
				</div>
			) : (
				<div className='content__items'>
					{status === 'loading'
						? [...new Array(6)].map((_, index) => <ProductBlockSkeleton key={index} />)
						: items.map((item: IProductBlock) => (
								<ProductBlock
									key={item.id}
									{...item}
									isAuth={isAuth}
									countProduct={countProduct}
									count={item?.count}
								/>
						  ))}
				</div>
			)}
			{status === 'success' && !items.length && !searchInput && (
				<h2 className='empty-items'>Нет таких товаров 😕</h2>
			)}

			{status == 'success' && allPages > 1 && <Pagination allPages={allPages} />}
		</div>
	)
}

export default Home
