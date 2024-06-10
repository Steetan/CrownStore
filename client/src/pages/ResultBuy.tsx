import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

const ResultBuy = ({}) => {
	const { isCheckedAddress } = useSelector((state: RootState) => state.cartSlice)

	return (
		<div className='resultbuy'>
			<h1 className='resultbuy__title'>Спасибо за покупку!🤩</h1>
			<br />
			{isCheckedAddress ? (
				<h6 className='resultbuy__subtitle'>Ожидайте, ваш заказ скоро придет</h6>
			) : (
				<h6 className='resultbuy__subtitle'>
					Заказ можно забрать по адресу:
					<br /> г.Торжок, 1 пер. Металлистов, д.11 (цокольный этаж)
				</h6>
			)}
		</div>
	)
}

export default ResultBuy
