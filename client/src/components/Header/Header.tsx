import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search } from '../Search/Search'
import { useSelector } from 'react-redux'
import { selectCart } from '../../redux/slices/cartSlice'
import { setSearchInput } from '../../redux/slices/filterSlice'
import { fetchAdminMe, setIsAdmin, setIsDarkTheme } from '../../redux/slices/authSlice'
import PopupMenu from '../PopupMenu/PopupMenu'
import { RootState, useAppDispatch } from '../../redux/store'
import customAxios from '../../axios'
import EmailPopup from '../EmailPopup/EmailPopup'
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch'
import { Tooltip } from 'react-tooltip'

export const Header: React.FC = () => {
	const isAuth = localStorage.getItem('token')
	const { totalPrice } = useSelector(selectCart)
	const { totalCount } = useSelector((state: RootState) => state.cartSlice)
	const { isAdmin, isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	const location = useLocation()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const [isVisiblePopup, setIsVisiblePopup] = React.useState(false)

	const isNotHomePage =
		location.pathname === '/auth/login' ||
		location.pathname === '/auth/reg' ||
		location.pathname === '/settings' ||
		location.pathname === '/adminpanel' ||
		location.pathname === '/favorites' ||
		location.pathname === '/orders'

	React.useEffect(() => {
		try {
			localStorage.getItem('isDarkTheme') === 'false'
				? dispatch(setIsDarkTheme(false))
				: dispatch(setIsDarkTheme(true))

			localStorage.getItem('token') &&
				customAxios.get('/auth/meinfo').then(({ data }) => {
					!data && localStorage.removeItem('token')
					!localStorage.getItem('token') && dispatch(setIsDarkTheme(data.dark_theme))
					!localStorage.getItem('token') && localStorage.setItem('isDarkTheme', data.dark_theme)
				})
		} catch (error) {
			console.log(error)
		}
	}, [])

	React.useEffect(() => {
		try {
			dispatch(fetchAdminMe()).then((data) => {
				data.payload.error ? dispatch(setIsAdmin(false)) : dispatch(setIsAdmin(true))
			})
		} catch (error) {
			console.log(error)
		}
	}, [dispatch])

	return (
		<div className={isDarkTheme ? 'header dark-theme-background dark-theme' : 'header'}>
			<div className='container'>
				<Link to='/' className='header__logo'>
					<img width='38' src={require('../../assets/logo.png')} alt='Product logo' />
					<div>
						<h1>Crown Store</h1>
						<p>быстро и удобно</p>
					</div>
				</Link>
				{location.pathname !== '/cart' && location.pathname === '/' && !isNotHomePage && <Search />}

				<div className='header__btns'>
					{!isAuth && !isNotHomePage && (
						<>
							<ThemeSwitch />
							<Link to='/auth/login' className='button button--cart'>
								Войти
							</Link>
						</>
					)}

					{isAuth && !isNotHomePage && (
						<>
							<Link
								to='/cart'
								onClick={() => dispatch(setSearchInput(''))}
								className='button button--cart'
							>
								<svg
									width='18'
									height='18'
									viewBox='0 0 18 18'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M6.33333 16.3333C7.06971 16.3333 7.66667 15.7364 7.66667 15C7.66667 14.2636 7.06971 13.6667 6.33333 13.6667C5.59695 13.6667 5 14.2636 5 15C5 15.7364 5.59695 16.3333 6.33333 16.3333Z'
										stroke='white'
										strokeWidth='1.8'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									<path
										d='M14.3333 16.3333C15.0697 16.3333 15.6667 15.7364 15.6667 15C15.6667 14.2636 15.0697 13.6667 14.3333 13.6667C13.597 13.6667 13 14.2636 13 15C13 15.7364 13.597 16.3333 14.3333 16.3333Z'
										stroke='white'
										strokeWidth='1.8'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									<path
										d='M4.78002 4.99999H16.3334L15.2134 10.5933C15.1524 10.9003 14.9854 11.176 14.7417 11.3722C14.4979 11.5684 14.1929 11.6727 13.88 11.6667H6.83335C6.50781 11.6694 6.1925 11.553 5.94689 11.3393C5.70128 11.1256 5.54233 10.8295 5.50002 10.5067L4.48669 2.82666C4.44466 2.50615 4.28764 2.21182 4.04482 1.99844C3.80201 1.78505 3.48994 1.66715 3.16669 1.66666H1.66669'
										stroke='white'
										strokeWidth='1.8'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
								<span>{totalCount}</span>
								<div className='button__delimiter'></div>
								<span>{totalPrice} ₽</span>
							</Link>
							<Tooltip anchorSelect='.button--cart' place='bottom'>
								Корзина
							</Tooltip>
						</>
					)}

					<div className='header__btns-right'>
						{!isNotHomePage && (
							<>
								<img
									src={require('../../assets/favorites.png')}
									className='favorites__btn'
									alt='favorites'
									onClick={() => navigate('/favorites')}
								/>
								<Tooltip anchorSelect='.favorites__btn' place='bottom'>
									Избранное
								</Tooltip>
							</>
						)}

						{isAdmin && !isNotHomePage && (
							<>
								<Link to='/adminpanel' className='button-adminpanel'>
									<img
										style={{ width: 50 }}
										src={require('../../assets/adminIcon.png')}
										alt='admin'
									/>
								</Link>
								<Tooltip anchorSelect='.button-adminpanel' place='bottom'>
									Админ Панель
								</Tooltip>
							</>
						)}

						<PopupMenu isAuth={isAuth} setIsVisiblePopup={setIsVisiblePopup} />
						<EmailPopup
							setIsVisiblePopup={setIsVisiblePopup}
							isVisiblePopup={isVisiblePopup}
							title='Предложение'
							titleDesc='Описание'
							titleDescError='Укажите идею'
							titleBtn='Отправить предложение'
							url={`idea`}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
