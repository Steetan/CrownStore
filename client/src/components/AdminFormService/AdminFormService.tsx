import React from 'react'
import { useForm } from 'react-hook-form'
import { DataProduct } from '../../pages/AdminPanel/AdminPanel'
import { TextField } from '@mui/material'
import customAxios from '../../axios'

export const AdminFormService: React.FC<{ nameButton: string }> = ({ nameButton }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<DataProduct>()

	const onSubmit = async (values: DataProduct) => {
		try {
			customAxios
				.post(`${process.env.REACT_APP_SERVER_URL}/services/push`, {
					...values,
				})
				.then(({ data }) => {
					data ? window.location.reload() : alert('Не удалось создать услугу!')
				})
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className='form-block__inputs'>
				<TextField
					id='outlined-basic'
					className='form-block__input'
					label='Название'
					variant='outlined'
					{...register('title', { required: 'Укажите название' })}
				/>
				{errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
				<TextField
					placeholder='Описание'
					multiline
					rows={7}
					maxRows={8}
					{...register('description', { required: 'Укажите описание' })}
				/>
				{errors.description && <p style={{ color: 'red' }}>{errors.description.message}</p>}
				<TextField
					id='outlined-basic'
					label='Цена'
					className='form-block__input'
					variant='outlined'
					{...register('price', { required: 'Укажите цену' })}
				/>
				{errors.price && <p style={{ color: 'red' }}>{errors.price.message}</p>}
			</div>

			<div className='form-block__btns'>
				<button type='submit' className='button button--footer'>
					{nameButton}
				</button>
			</div>
		</form>
	)
}

export default AdminFormService
