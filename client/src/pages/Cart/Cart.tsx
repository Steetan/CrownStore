import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
	getCart,
	selectCart,
	setTotalCount,
	setTotalPrice,
	setTotalPriceServices,
} from '../../redux/slices/cartSlice'
import { RootState, useAppDispatch } from '../../redux/store'
import customAxios from '../../axios'

import cartIcon from '../../assets/cart-b.svg'
import cartIconWhite from '../../assets/cart.svg'
import trashIcon from '../../assets/trash.svg'

import { CartItem, CartEmpty } from '../../components'
import { selectIsAuth } from '../../redux/slices/authSlice'
import DeliveryBlock from '../../components/DeliveryBlock/DeliveryBlock'
import ServiceBlock from '../../components/ServiceBlock/ServiceBlock'
import { getDate } from '../../utils/getDate'

export interface IService {
	id: string
	title: string
	description: string
	price: number
}

const Cart: React.FC = () => {
	const { totalPrice, cartItems } = useSelector(selectCart)
	const [countAllCart, setCountAllCart] = React.useState(0)
	const [countNoActiveCart, setCountNoActiveCart] = React.useState(0)
	const [address, setAddress] = React.useState('')
	const isAuth = useSelector(selectIsAuth)
	const [fetchServices, setFetchServices] = React.useState<IService[]>([])
	const { isCheckedAddress } = useSelector((state: RootState) => state.cartSlice)
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	const dispatch = useAppDispatch()

	const getProductsCart = async () => {
		let totalPrice = 0

		dispatch(getCart()).then((data) => {
			let count = 0
			dispatch(setTotalCount(data.payload.results.length))
			data.payload.results.forEach((item: any) => {
				count = count + item.totalcount
				totalPrice += item.res_price * item.totalcount
				!item.count && setCountNoActiveCart(countNoActiveCart + 1)
			})
			setCountAllCart(count)
			dispatch(setTotalPrice(totalPrice))
		})
	}

	const getServices = async () => {
		await customAxios.get(`${process.env.REACT_APP_SERVER_URL}/services/all`).then(({ data }) => {
			setFetchServices(data)
		})
	}

	React.useEffect(() => {
		getProductsCart()
		getServices()
	}, [])

	if (!isAuth) {
		return <Navigate to='/auth/login' />
	}

	if (!cartItems.length) {
		return <CartEmpty />
	}

	const cleanCart = async () => {
		if (window.confirm('Вы действительно хотите очистить корзину?')) {
			await dispatch(setTotalPriceServices(0))
			await customAxios.delete('/cart/delete')
			await getProductsCart()
		}
	}

	const cleanCartBuy = async () => {
		const serviceEmailString = localStorage.getItem('arrService')
		const serviceEmail = serviceEmailString ? JSON.parse(serviceEmailString) : []

		const updatedServiceEmail = Array.isArray(serviceEmail)
			? serviceEmail.map((str: string) => str.replace(/"/g, "'"))
			: []

		await customAxios.post('/orders', {
			date: getDate(),
			sum: totalPrice,
			cartItems,
			serviceItems: localStorage.getItem('arrService')
				? fetchServices.filter((obj: IService) =>
						localStorage.getItem('arrService')?.includes(obj.id),
				  )
				: [],
		})
		await customAxios.post(
			'/email',
			isCheckedAddress
				? { address, services: updatedServiceEmail, totalPrice }
				: { address: '', services: updatedServiceEmail, totalPrice },
		)

		await dispatch(setTotalPriceServices(0))
		await customAxios.delete('/cart/delete')
		await getProductsCart()
	}

	return (
		<div className='container container--cart'>
			<div className='cart'>
				<div className='cart__top'>
					<h2 className='content__title'>
						<img
							style={{ width: 30, marginRight: 10 }}
							src={isDarkTheme ? cartIconWhite : cartIcon}
							alt='cart'
						/>
						Корзина
					</h2>
					<button onClick={cleanCart} className='cart__clear'>
						<img src={trashIcon} alt='' />
						<span>Очистить корзину</span>
					</button>
				</div>
				<div className='content__items content__items--cart'>
					{cartItems.map((item: any) =>
						item.totalcount ? (
							<CartItem
								noActive={false}
								key={item.id}
								id={item.product_id}
								title={item.title}
								imgurl={item.imgurl}
								setCountAllCart={setCountAllCart}
								countProduct={item.count}
							/>
						) : (
							''
						),
					)}
					{countNoActiveCart ? (
						<div className='cart__noactive-block'>
							<h2>Временно недоступно</h2>
							{cartItems.map((item: any) =>
								!item.totalcount ? (
									<CartItem
										noActive={true}
										key={item.id}
										id={item.product_id}
										title={item.title}
										imgurl={item.imgurl}
										setCountAllCart={setCountAllCart}
										countProduct={item.count}
									/>
								) : (
									''
								),
							)}
						</div>
					) : (
						''
					)}
				</div>
				<div className='cart__bottom-details cart__bottom-details--product-count'>
					<span>
						{' '}
						Всего: <b>{countAllCart} шт.</b>{' '}
					</span>
				</div>
				<div className='services'>
					<div className='services-left'>
						<h3 className='services__title'>Услуги</h3>
					</div>

					<div className='services__blocks'>
						{fetchServices.map((item: IService) => (
							<ServiceBlock {...item} />
						))}
					</div>
				</div>

				<div className='cart__bottom'>
					<div className='cart__bottom-details'>
						<span>
							{' '}
							Сумма заказа: <b>{totalPrice} ₽</b>{' '}
						</span>
					</div>
					<DeliveryBlock setAddress={setAddress} />
					<div className='cart__bottom-buttons'>
						<Link
							to='/'
							className='button button--outline button--outline--cart button--add go-back-btn'
						>
							<svg
								width='8'
								height='14'
								viewBox='0 0 8 14'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M7 13L1 6.93015L6.86175 1'
									stroke='#D3D3D3'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>

							<span>Вернуться назад</span>
						</Link>
						<Link to='/resultbuy' className='button pay-btn' onClick={cleanCartBuy}>
							<span>Оплатить сейчас</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Cart
