import React from 'react'
import { useAppDispatch } from '../../redux/store'
import { fetchAdminMe } from '../../redux/slices/authSlice'
import customAxios from '../../axios'
import { Link } from 'react-router-dom'

import NotFound from '../NotFound/NotFound'
import { AdminForm, ProductTable, UserTable } from '../../components'
import AdminFormService from '../../components/AdminFormService/AdminFormService'
import ServiceTable from '../../components/ServiceTable/ServiceTable'
import OrderTable from '../../components/OrderTable/OrderTable'

export interface DataProduct {
	id?: string
	title: string | undefined
	description: string | undefined
	fileimg: string | undefined
	price: number | undefined
	rating: number | undefined
	category: number | undefined
	count: number | undefined
	imgurl?: string | undefined
	discount?: number | undefined
}

const AdminPanel: React.FC = () => {
	const [hasError, setHasError] = React.useState(false)
	const [fetchData, setFetchData] = React.useState<DataProduct[]>([])
	const [idAdmin, setIdAdmin] = React.useState('')

	const dispatch = useAppDispatch()

	React.useEffect(() => {
		try {
			customAxios.get(`${process.env.REACT_APP_SERVER_URL}/adminpanel`).then(({ data }) => {
				setFetchData(data)
			})
		} catch (error) {
			console.log(error)
		}
	}, [])

	React.useEffect(() => {
		try {
			const fetchMe = async () => {
				const data = await dispatch(fetchAdminMe())
				setIdAdmin(data.payload.decoded.id)
				if (data.payload.error) {
					setHasError(true)
				}
			}
			fetchMe()
		} catch (error) {
			console.log(error)
		}
	}, [dispatch])

	if (hasError) {
		return <NotFound />
	}

	if (!fetchData || !Array.isArray(fetchData)) {
		return <div className='loading-cart'></div>
	}

	return (
		<div>
			<div className='admin-block'>
				<div className='form-block form-block--admin'>
					<h3 className='form-block__title'>Новый продукт</h3>
					<AdminForm nameButton='Добавить продукт' />
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
					<ProductTable hasError={hasError} />
				</div>
			</div>
			<div className='admin-block admin-block--services'>
				<div className='form-block form-block--admin form-block--services'>
					<h3 className='form-block__title'>Новая услуга</h3>
					<AdminFormService nameButton='Добавить услугу' />
				</div>
				<ServiceTable hasError={hasError} />
			</div>
			<UserTable idAdmin={idAdmin} hasError={hasError} />
			<OrderTable hasError={hasError} />
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
				<Link to='/' className='button button--black'>
					<span>Вернуться назад</span>
				</Link>
			</div>
		</div>
	)
}

export default AdminPanel
