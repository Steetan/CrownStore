import React from 'react'
import { IReview } from '../Reviews/Reviews'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { IProduct } from '../../pages/FullProduct'
import EmailPopup from '../EmailPopup/EmailPopup'
import customAxios from '../../axios'

interface IReviewBlock {
	item: IReview
	onDelReview: (item: IReview) => void
	idUser: string
	dataProduct: IProduct
}

interface ReviewLike {
	id: string
	product_id: string
	user_id: string
	review_id: string
}

const ReviewBlock: React.FC<IReviewBlock> = ({ item, onDelReview, idUser, dataProduct }) => {
	const [isFullText, setIsFullText] = React.useState(false)
	const { isAdmin, isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	const [isVisiblePopup, setIsVisiblePopup] = React.useState(false)
	// const [fetchReviewLikes, setFetchReviewsLikes] = React.useState<ReviewLike[]>([])
	const [isPressLike, setIsPressLike] = React.useState(false)
	const [countPressLike, setCountPressLike] = React.useState(0)

	const onOpenPopup = () => {
		window.scrollTo(0, 0)
		setIsVisiblePopup(true)
		document.body.classList.add('active')
	}

	const getReviewLikes = () => {
		try {
			customAxios
				.get(`${process.env.REACT_APP_SERVER_URL}/reviews/likes/${item.id}`)
				.then(({ data }) => {
					setCountPressLike(data.filter((obj: ReviewLike) => obj.review_id === item.id).length)
				})
		} catch (error) {
			console.log(error)
		}
	}

	const getReviewMeLikes = () => {
		try {
			customAxios
				.get(`${process.env.REACT_APP_SERVER_URL}/reviews/likes/me/${item.id}`)
				.then(({ data }) => (data.length ? setIsPressLike(true) : setIsPressLike(false)))
		} catch (error) {
			console.log(error)
		}
	}

	React.useEffect(() => {
		getReviewLikes()
		getReviewMeLikes()
	}, [])

	const onPushLike = async () => {
		try {
			!isPressLike
				? await customAxios
						.post(`${process.env.REACT_APP_SERVER_URL}/reviews/likes/${item.id}`, {
							product_id: dataProduct.id,
						})
						.then(() => {
							setCountPressLike(countPressLike + 1)
							setIsPressLike(true)
						})
				: await customAxios
						.delete(`${process.env.REACT_APP_SERVER_URL}/reviews/likes/${item.id}`)
						.then(() => {
							setCountPressLike(countPressLike - 1)
							setIsPressLike(false)
						})
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className='reviews__block' key={item.id}>
			{item.user_imgurl && (
				<img
					src={`${process.env.REACT_APP_SERVER_URL}/uploads/userIcons/${item.user_imgurl}`}
					alt='ava'
					className='reviews__block-img'
				/>
			)}
			{!item.user_imgurl && (
				<svg
					version='1.0'
					xmlns='http://www.w3.org/2000/svg'
					width='512.000000pt'
					style={{ width: 50, height: 'auto' }}
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
							d='M2377 5104 c-93 -14 -240 -60 -322 -101 -151 -75 -310 -209 -414
-348 -118 -156 -205 -387 -219 -582 -16 -225 20 -410 118 -608 165 -334 471
-560 840 -620 278 -45 560 15 801 170 292 189 492 521 517 862 16 219 -20 409
-112 598 -91 185 -225 341 -388 448 -105 70 -161 97 -274 136 -169 58 -364 74
-547 45z'
						/>
						<path
							d='M2320 2545 c-358 -44 -699 -184 -992 -406 -106 -81 -286 -260 -366
-366 -231 -305 -371 -653 -411 -1025 -23 -212 -12 -325 45 -444 59 -125 178
-229 313 -276 l66 -23 1585 0 1585 0 66 23 c135 47 254 151 313 276 57 119 68
232 45 444 -40 372 -180 720 -411 1025 -80 106 -260 285 -366 366 -426 323
-958 469 -1472 406z'
						/>
					</g>
				</svg>
			)}
			<div className='reviews__block-desc'>
				<div className='reviews__block-top'>
					<div className='reviews__block-left'>
						<p>{item.name_user ? item.name_user : 'Пользователь'}</p>
						<p>{item.fname_user}</p>
						<p>{item.count_stars}⭐</p>
					</div>
					{(idUser === item.user_id || isAdmin) && (
						<img
							onClick={() => onDelReview(item)}
							style={{ cursor: 'pointer', width: 20, marginLeft: 5 }}
							src={require('../../assets/delete-rev-icon.png')}
							alt='delete review'
							title='удалить отзыв'
						/>
					)}

					{idUser !== item.user_id && !isAdmin && (
						<img
							onClick={() => onOpenPopup()}
							style={{ cursor: 'pointer', width: 20, marginLeft: 5 }}
							src={require('../../assets/complaint.png')}
							alt='complaint review'
							title='пожаловаться'
						/>
					)}
				</div>
				<div>
					<p className='reviews__block-text'>
						{isFullText
							? item.description
							: item.description.length < 210
							? item.description
							: item.description.slice(0, 210) + '...'}
					</p>
					{item.description.length >= 210 && (
						<p className='reviews__block-btn' onClick={() => setIsFullText(!isFullText)}>
							{!isFullText ? 'Читать далее' : 'Свернуть'}
						</p>
					)}
				</div>
				<p className='reviews__block-date'>{item.date}</p>
				<div className='reviews__block-bottom' onClick={() => onPushLike()}>
					<svg
						className='reviews__block-like'
						fill={isPressLike ? 'red' : '#ccc'}
						height='800px'
						width='800px'
						version='1.1'
						id='Capa_1'
						xmlns='http://www.w3.org/2000/svg'
						xmlnsXlink='http://www.w3.org/1999/xlink'
						viewBox='0 0 51.997 51.997'
						xmlSpace='preserve'
					>
						<path
							d='M51.911,16.242C51.152,7.888,45.239,1.827,37.839,1.827c-4.93,0-9.444,2.653-11.984,6.905
	c-2.517-4.307-6.846-6.906-11.697-6.906c-7.399,0-13.313,6.061-14.071,14.415c-0.06,0.369-0.306,2.311,0.442,5.478
	c1.078,4.568,3.568,8.723,7.199,12.013l18.115,16.439l18.426-16.438c3.631-3.291,6.121-7.445,7.199-12.014
	C52.216,18.553,51.97,16.611,51.911,16.242z'
						/>
					</svg>
					<h6>{countPressLike}</h6>
				</div>
			</div>
			<EmailPopup
				setIsVisiblePopup={setIsVisiblePopup}
				isVisiblePopup={isVisiblePopup}
				dataProduct={dataProduct}
				title='Жалоба'
				titleDesc='Причина жалобы'
				titleDescError='Укажите причину жалобы'
				titleBtn='Отправить жалобу'
				url={`complaint/${item?.id}`}
			/>
		</div>
	)
}

export default ReviewBlock
