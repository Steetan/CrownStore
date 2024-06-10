import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './homeSlider.scss'
import { useAppDispatch } from '../../redux/store'
import { setCategoryId, setNameCategory } from '../../redux/slices/filterSlice'
import customAxios from '../../axios'
import { setItems } from '../../redux/slices/productSlice'
import { arrCategories } from '../Categories/Categories'

export const HomeSlider = ({}) => {
	const dispatch = useAppDispatch()

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 7000,
	}

	const selectCategoryPC = () => {
		dispatch(setCategoryId(2))
		dispatch(setNameCategory(arrCategories[2]))
	}

	const selectCategoryVideocart = () => {
		dispatch(setCategoryId(4))
		dispatch(setNameCategory(arrCategories[4]))
	}
	const selectCategoryPrinter = () => {
		dispatch(setCategoryId(7))
		dispatch(setNameCategory(arrCategories[7]))
	}

	const selectCategoriesPerip = () => {
		dispatch(setCategoryId(0))
		dispatch(setNameCategory('Аксессуары'))

		customAxios.get(`${process.env.REACT_APP_SERVER_URL}/perip`).then(({ data }: any) => {
			dispatch(setItems(data))
		})
	}

	return (
		<Slider className='slider' {...settings}>
			<div className='slider-item slider-item--1' onClick={selectCategoryPC}>
				<div className='slider-desc-block'>
					<h3>Улучшите свой рабочий процесс с лучшими компьютерами</h3>
					<p>
						Откройте для себя мощные компьютеры, которые помогут вам повысить эффективность работы.
					</p>
				</div>
				<div className='slider-img'>
					<img src={require('../../assets/slider/pc.png')} alt='' />
				</div>
			</div>
			<div className='slider-item slider-item--2' onClick={selectCategoryVideocart}>
				<div className='slider-desc-block'>
					<h3>Повысь производительность своего компьютера с нашими видеокартами!</h3>
					<p>
						Невероятно быстрая и стабильная работа вашего ПК с нашими качественными видеокартами.
					</p>
				</div>
				<div className='slider-img'>
					<img src={require('../../assets/slider/videocart.png')} alt='' />
				</div>
			</div>
			<div className='slider-item slider-item--3' onClick={selectCategoriesPerip}>
				<div className='slider-desc-block'>
					<h3>Уникальные аксессуары для максимального удовольствия от использования компьютера!</h3>
					<p>
						Найдите идеальное сочетание стиля, функциональности и качества в нашем разнообразном
						ассортименте периферийных устройств.
					</p>
				</div>
				<div className='slider-img'>
					<img src={require('../../assets/slider/peref.png')} alt='' />
				</div>
			</div>
			<div className='slider-item slider-item--4' onClick={selectCategoryPrinter}>
				<div className='slider-desc-block'>
					<h3>Распечатай свои цифровые идеи с принтерами от нашего магазина!</h3>
					<p>
						Лучшие принтеры по доступным ценам. Превратите свои цифровые файлы в реальность с нашим
						широким ассортиментом.
					</p>
				</div>
				<div className='slider-img'>
					<img src={require('../../assets/slider/printer.png')} alt='' />
				</div>
			</div>
		</Slider>
	)
}

export default HomeSlider
