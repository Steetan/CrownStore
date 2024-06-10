import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../../redux/store'

const Footer = () => {
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)

	return (
		<div className={isDarkTheme ? 'footer dark-theme-background dark-theme' : 'footer'}>
			<div className='footer__left'>
				<Link to='/' className='header__logo footer__logo'>
					<h1>Crown Store</h1>
				</Link>
				<p>© 2024. Официальный сайт Сервис-Кроны</p>
			</div>
			<div className='footer__info'>
				<h3 className='footer__info-title'>Информация о нас</h3>
				<p className='footer__info-text'>
					Адрес: г.Торжок, 1 пер. Металлистов, д.11 (цокольный этаж)
				</p>
				<p className='footer__info-text'>Телефон: 8 (960) 716-69-22</p>
				<div className='footer__info-link'>
					<p className='footer__info-text'>Мы в VK:</p>
					<a href='https://vk.com/skrona' title='перейти в вк'>
						<img className='footer__info-img' src={require('../../assets/vk-icon.png')} alt='vk' />
					</a>
				</div>
			</div>
		</div>
	)
}

export default Footer
