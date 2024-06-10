import React from 'react'
import customAxios from '../../axios'
import { RootState, useAppDispatch } from '../../redux/store'
import { fetchDeleteMe, setUserImgUrl } from '../../redux/slices/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { FormControlLabel, Switch, TextField } from '@mui/material'

import { UpdateUserForm } from '../../components'

export interface UserData {
	name: string
	fname: string
	oname: string
	email: string
	phone: number
	address: string
	userPassword?: string
	userPasswordRepeat?: string
}

const SettingsUser = ({}) => {
	const [isAdmin, setIsAdmin] = React.useState(false)
	const [isChecked, setIsChecked] = React.useState(false)

	const inputFileRef = React.useRef<HTMLInputElement>(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserData>()

	const { userImgUrl } = useSelector((state: RootState) => state.authSlice)

	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	React.useEffect(() => {
		const fetchMe = async () => {
			const { data } = await customAxios.get('auth/meinfo')

			setIsAdmin(data.access)
		}
		fetchMe()
	}, [])

	const onClickItemDelete = async () => {
		if (window.confirm('Вы действительно хотите удалить аккаунт?') && !isAdmin) {
			await dispatch(fetchDeleteMe(window.localStorage.getItem('token'))).finally(() => {
				navigate('/')
				window.localStorage.removeItem('token')
				window.location.reload()
			})
		}
	}

	const onClickUpdatePassword = async (values: UserData) => {
		try {
			values.userPassword &&
				values.userPassword?.length < 6 &&
				alert('Пароль должен содержать минимум 6 символов')
			if (values.userPassword && values.userPassword === values.userPasswordRepeat) {
				const { data } = await customAxios.patch('/auth/updpass', {
					password: values.userPassword,
				})
				data && alert('Пароль был успешно изменен')
			} else {
				alert('Пароли не совпадают')
			}
		} catch (error) {
			console.log(error)
			alert('Не удалось обновить пароль')
		}
	}

	const handleFileChange = async (event: any) => {
		try {
			const formData = new FormData()
			formData.append('image', event.target.files[0])

			await customAxios
				.post(`${process.env.REACT_APP_SERVER_URL}/upload/user`, formData)
				.then(({ data }) => {
					try {
						dispatch(setUserImgUrl(`${data.url}`))
						customAxios
							.patch('/auth/updimg', {
								img: data.url,
							})
							.then(({ data }) => {
								data && alert('Аватарка была успешно изменена')
							})
					} catch (error) {
						console.log(error)
						alert('Не удалось обновить аватарку')
					}
				})
		} catch (error) {
			console.warn(error)
		}
	}

	const deleteImg = async () => {
		if (window.confirm('Вы действительно хотите удалить аккаунт?')) {
			try {
				await customAxios.delete(
					`${process.env.REACT_APP_SERVER_URL}/upload/user/delete/${userImgUrl}`,
				)
				if (inputFileRef.current) {
					inputFileRef.current.value = ''
				}

				await customAxios.patch('/auth/updimg', {
					img: '',
				})
			} catch (error) {
				console.log(error)
			}
			dispatch(setUserImgUrl(''))
		}
	}

	return (
		<div className='settings'>
			<h2 className='settings__title'>Настройки аккаунта</h2>
			<div className='settings__main-block'>
				<UpdateUserForm />

				<div className='settings__block-right'>
					<form className='settings__password-block' onSubmit={handleSubmit(onClickUpdatePassword)}>
						<h3 className='form-block__title settings__password-title'>Новый пароль</h3>
						<div className='settings__password-inputs'>
							<div className='settings__password-input'>
								<TextField
									type={isChecked ? 'text' : 'password'}
									id='outlined-basic'
									label='Пароль'
									className='form-block__input form-block__input--password'
									variant='outlined'
									{...register('userPassword', { required: 'Укажите пароль' })}
								/>
								{errors.userPassword && (
									<p style={{ color: 'red' }}>{errors.userPassword.message}</p>
								)}
							</div>
							<div className='settings__password-hr'></div>
							<div className='settings__password-input'>
								<TextField
									type={isChecked ? 'text' : 'password'}
									id='outlined-basic'
									label='Пароль еще раз'
									className='form-block__input form-block__input--password'
									variant='outlined'
									{...register('userPasswordRepeat', { required: 'Укажите пароль еще раз' })}
								/>
								{errors.userPasswordRepeat && (
									<p style={{ color: 'red' }}>{errors.userPasswordRepeat.message}</p>
								)}
							</div>
						</div>
						<FormControlLabel
							value={isChecked}
							onChange={() => setIsChecked(!isChecked)}
							control={<Switch />}
							label='Показать пароль'
						/>
						<div className='settings__btn-password-block'>
							<button className='button button--footer settings__btn-password-update'>
								Обновить пароль
							</button>
						</div>
					</form>

					{!userImgUrl && (
						<label htmlFor='file-upload' className='custom-file-upload'>
							Загрузить фото
						</label>
					)}
					<input
						id='file-upload'
						ref={inputFileRef}
						type='file'
						style={{ display: 'none' }}
						onChange={handleFileChange}
					/>

					{userImgUrl && (
						<button className='settings__btn-delete' onClick={deleteImg}>
							Удалить изображение
						</button>
					)}
					<img
						className='form-block__img-upload'
						src={`${process.env.REACT_APP_SERVER_URL}/uploads/userIcons/${userImgUrl}`}
						alt=''
					/>
				</div>
			</div>
			<button
				className='settings__btn-delete settings__btn-delete--acc'
				onClick={onClickItemDelete}
			>
				Удалить аккаунт
			</button>
			<Link to='/' className='button button--black' style={{ marginTop: 20 }}>
				<span>Вернуться назад</span>
			</Link>
		</div>
	)
}

export default SettingsUser
