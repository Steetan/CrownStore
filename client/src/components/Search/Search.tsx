import React, { ChangeEvent } from 'react'
import { setSearchInput } from '../../redux/slices/filterSlice'
import debounce from 'lodash.debounce'
import { RootState, useAppDispatch } from '../../redux/store'
import { useSelector } from 'react-redux'

export const Search = () => {
	const [value, setValue] = React.useState('')
	const dispatch = useAppDispatch()
	const inputRef = React.useRef<HTMLInputElement>(null)
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)

	const clearInput = () => {
		dispatch(setSearchInput(''))
		setValue('')
		inputRef.current?.focus()
	}

	const updateSearchValue = React.useCallback(
		debounce((str) => {
			dispatch(setSearchInput(str))
		}, 1000),
		[],
	)

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
		updateSearchValue(e.target.value)
	}

	return (
		<div className='search__block'>
			<svg
				className='search__img'
				height='512px'
				id='Layer_1'
				version='1.1'
				viewBox='0 0 512 512'
				width='512px'
				xmlns='http://www.w3.org/2000/svg'
				style={isDarkTheme ? { fill: 'white' } : {}}
			>
				<path d='M344.5,298c15-23.6,23.8-51.6,23.8-81.7c0-84.1-68.1-152.3-152.1-152.3C132.1,64,64,132.2,64,216.3  c0,84.1,68.1,152.3,152.1,152.3c30.5,0,58.9-9,82.7-24.4l6.9-4.8L414.3,448l33.7-34.3L339.5,305.1L344.5,298z M301.4,131.2  c22.7,22.7,35.2,52.9,35.2,85c0,32.1-12.5,62.3-35.2,85c-22.7,22.7-52.9,35.2-85,35.2c-32.1,0-62.3-12.5-85-35.2  c-22.7-22.7-35.2-52.9-35.2-85c0-32.1,12.5-62.3,35.2-85c22.7-22.7,52.9-35.2,85-35.2C248.5,96,278.7,108.5,301.4,131.2z' />
			</svg>
			<input
				ref={inputRef}
				value={value}
				onChange={(e) => onChangeInput(e)}
				className='search__input-block'
				placeholder='Найти...'
				type='text'
			/>
			{value && (
				<svg
					onClick={() => clearInput()}
					className='search__delete-img'
					fill='none'
					height='24'
					stroke='currentColor'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
					viewBox='0 0 24 24'
					width='24'
					xmlns='http://www.w3.org/2000/svg'
				>
					<line x1='18' x2='6' y1='6' y2='18' />
					<line x1='6' x2='18' y1='6' y2='18' />
				</svg>
			)}
		</div>
	)
}
