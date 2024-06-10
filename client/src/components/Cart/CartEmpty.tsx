import React from 'react'
import { Link } from 'react-router-dom'

export const CartEmpty: React.FC = () => {
	return (
		<div className='cart cart--empty'>
			<h2>Корзина пустая</h2>
			<p>
				Вероятней всего, вы еще ничего не заказывали.
				<br />
				Перейди на главную страницу, чтобы сделать первый заказ.
			</p>
			<img src={require('../../assets/empty-cart.png')} alt='Empty cart' />
			<Link to='/' className='button button--black'>
				<span>Вернуться назад</span>
			</Link>
		</div>
	)
}
