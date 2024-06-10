import React from 'react'
import { useNavigate } from 'react-router-dom'
import customAxios from '../../axios'
import { Collapse } from 'react-collapse'

export interface IOrderProduct {
	id: string
	order_id: string
	product_id: string
	product_title: string
	product_count: number
	product_price: number
	product_img: string
}

export interface IOrderService {
	id: string
	order_id: string
	service_id: string
	service_title: string
	service_price: number
}

const FullOrderItem: React.FC<{ id: string; isVisibleCollapse: boolean }> = ({
	id,
	isVisibleCollapse,
}) => {
	const [fetchProducts, setFetchProducts] = React.useState<IOrderProduct[]>([])
	const [fetchServices, setFetchServices] = React.useState<IOrderService[]>([])

	const navigate = useNavigate()

	React.useEffect(() => {
		customAxios.get(`/orders/info/${id}`).then(({ data }) => {
			setFetchProducts(data.products)
			setFetchServices(data.services)
		})
	}, [])

	return (
		<Collapse isOpened={isVisibleCollapse}>
			<div className='fullorder'>
				<div className='orders__block'>
					<h4 className='orders__block-title'>Товары</h4>
					{fetchProducts?.map((item: IOrderProduct) => (
						<div
							className='orders__item'
							title='перейти к описанию товара'
							onClick={() => navigate(`/product/${item.product_id}`)}
						>
							<div className='orders__item-left'>
								<div className='orders__item-img'>
									<img
										src={`${process.env.REACT_APP_SERVER_URL}/uploads/productImg/${item.product_img}`}
										alt='Product'
									/>
								</div>
								<p className='orders__item-title'>{item.product_title}</p>
							</div>
							<div className='orders__item-right'>
								<p>{item.product_count} шт.</p>
								<p>{item.product_count * item.product_price} ₽</p>
							</div>
						</div>
					))}
				</div>
				{Boolean(fetchServices.length) ? (
					<div className='orders__block'>
						<h4 className='orders__block-title'>Услуги</h4>
						{fetchServices?.map((item: IOrderService) => (
							<div className='orders__item orders__item--service'>
								<p>{item.service_title}</p>
								<p>{item.service_price} ₽</p>
							</div>
						))}
					</div>
				) : (
					''
				)}
			</div>
		</Collapse>
	)
}

export default FullOrderItem
