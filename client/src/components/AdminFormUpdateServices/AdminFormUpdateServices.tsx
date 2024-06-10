import React from 'react'
import { useForm } from 'react-hook-form'
import { DataProduct } from '../../pages/AdminPanel/AdminPanel'
import { TextField } from '@mui/material'
import customAxios from '../../axios'

interface IAdminFormUpdate {
	nameButton: string
	productData?: DataProduct
	setIsVisiblePopupUpdate: React.Dispatch<React.SetStateAction<boolean>>
	getProducts: () => void
}

export const AdminFormUpdateServices: React.FC<IAdminFormUpdate> = ({
	nameButton,
	productData,
	setIsVisiblePopupUpdate,
	getProducts,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<DataProduct>()

	const onSubmit = async (values: DataProduct) => {
		try {
			const data = await customAxios.patch(`${process.env.REACT_APP_SERVER_URL}/services/upd`, {
				...values,
				id: productData?.id,
				description: values.description?.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;'),
			})
			if (!data) {
				return alert('Не удалось обновить продукт!')
			}
			if (data) {
				getProducts()
				document.body.classList.remove('active')
				setIsVisiblePopupUpdate(false)
				alert('Услуга была успешно обновлена!')
			}
		} catch (error) {
			console.log(error)
		}
	}

	React.useEffect(() => {
		const formattedDescription = productData?.description?.replace(/\<br>/g, '\n')

		setValue('title', productData?.title)
		setValue('description', formattedDescription)
		setValue('price', productData?.price)
	}, [productData, setValue])

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

export default AdminFormUpdateServices
