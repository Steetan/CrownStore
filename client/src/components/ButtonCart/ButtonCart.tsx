import React from 'react'
import { RootState, useAppDispatch } from '../../redux/store'
import { useSelector } from 'react-redux'
import customAxios from '../../axios'
import { setTotalCount, setTotalPrice } from '../../redux/slices/cartSlice'

const ButtonCart: React.FC<{
	id: string | undefined
	price: number
	discount: number | undefined
	title: string
	imgurl: string
	count: number
	isFavorites?: boolean
}> = ({ id, price, discount, title, imgurl, count, isFavorites }) => {
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	const { countProduct } = useSelector((state: RootState) => state.cartSlice)
	const dispatch = useAppDispatch()
	const [targetProduct, setTargetProduct] = React.useState<{ product: string; count: number }>({
		product: '',
		count: 0,
	})
	const { totalCount, totalPrice } = useSelector((state: RootState) => state.cartSlice)

	React.useEffect(() => {
		if (countProduct) {
			const target = countProduct.find((product) => product.product === id)
			setTargetProduct(target ?? { product: 'id', count: 0 })
		}
	}, [countProduct, id])

	const onClickAdd = async (e: any) => {
		e.stopPropagation()
		if (targetProduct.count < count) {
			customAxios
				.get('/cart/getbyid', {
					params: {
						product: id,
					},
				})
				.then(({ data }) => {
					!data.value && dispatch(setTotalCount(totalCount + 1))
					dispatch(
						setTotalPrice(
							totalPrice + Math.floor(price - price * ((discount ? discount : 0) / 100)),
						),
					)
					if (targetProduct) {
						const newCount = targetProduct.count + 1
						setTargetProduct({ ...targetProduct, count: newCount })
					}
					if (!data.value) {
						return customAxios.post('/cart', {
							product: id,
							price: Math.floor(price - price * ((discount ? discount : 0) / 100)),
							act: 'push',
							title,
							imgurl,
						})
					} else if (data.value) {
						return customAxios.patch('/cart/update', {
							productid: id,
							act: 'plus',
						})
					}
				})
		}
	}

	return (
		localStorage.getItem('token') &&
		(count ? (
			<button
				onClick={(e: any) => onClickAdd(e)}
				className={
					isDarkTheme
						? isFavorites
							? 'button button--outline button--add button--add--favorites dark-theme-background'
							: 'button button--outline button--add dark-theme-background'
						: isFavorites
						? 'button button--outline button--add button--add--favorites'
						: 'button button--outline button--add'
				}
			>
				<span>Добавить</span>
				{targetProduct.count !== 0 && <i>{targetProduct.count}</i>}
			</button>
		) : (
			'Нет в наличии'
		))
	)
}

export default ButtonCart
