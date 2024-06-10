import React from 'react'
import FullOrderItem from '../FullOrderItem/FullOrderItem'

interface IOrderItem {
	id: string
	date: Date
	sum: number
}

const OrderItem: React.FC<IOrderItem> = ({ id, date, sum }) => {
	const [isVisibleCollapse, setIsVisibleCollapse] = React.useState(false)

	return (
		<>
			<div
				key={id}
				className='orders__item'
				onClick={() => setIsVisibleCollapse(!isVisibleCollapse)}
			>
				<h5 className='orders__item-title'>{id}</h5>
				<h5 className='orders__item-title'>{String(date)}</h5>
				<h5 className='orders__item-title'>{sum} ₽</h5>
			</div>
			<FullOrderItem id={id} isVisibleCollapse={isVisibleCollapse} />
		</>
	)
}

export default OrderItem
