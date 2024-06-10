import React from 'react'
import ContentLoader from 'react-content-loader'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

export const ProductBlockSkeleton = () => {
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)
	return (
		<ContentLoader
			className='product-block product-block--skeleton'
			speed={2}
			width={260}
			height={425}
			viewBox='0 0 280 425'
			backgroundColor={isDarkTheme ? '#656565' : '#f3f3f3'}
			foregroundColor={isDarkTheme ? '#454545' : '#ecebeb'}
		>
			<rect x='0' y='305' rx='10' ry='10' width='280' height='50' />
			<rect x='5' y='0' rx='5' ry='5' width='270' height='255' />
			<rect x='125' y='370' rx='0' ry='0' width='155' height='45' />
			<rect x='0' y='370' rx='0' ry='0' width='100' height='45' />
			<rect x='5' y='265' rx='10' ry='10' width='270' height='30' />
		</ContentLoader>
	)
}
