import React from 'react'
import { Link } from 'react-router-dom'
import { IProductBlock } from '../../pages/Home'
import ButtonCart from '../ButtonCart/ButtonCart'
import customAxios from '../../axios'
import { IProduct } from '../../pages/FullProduct'
import { RootState } from '../../redux/store'
import { useSelector } from 'react-redux'
import { Tooltip } from 'react-tooltip'

export const ProductBlock: React.FC<IProductBlock> = ({
	id,
	title,
	imgurl,
	price,
	count,
	discount,
	rating,
}) => {
	const [isCheckedFavoriteMe, setIsCheckedFavoriteMe] = React.useState(false)
	const { fetchFavorites } = useSelector((state: RootState) => state.productSlice)

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

	React.useEffect(() => {
		setIsCheckedFavoriteMe(
			fetchFavorites?.filter((obj: IProduct) => obj.id === id).length ? true : false,
		)
	}, [fetchFavorites])

	return (
		count && (
			<div className='product-block'>
				<div className='product-block__top'>
					<Link to={`product/${id}`} title='посмотреть подробную информацию'>
						<div className='product-block__image'>
							<img
								src={`${process.env.REACT_APP_SERVER_URL}/uploads/productImg/${imgurl}`}
								alt='Product'
								onError={(e) => {
									e.currentTarget.src = require('../../assets/placeholder.jpg')
								}}
							/>
						</div>
					</Link>
					<h4 className='product-block__title'>{title}</h4>
				</div>
				<div>
					<div className='product-block__mid'>
						<p className='product-block__count'>В наличии {count} шт.</p>
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
					</div>
					<p className='product-block__rating'>{Number(rating).toFixed(1)}⭐</p>
					<div className='product-block__bottom'>
						{!Boolean(discount) && <div className='product-block__price'>{price} ₽</div>}
						{Boolean(discount) && (
							<div className='product-block__price product-block__price--discount'>
								<div className='product-block__price--discount-top'>
									<p>{price}₽</p>
									<span>{discount}%</span>
								</div>
								<h4>{Math.floor(price - price * ((discount ? discount : 0) / 100))} ₽</h4>
							</div>
						)}
						<ButtonCart
							id={id}
							price={price}
							discount={discount}
							title={title}
							imgurl={imgurl}
							count={count}
						/>
					</div>
				</div>
			</div>
		)
	)
}
