import React from 'react'
import customAxios from '../../axios'
import { IOrderProduct, IOrderService } from '../FullOrderItem/FullOrderItem'
import { RootState } from '../../redux/store'
import { useSelector } from 'react-redux'

interface IInfoOrdersPopup {
	orderid: string
	isVisiblePopup: boolean
	setIsVisiblePopup: React.Dispatch<React.SetStateAction<boolean>>
}

const InfoOrdersPopup: React.FC<IInfoOrdersPopup> = ({
	orderid,
	isVisiblePopup,
	setIsVisiblePopup,
}) => {
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	const [fetchProducts, setFetchProducts] = React.useState<IOrderProduct[]>([])
	const [fetchServices, setFetchServices] = React.useState<IOrderService[]>([])

	const onClosePopup = () => {
		setIsVisiblePopup(false)
		document.body.classList.remove('active')
	}

	React.useEffect(() => {
		setFetchProducts([])
		setFetchServices([])

		if (isVisiblePopup) {
			customAxios.get(`/orders/info/${orderid}`).then(({ data }) => {
				setFetchProducts(data.products)
				setFetchServices(data.services)
			})

			document.body.classList.add('active')
		}
	}, [isVisiblePopup])

	return (
		isVisiblePopup && (
			<div className='popup-update__wrapper'>
				<div
					className={
						isDarkTheme
							? 'popup-update popup-update--orders dark-theme-background'
							: 'popup-update popup-update--orders'
					}
				>
					<div className='popup-update__close-wrap' onClick={onClosePopup}>
						<div className='popup-update__close'></div>
					</div>
					<div className='popup-update__block--orders'>
						<h3 className='popup-update__title'>Продукты</h3>
						{fetchProducts.map((item: IOrderProduct) => (
							<div className='popup-update__order-item'>
								<div className='popup-update__order-left'>
									<img
										src={`${process.env.REACT_APP_SERVER_URL}/uploads/productImg/${item.product_img}`}
										alt='Product'
										onError={(e) => {
											e.currentTarget.src = require('../../assets/placeholder.jpg')
										}}
									/>
									<p className='popup-update__order-name'>{item.product_title}</p>
								</div>
								<div className='popup-update__order-right'>
									<p>{item.product_price} ₽</p>
									<p>{item.product_count} шт.</p>
								</div>
							</div>
						))}
					</div>
					{fetchServices.length ? (
						<div className='popup-update__block--orders popup-update__block--orders-services'>
							<h3 className='popup-update__title'>Услуги</h3>
							{fetchServices.map((item: IOrderService) => (
								<div className='popup-update__order-item'>
									<p>{item.service_title}</p>
									<p className='popup-update__price'>{item.service_price} ₽</p>
								</div>
							))}
						</div>
					) : (
						''
					)}
				</div>
			</div>
		)
	)
}

export default InfoOrdersPopup
