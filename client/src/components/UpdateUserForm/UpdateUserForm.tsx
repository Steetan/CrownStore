import { TextField } from '@mui/material'
import React from 'react'
import { UserData } from '../../pages/SettingsUser/SettingsUser'
import { useForm } from 'react-hook-form'
import customAxios from '../../axios'

export const UpdateUserForm = ({}) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<UserData>()

	const [loading, setLoading] = React.useState(true)

	React.useEffect(() => {
		try {
			customAxios.get('auth/meinfo').then(({ data }) => {
				setValue('name', data.name_user)
				setValue('fname', data.fname_user)
				setValue('oname', data.oname_user)
				setValue('email', data.email)
				setValue('phone', data.phone_number)
				setValue('address', data.address)
				setLoading(false)
			})
		} catch (error) {
			console.log(error)
		}
	}, [])

	const onSubmit = async (values: UserData) => {
		try {
			const { data } = await customAxios.patch('/auth/update', {
				...values,
			})

			alert(data.message)
			localStorage.removeItem('token')
			localStorage.setItem('token', data.token)
		} catch (error) {
			console.log(error)
			alert('Не удалось обновить данные')
		}
	}

	if (loading) {
		return <p>Загрузка данных</p>
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className='form-block'>
				<h3 className='form-block__title'>Обновление данных</h3>
				<TextField
					id='outlined-basic'
					label='Фамилия'
					className='form-block__input form-block__input--update'
					variant='outlined'
					{...register('fname', { required: 'Укажите фамилию' })}
				/>
				{errors.fname && <p style={{ color: 'red' }}>{errors.fname.message}</p>}
				<TextField
					id='outlined-basic'
					label='Имя'
					className='form-block__input form-block__input--update'
					variant='outlined'
					{...register('name', { required: 'Укажите имя' })}
				/>
				{errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
				<TextField
					id='outlined-basic'
					label='Отчество'
					className='form-block__input form-block__input--update'
					variant='outlined'
					{...register('oname', { required: 'Укажите отчество' })}
				/>
				{errors.oname && <p style={{ color: 'red' }}>{errors.oname.message}</p>}
				<TextField
					id='outlined-basic'
					label='Email'
					type='email'
					className='form-block__input form-block__input--update'
					variant='outlined'
					{...register('email', { required: 'Укажите email' })}
				/>
				{errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
				<TextField
					id='outlined-basic'
					label='Телефон'
					type='number'
					className='form-block__input form-block__input--update'
					variant='outlined'
					{...register('phone', { required: 'Укажите номер телефона' })}
				/>
				{errors.phone && <p style={{ color: 'red' }}>{errors.phone.message}</p>}
				<TextField
					id='outlined-basic'
					label='Адрес'
					className='form-block__input form-block__input--update'
					variant='outlined'
					{...register('address', { required: 'Укажите свой адрес' })}
				/>
				{errors.address && <p style={{ color: 'red' }}>{errors.address.message}</p>}
				<button type='submit' className='button button--footer'>
					Обновить
				</button>
			</div>
		</form>
	)
}

export default UpdateUserForm
