import React from 'react'
import { useForm } from 'react-hook-form'
import { DataProduct } from '../../pages/AdminPanel/AdminPanel'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { updateProduct } from '../../redux/slices/productSlice'
import customAxios from '../../axios'
import { useAppDispatch } from '../../redux/store'
import { arrCategories } from '../Categories/Categories'

interface IAdminFormUpdate {
	nameButton: string
	productData?: DataProduct
	setIsVisiblePopupUpdate: React.Dispatch<React.SetStateAction<boolean>>
	getProducts: () => void
}

export const AdminFormUpdate: React.FC<IAdminFormUpdate> = ({
	nameButton,
	productData,
	setIsVisiblePopupUpdate,
	getProducts,
}) => {
	const [imgUrlUpdate, setImgUrlUpdate] = React.useState('')
	const [category, setCategory] = React.useState(productData?.category || '')
	const [discount, setDiscount] = React.useState(0)
	const inputFileRef = React.useRef<HTMLInputElement>(null)
	const dispatch = useAppDispatch()

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<DataProduct>()

	const onSubmit = async (values: DataProduct) => {
		try {
			const data = await dispatch(
				updateProduct({
					...values,
					fileimg: imgUrlUpdate,
					id: productData?.id,
					description: values.description?.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;'),
				}),
			)
			if (!data.payload) {
				return alert('Не удалось обновить продукт!')
			}
			if (data.payload) {
				getProducts()
				document.body.classList.remove('active')
				setIsVisiblePopupUpdate(false)
				alert('Продукт был успешно обновлен!')
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleFileChangeUpdate = async (event: any) => {
		try {
			const formDataUpdate = new FormData()
			formDataUpdate.append('image', event.target.files[0])

			customAxios
				.post(`${process.env.REACT_APP_SERVER_URL}/upload`, formDataUpdate)
				.then(({ data }) => {
					setImgUrlUpdate(data.url)
				})
		} catch (error) {
			console.warn(error)
		}
	}

	const deleteImg = () => {
		try {
			customAxios.delete(`${process.env.REACT_APP_SERVER_URL}/upload/delete/${imgUrlUpdate}`)
			if (inputFileRef.current) {
				inputFileRef.current.value = ''
				setImgUrlUpdate('')
			}
		} catch (error) {
			console.log(error)
		}
	}

	const onChangeDiscount = (event: any) => {
		const discountValue = Number(event.target.value)
		const newValue = discountValue > 100 ? 100 : discountValue < 0 ? 0 : discountValue

		setValue('discount', newValue)
		setDiscount(newValue)
	}

	React.useEffect(() => {
		setValue('title', productData?.title)
		setValue('description', productData?.description?.replace(/\<br>/g, '\n'))
		setValue('price', productData?.price)
		setValue('count', productData?.count)
		setValue('discount', productData?.discount)
		setImgUrlUpdate(productData?.imgurl ? productData.imgurl : '')
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
				<FormControl fullWidth>
					<InputLabel id='demo-simple-select-label'>Категория</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={category}
						label='Категория'
						{...register('category', {
							required: 'Укажите категорию',
							onChange: (event) => setCategory(event.target.value),
						})}
					>
						{arrCategories.slice(1).map((item, index) => (
							<MenuItem style={{ backgroundColor: 'black' }} key={index + 1} value={index + 1}>
								{item}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					id='outlined-basic'
					label='Количество'
					className='form-block__input'
					variant='outlined'
					{...register('count', { required: 'Укажите количество' })}
				/>
				{errors.count && <p style={{ color: 'red' }}>{errors.count.message}</p>}
				<TextField
					id='outlined-basic'
					label='Скидка %'
					className='form-block__input'
					variant='outlined'
					type='number'
					value={discount}
					inputProps={{ min: 0, max: 100 }}
					{...register('discount', {
						required: 'Укажите скидку',
						onChange: onChangeDiscount,
					})}
				/>
				{errors.discount && <p style={{ color: 'red' }}>{errors.discount.message}</p>}
				{!imgUrlUpdate && (
					<label htmlFor='file-upload-update' className='custom-file-upload'>
						Загрузить фото
					</label>
				)}
				<input
					id='file-upload-update'
					ref={inputFileRef}
					type='file'
					style={{ display: 'none' }}
					onChange={handleFileChangeUpdate}
				/>
			</div>
			{imgUrlUpdate && (
				<div className='custom-block-img'>
					<img
						className='form-block__img-upload'
						src={`${process.env.REACT_APP_SERVER_URL}/uploads/productImg/${imgUrlUpdate}`}
						alt=''
					/>
					{imgUrlUpdate && (
						<button className='settings__btn-delete' onClick={deleteImg}>
							Удалить изображение
						</button>
					)}
				</div>
			)}
			<div className='form-block__btns'>
				<button type='submit' className='button button--footer'>
					{nameButton}
				</button>
			</div>
		</form>
	)
}

export default AdminFormUpdate
