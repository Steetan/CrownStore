import React from 'react'
import customAxios from '../../axios'
import { Link, useNavigate } from 'react-router-dom'
import { IProduct } from '../FullProduct'
import ButtonCart from '../../components/ButtonCart/ButtonCart'
import axios from 'axios'
import { RootState, useAppDispatch } from '../../redux/store'
import { setFetchFavorites } from '../../redux/slices/productSlice'
import { useSelector } from 'react-redux'

const Favorites = ({}) => {
	const { fetchFavorites } = useSelector((state: RootState) => state.productSlice)
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const getFavorites = () => {
		localStorage.getItem('token') &&
			customAxios.get(`${process.env.REACT_APP_SERVER_URL}/favorites/get`).then(({ data }) => {
				dispatch(setFetchFavorites(data))
			})
		!localStorage.getItem('token') &&
			JSON.parse(localStorage.getItem('arrFavorites') || '[]').length &&
			axios
				.get(`${process.env.REACT_APP_SERVER_URL}/favorites/get/arrbyid`, {
					params: { arrFavorites: localStorage.getItem('arrFavorites') },
				})
				.then(({ data }) => {
					dispatch(setFetchFavorites(data))
				})

		!localStorage.getItem('token') &&
			!JSON.parse(localStorage.getItem('arrFavorites') || '[]').length &&
			dispatch(setFetchFavorites([]))
	}

	React.useEffect(() => {
		getFavorites()
	}, [])

	const onDelFavorite = async (e: any, item: IProduct) => {
		e.stopPropagation()
		if (window.confirm('Вы действительно хотите удалить товар?')) {
			try {
				localStorage.getItem('token') &&
					(await customAxios.delete(`${process.env.REACT_APP_SERVER_URL}/favorites/${item.id}`))

				const updatedArrFavorites = JSON.parse(localStorage.getItem('arrFavorites') || '[]')

				await updatedArrFavorites.splice(updatedArrFavorites.indexOf(item.id), 1)
				await localStorage.setItem('arrFavorites', JSON.stringify(updatedArrFavorites))

				await getFavorites()
			} catch (error) {
				console.log(error)
			}
		}
	}

	const onDelAllFavorites = async () => {
		if (window.confirm('Вы действительно хотите удалить все?')) {
			try {
				localStorage.getItem('token') &&
					(await customAxios.delete(`${process.env.REACT_APP_SERVER_URL}/favorites/delete/all`))
				localStorage.removeItem('arrFavorites')
				await getFavorites()
			} catch (error) {
				console.log(error)
			}
		}
	}
	return (
		<div className='container container--cart'>
			<div className='favorites__top'>
				<h2 className='favorites__title'>Избранное</h2>
				{fetchFavorites.length > 1 ? (
					<h2 className='favorites__top-title' onClick={() => onDelAllFavorites()}>
						Удалить все
					</h2>
				) : (
					''
				)}
			</div>
			{fetchFavorites.length ? (
				<div className='favorites__blocks'>
					{fetchFavorites.map((item: any) => (
						<div
							key={item.id}
							className='favorites__block'
							onClick={() => navigate(`/product/${item.id}`)}
						>
							<div className='favorites__block-left'>
								<div className='orders__item-img'>
									<img
										src={`${process.env.REACT_APP_SERVER_URL}/uploads/productImg/${item.imgurl}`}
										alt='Product'
									/>
								</div>
								<h5 className='orders__item-title orders__item-title--favorites'>{item.title}</h5>
							</div>
							<div className='favorites__block-right'>
								<h5 className='orders__item-title'>
									{Math.floor(
										item.price - item.price * ((item.discount ? item.discount : 0) / 100),
									)}{' '}
									₽
								</h5>
								<ButtonCart
									id={item.id}
									price={item.price}
									discount={item.discount}
									title={item.title}
									imgurl={item.imgurl}
									count={item.count}
									isFavorites={true}
								/>
								<img
									onClick={(e) => onDelFavorite(e, item)}
									style={{ cursor: 'pointer', width: 20, marginLeft: 5 }}
									src={require('../../assets/delete-rev-icon.png')}
									alt='delete review'
									title='удалить отзыв'
								/>
							</div>
						</div>
					))}
				</div>
			) : (
				<h3 className='orders__block-title--empty'>Здесь пусто😦</h3>
			)}

			<Link to='/' className='button button--black button--orders'>
				<span>Вернуться на главную страницу</span>
			</Link>
		</div>
	)
}

export default Favorites
