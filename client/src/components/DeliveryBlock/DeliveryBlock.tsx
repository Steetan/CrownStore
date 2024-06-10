import React from 'react'
import customAxios from '../../axios'
import { UserData } from '../../pages/SettingsUser/SettingsUser'
import { useForm } from 'react-hook-form'
import { FormControlLabel, Switch, TextField } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import { setIsCheckedAddress } from '../../redux/slices/cartSlice'

interface IDeliveryBlock {
	setAddress: React.Dispatch<React.SetStateAction<string>>
}

const DeliveryBlock: React.FC<IDeliveryBlock> = ({ setAddress }) => {
	const [loading, setLoading] = React.useState(true)
	const { isCheckedAddress } = useSelector((state: RootState) => state.cartSlice)

	const dispatch = useAppDispatch()

	const {
		register,
		setValue,
		formState: { errors },
	} = useForm<UserData>()

	React.useEffect(() => {
		const fetchMe = async () => {
			const { data } = await customAxios.get('auth/meinfo')

			setValue('address', data.address)
			setAddress(data.address)
			setLoading(false)
		}
		fetchMe()
	}, [])
	if (loading) {
		return <p>Loading...</p>
	}

	return (
		<div className='delivery'>
			<div className='delivery-left'>
				<h3>Доставка</h3>
				<FormControlLabel
					control={
						<Switch
							checked={isCheckedAddress}
							onChange={() => dispatch(setIsCheckedAddress(!isCheckedAddress))}
						/>
					}
					label=''
				/>
			</div>
			<TextField
				id='outlined-basic'
				label='Адрес доставки'
				className='form-block__input'
				variant='outlined'
				disabled={!isCheckedAddress}
				{...register('address', {
					required: 'Укажите фамилию',
					onChange: (event: any) => setAddress(event.target.value),
				})}
			/>
			{errors.address && <p style={{ color: 'red' }}>{errors.address.message}</p>}
			<h4 className={isCheckedAddress ? 'delivery-price delivery-price--active' : 'delivery-price'}>
				Бесплатно
			</h4>
		</div>
	)
}

export default DeliveryBlock
