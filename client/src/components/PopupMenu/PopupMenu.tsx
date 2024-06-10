import React from 'react'
import { RootState, useAppDispatch } from '../../redux/store'
import { logout, setIsAdmin, setIsAuth, setUserImgUrl } from '../../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import customAxios from '../../axios'
import { useSelector } from 'react-redux'
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch'

interface IPopupMenu {
	isAuth: any
	setIsVisiblePopup: React.Dispatch<React.SetStateAction<boolean>>
}

export const PopupMenu: React.FC<IPopupMenu> = ({ isAuth, setIsVisiblePopup }) => {
	const [isVisibleMenu, setIsVisibleMenu] = React.useState(false)
	const [nickname, setNickname] = React.useState('')
	const { userImgUrl, isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	const menuRef = React.useRef<HTMLDivElement>(null)

	const dispatch = useAppDispatch()

	const navigate = useNavigate()

	const onOpenPopup = () => {
		window.scrollTo(0, 0)
		setIsVisiblePopup(true)
		document.body.classList.add('active')
	}

	React.useEffect(() => {
		try {
			if (isAuth) {
				const fetchUserImg = async () => {
					const { data } = await customAxios.get(`${process.env.REACT_APP_SERVER_URL}/auth/meinfo`)
					dispatch(setUserImgUrl(data.user_imgurl))
					setNickname(data.email)
				}
				fetchUserImg()
			}

			const handleClickOutSide = (event: MouseEvent) => {
				const _event = event as MouseEvent & {
					path: Node[]
				}

				if (menuRef.current && !_event.composedPath().includes(menuRef.current)) {
					setIsVisibleMenu(false)
				}
			}

			document.body.addEventListener('click', handleClickOutSide)

			return () => document.body.removeEventListener('click', handleClickOutSide)
		} catch (error) {
			console.log(error)
		}
	}, [isAuth])

	isDarkTheme
		? document.body.classList.add('dark-theme-wrapper')
		: document.body.classList.remove('dark-theme-wrapper')

	const resetUser = () => {
		window.localStorage.removeItem('token')
		navigate('/')
		setIsVisibleMenu(false)
	}

	const onClickItemLogout = async () => {
		if (window.confirm('Вы действительно хотите выйти?')) {
			await dispatch(setIsAdmin(false))
			await dispatch(setUserImgUrl(''))
			await dispatch(logout())
			await dispatch(setIsAuth(false))
			localStorage.getItem('arrService') && localStorage.removeItem('arrService')
			resetUser()
		}
	}

	return (
		<div className='popup-menu-wrap'>
			{isAuth && (
				<div className='btn-avatar' onClick={() => setIsVisibleMenu(!isVisibleMenu)} ref={menuRef}>
					{userImgUrl && (
						<img
							className='btn-avatar-img'
							src={`${process.env.REACT_APP_SERVER_URL}/uploads/userIcons/${userImgUrl}`}
							alt='ava'
						/>
					)}
					{!userImgUrl && (
						<svg
							version='1.0'
							xmlns='http://www.w3.org/2000/svg'
							width='512.000000pt'
							style={{ height: 'auto', width: 50 }}
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
				</div>
			)}

			<div
				className={
					isVisibleMenu
						? isDarkTheme
							? 'popup-menu  popup-enter-active dark-theme-background dark-theme'
							: 'popup-menu  popup-enter-active'
						: isDarkTheme
						? 'popup-menu  popup-exit-active dark-theme-background dark-theme'
						: 'popup-menu popup-exit-active'
				}
			>
				{isAuth && (
					<p className='popup-menu-info-user'>
						Вы вошли как <br />
						<b className={isDarkTheme ? 'dark-theme-font' : ''}>{nickname}</b>
					</p>
				)}
				<ThemeSwitch />
				<ul className='popup-menu-list'>
					<li className='popup-menu-item' onClick={() => navigate('/orders')}>
						Заказы
					</li>
					<li className='popup-menu-item' onClick={() => onOpenPopup()}>
						Предложить идею
					</li>
					<li className='popup-menu-item' onClick={() => navigate('/settings')}>
						Настройки
					</li>
					<li className='popup-menu-item' onClick={onClickItemLogout}>
						Выйти
					</li>
				</ul>
			</div>
		</div>
	)
}

export default PopupMenu
