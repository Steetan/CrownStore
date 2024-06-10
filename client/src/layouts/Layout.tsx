import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header/Header'
import Aside from '../components/Aside/Aside'
import Footer from '../components/Footer/Footer'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

const Layout = () => {
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)

	return (
		<div className='main'>
			<Aside />
			<div className='wrapper'>
				<Header />
				<div className={isDarkTheme ? 'content dark-theme-background dark-theme' : 'content'}>
					<Outlet />
				</div>
				<Footer />
			</div>
		</div>
	)
}

export default Layout
