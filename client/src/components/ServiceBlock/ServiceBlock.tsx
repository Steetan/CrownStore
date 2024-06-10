import React from 'react'
import { FormControlLabel, Switch } from '@mui/material'
import { RootState, useAppDispatch } from '../../redux/store'
import { useSelector } from 'react-redux'
import { selectCart, setTotalPrice, setTotalPriceServices } from '../../redux/slices/cartSlice'

const ServiceBlock: React.FC<{
	id: string
	title: string
	description: string
	price: number
}> = ({ id, title, description, price }) => {
	const [isChecked, setIsChecked] = React.useState(false)
	const { totalPrice } = useSelector(selectCart)
	const { totalPriceServices } = useSelector((state: RootState) => state.cartSlice)

	const dispatch = useAppDispatch()

	React.useEffect(() => {
		dispatch(setTotalPriceServices(0))
	}, [])

	const onChangeSwitch = (event: any) => {
		setIsChecked(event.target.checked)
		const updatedArrService = JSON.parse(localStorage.getItem('arrService') || '[]')

		if (event.target.checked) {
			dispatch(setTotalPriceServices(totalPriceServices + price))
			dispatch(setTotalPrice(totalPrice + price))
			updatedArrService.push(id)
		} else if (!event.target.checked) {
			dispatch(setTotalPriceServices(totalPriceServices - price))
			dispatch(setTotalPrice(totalPrice - price))
			const index = updatedArrService.indexOf(id)
			if (index !== -1) {
				updatedArrService.splice(index, 1)
			}
		}

		localStorage.setItem('arrService', JSON.stringify(updatedArrService))
	}

	return (
		<div className='services__block'>
			<h3 className='services__block-title' title={description}>
				{title}
			</h3>
			<div className='services__block-right'>
				<div className='services__block-right-frag'></div>
				<FormControlLabel
					control={<Switch checked={isChecked} onChange={onChangeSwitch} />}
					label=''
				/>
				<p className='services__block-price'>{price} ₽</p>
			</div>
		</div>
	)
}

export default ServiceBlock
