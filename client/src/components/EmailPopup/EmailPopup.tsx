import React from 'react'
import customAxios from '../../axios'
import { useForm } from 'react-hook-form'
import { IProduct } from '../../pages/FullProduct'
import { TextField } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

interface IEmailPopup {
	dataProduct?: IProduct
	isVisiblePopup: boolean
	setIsVisiblePopup: React.Dispatch<React.SetStateAction<boolean>>
	title: string
	titleDesc: string
	url: string
	titleDescError: string
	titleBtn: string
}

const EmailPopup: React.FC<IEmailPopup> = ({
	dataProduct,
	isVisiblePopup,
	setIsVisiblePopup,
	title,
	titleDesc,
	titleDescError,
	url,
	titleBtn,
}) => {
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<{ desc: string }>()

	const onComplaintReview = async (values: { desc: string }) => {
		try {
			await customAxios.post(`${process.env.REACT_APP_SERVER_URL}/email/${url}`, {
				desc: values.desc,
				name_product: dataProduct?.title,
			})
			alert('Сообщение отправлено')
			setValue('desc', '')
			setIsVisiblePopup(false)
			document.body.classList.remove('active')
		} catch (error) {
			alert('Не удалось отправить сообщение')
			console.log(error)
		}
	}

	const onClosePopup = () => {
		setIsVisiblePopup(false)
		document.body.classList.remove('active')
	}
	return (
		isVisiblePopup && (
			<div className='popup-update__wrapper popup-update__wrapper--reviews'>
				<div className={isDarkTheme ? 'popup-update dark-theme-background' : 'popup-update'}>
					<h3 className='form-block__title'>{title}</h3>
					<div className='popup-update__close-wrap' onClick={() => onClosePopup()}>
						<div className='popup-update__close'></div>
					</div>
					<form onSubmit={handleSubmit(onComplaintReview)}>
						<div className='form-block__inputs'>
							<TextField
								id='outlined-basic'
								className='form-block__input'
								label={titleDesc}
								variant='outlined'
								{...register('desc', { required: titleDescError })}
							/>
							{errors.desc && <p style={{ color: 'red' }}>{errors.desc.message}</p>}
						</div>
						<div className='form-block__btns'>
							<button type='submit' className='button button--footer'>
								{titleBtn}
							</button>
						</div>
					</form>
				</div>
			</div>
		)
	)
}

export default EmailPopup
