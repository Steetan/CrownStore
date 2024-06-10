import React from 'react'
import customAxios from '../../axios'
import { Link } from 'react-router-dom'
import OrderItem from '../../components/OrderItem/OrderItem'
import { translateDate } from '../../utils/translateDate'

export interface IOrder {
	id: string
	date: Date
	status: string
	sum: number
}

const Orders = ({}) => {
	const [fetchOrders, setFetchOrders] = React.useState<IOrder[]>([])

	React.useEffect(() => {
		customAxios.get('/orders/byid').then(({ data }) => {
			setFetchOrders(data)
			setFetchOrders(translateDate(data))
		})
	}, [])
	return (
		<div className='container container--cart'>
			<h2 className='content__title content__title--orders'>Заказы</h2>
			{fetchOrders.filter((item) => item.status === 'активный').length ? (
				<div className='orders__block'>
					<h4 className='orders__block-title'>Активные</h4>
					{fetchOrders
						.filter((item) => item.status === 'активный')
						.map((item) => (
							<OrderItem {...item} />
						))}
				</div>
			) : (
				<h3 className='orders__block-title--empty'>У вас нет активных заказов😦</h3>
			)}
			{fetchOrders.filter((item) => item.status === 'отменен').length ? (
				<div className='orders__block'>
					<h4 className='orders__block-title'>Отмененные заказы</h4>
					{fetchOrders
						.filter((item) => item.status === 'отменен')
						.map((item) => (
							<OrderItem {...item} />
						))}
				</div>
			) : (
				''
			)}
			{fetchOrders.filter((item) => item.status === 'завершен').length ? (
				<div className='orders__block'>
					<h4 className='orders__block-title'>История покупок</h4>
					{fetchOrders
						.filter((item) => item.status === 'завершен')
						.map((item) => (
							<OrderItem {...item} />
						))}
				</div>
			) : (
				''
			)}
			<Link to='/' className='button button--black button--orders'>
				<span>Вернуться на главную страницу</span>
			</Link>
		</div>
	)
}

export default Orders
