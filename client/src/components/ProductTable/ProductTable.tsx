import React, { ChangeEvent } from 'react'
import customAxios from '../../axios'
import { DataProduct } from '../../pages/AdminPanel/AdminPanel'
import { arrCategories } from '../Categories/Categories'
import AdminFormUpdate from '../AdminFormUpdate/AdminFormUpdate'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

export const ProductTable: React.FC<{ hasError: boolean }> = ({ hasError }) => {
	const [fetchData, setFetchData] = React.useState<DataProduct[]>([])
	const [filterFetchData, setFilterFetchData] = React.useState<DataProduct[]>([])
	const [searchInput, setSearchInput] = React.useState('')
	const [isVisiblePopupUpdate, setIsVisiblePopupUpdate] = React.useState(false)
	const [selectedProductData, setSelectedProductData] = React.useState<any>({})
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)

	const getProducts = () => {
		try {
			customAxios
				.get(`${process.env.REACT_APP_SERVER_URL}/adminpanel/products`)
				.then(({ data }) => {
					setFetchData(data)
					setFilterFetchData(data)
				})
		} catch (error) {
			console.log(error)
		}
	}
	React.useEffect(() => {
		getProducts()
	}, [])

	const deleteProducts = () => {
		try {
			if (window.confirm(`Вы действительно хотите удалить все продукты?`)) {
				customAxios.delete(`${process.env.REACT_APP_SERVER_URL}/adminpanel/products`).then(() => {
					customAxios
						.get(`${process.env.REACT_APP_SERVER_URL}/adminpanel/products`)
						.then(({ data }) => {
							setFetchData(data)
						})
				})
				getProducts()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const searchProducts = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value)

		if (!e.target.value) {
			setFilterFetchData(fetchData)
		} else {
			setFilterFetchData(
				fetchData.filter(
					(item) =>
						item.id?.toLowerCase().includes(e.target.value.toLowerCase()) ||
						item.title?.toLowerCase().includes(e.target.value.toLowerCase()) ||
						arrCategories[item.category ? item.category : 0]
							?.toLowerCase()
							.includes(e.target.value.toLowerCase()) ||
						String(item.price)?.includes(e.target.value.toLowerCase()),
				),
			)
		}
	}

	const onOpenPopup = (item: DataProduct) => {
		setIsVisiblePopupUpdate(true)
		document.body.classList.add('active')
		setSelectedProductData(item)
	}

	const onClosePopup = () => {
		setIsVisiblePopupUpdate(false)
		document.body.classList.remove('active')
	}

	const deleteItem = (id: string, title: string | undefined) => {
		try {
			if (window.confirm(`Вы действительно хотите удалить продукт ${title}?`)) {
				customAxios.delete(`${process.env.REACT_APP_SERVER_URL}/adminpanel/deleteproductbyid`, {
					params: {
						product: id,
					},
				})
				getProducts()
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className='admin__list-main-block'>
			<div className='admin__list-header'>
				<div className='admin__list-header-block'>
					<h3 className='admin__list-title'>Продукты</h3>
					<p>{filterFetchData.length} шт.</p>
				</div>
				<div className='admin__list-header-block'>
					<div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
						<input
							className='admin__search-input'
							type='text'
							placeholder='поиск'
							value={searchInput}
							onChange={searchProducts}
						/>
					</div>
					<h4 className='admin__list-deleteAll' onClick={deleteProducts}>
						Удалить все
					</h4>
				</div>
			</div>
			<div className='admin__list-block'>
				<div className='admin__list-item'>
					<div className='admin__list-cell admin__list-cell--product admin__list-cell--title'></div>
					<div className='admin__list-cell admin__list-cell--product admin__list-cell--title'>
						id
					</div>
					<div className='admin__list-cell admin__list-cell--product admin__list-cell--title'>
						Название
					</div>
					<div className='admin__list-cell admin__list-cell--product admin__list-cell--title'>
						Описание
					</div>
					<div className='admin__list-cell admin__list-cell--product admin__list-cell--title'>
						Цена
					</div>
					<div className='admin__list-cell admin__list-cell--product admin__list-cell--title'>
						Категория
					</div>
					<div className='admin__list-cell admin__list-cell--product admin__list-cell--title'>
						Изображение
					</div>
					<div className='admin__list-cell admin__list-cell--product admin__list-cell--title'>
						Рейтинг
					</div>
					<div className='admin__list-cell admin__list-cell--product admin__list-cell--title'>
						Количество
					</div>
					<div className='admin__list-cell admin__list-cell--product admin__list-cell--title'>
						Скидка %
					</div>
				</div>
				{!hasError &&
					filterFetchData.map((item: DataProduct) => (
						<div key={item.id}>
							<div className='admin__list-item'>
								<div className='admin__list-cell-act'>
									<div title='обновить строку'>
										<svg
											onClick={() => onOpenPopup(item)}
											className='admin__list-cell-update'
											version='1.0'
											xmlns='http://www.w3.org/2000/svg'
											width='512.000000pt'
											height='512.000000pt'
											viewBox='0 0 512.000000 512.000000'
											preserveAspectRatio='xMidYMid meet'
										>
											<g
												transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
												fill={isDarkTheme ? '#fff' : '#000000'}
												stroke='none'
											>
												<path
													d='M2365 5114 c-382 -39 -667 -121 -975 -281 -237 -122 -439 -271 -635
-468 -469 -468 -727 -1058 -752 -1715 -10 -288 32 -577 128 -865 74 -222 103
-263 190 -272 83 -8 159 58 159 139 0 22 -24 112 -54 201 -136 404 -160 750
-80 1152 194 978 1022 1717 2024 1806 466 41 937 -73 1377 -334 l103 -60 -51
-17 c-64 -22 -94 -51 -109 -106 -11 -38 -10 -51 4 -89 10 -25 31 -54 47 -66
46 -33 675 -239 729 -239 77 0 131 46 144 123 10 55 -211 721 -252 759 -39 36
-65 48 -109 48 -102 0 -172 -113 -133 -215 12 -33 17 -35 -110 51 -332 225
-701 369 -1100 429 -100 15 -460 28 -545 19z'
												/>
												<path
													d='M2188 4189 c-64 -33 -78 -76 -78 -229 l0 -130 -27 -12 c-98 -39 -259
-126 -321 -173 -40 -30 -75 -55 -78 -55 -3 0 -57 29 -122 65 -128 71 -164 79
-218 46 -18 -11 -43 -34 -57 -53 -53 -71 -318 -546 -324 -580 -4 -26 1 -49 16
-81 19 -39 36 -52 137 -112 l116 -69 -9 -70 c-10 -91 -10 -261 0 -352 l9 -70
-116 -69 c-101 -60 -118 -73 -137 -112 -15 -32 -20 -55 -16 -81 6 -34 271
-509 324 -580 14 -19 39 -42 57 -53 54 -33 90 -25 218 46 65 36 119 65 122 65
3 0 38 -25 78 -55 62 -47 223 -134 321 -173 l27 -12 0 -130 c0 -155 14 -196
80 -230 37 -19 58 -20 370 -20 312 0 333 1 370 20 66 34 80 75 80 230 l0 131
33 11 c70 24 246 121 315 173 40 30 75 55 78 55 3 0 57 -29 122 -65 129 -72
161 -78 222 -44 40 23 55 46 264 409 59 102 109 202 112 222 5 26 0 49 -15 81
-19 39 -36 52 -137 112 l-116 69 9 70 c4 39 8 118 8 176 0 58 -4 137 -8 176
l-9 70 116 69 c101 60 118 73 137 112 15 32 20 55 16 81 -4 20 -57 124 -119
232 -202 353 -217 376 -258 399 -61 34 -93 28 -222 -44 -65 -36 -119 -65 -122
-65 -3 0 -38 25 -78 55 -69 52 -245 149 -315 173 l-33 11 0 131 c0 155 -14
196 -80 230 -37 19 -58 20 -372 20 -312 -1 -335 -2 -370 -21z m522 -390 c0
-171 15 -192 170 -245 165 -56 256 -108 393 -226 114 -99 143 -100 288 -17 48
27 89 49 91 49 5 0 148 -244 148 -253 0 -2 -40 -28 -89 -56 -147 -85 -165
-121 -132 -261 39 -162 38 -314 -5 -484 -29 -112 -3 -156 137 -237 49 -28 89
-54 89 -56 0 -9 -143 -253 -148 -253 -2 0 -43 22 -91 49 -145 83 -174 82 -288
-17 -137 -118 -228 -170 -393 -226 -155 -53 -170 -74 -170 -245 l0 -111 -150
0 -150 0 0 111 c0 165 -22 199 -150 238 -154 47 -282 120 -418 237 -108 94
-139 96 -282 13 -47 -27 -88 -49 -91 -49 -6 0 -149 243 -149 253 0 3 34 25 76
48 160 88 179 124 143 270 -33 133 -33 325 0 458 36 146 17 182 -143 270 -42
23 -76 45 -76 48 0 10 143 253 149 253 3 0 44 -22 91 -49 143 -83 174 -81 282
13 136 117 264 190 418 237 128 39 150 73 150 238 l0 111 150 0 150 0 0 -111z'
												/>
												<path
													d='M2405 3293 c-343 -73 -595 -384 -595 -733 0 -351 255 -662 602 -734
246 -51 499 26 677 207 138 140 205 289 218 487 27 425 -325 794 -754 789 -43
0 -109 -7 -148 -16z m247 -294 c87 -18 158 -58 223 -123 258 -259 118 -696
-244 -758 -141 -24 -281 22 -386 127 -178 177 -178 454 -1 630 111 111 258
155 408 124z'
												/>
												<path
													d='M4720 3592 c-47 -23 -80 -75 -80 -124 0 -22 25 -112 54 -201 95 -281
133 -528 122 -792 -13 -327 -83 -607 -226 -901 -222 -458 -585 -820 -1045
-1045 -216 -105 -408 -165 -660 -205 -135 -22 -488 -25 -610 -6 -343 56 -610
152 -902 325 l-103 60 50 17 c63 21 85 41 105 95 21 54 7 116 -36 156 -38 35
-670 249 -737 249 -77 0 -135 -47 -147 -120 -6 -33 11 -91 109 -387 64 -191
122 -355 129 -364 22 -29 81 -59 117 -59 107 0 180 111 140 215 -12 33 -17 35
110 -51 337 -226 705 -370 1105 -430 168 -26 532 -26 700 0 555 84 1049 331
1441 721 218 217 371 429 499 690 92 187 136 307 185 499 125 494 102 974 -71
1459 -22 65 -51 132 -63 150 -25 37 -78 67 -121 67 -16 0 -46 -8 -65 -18z'
												/>
											</g>
										</svg>
									</div>
									<div title='удалить строку'>
										<svg
											className='admin__list-cell-delete'
											onClick={() => deleteItem(item.id ? item.id : '', item.title)}
											version='1.0'
											xmlns='http://www.w3.org/2000/svg'
											width='512.000000pt'
											height='512.000000pt'
											viewBox='0 0 512.000000 512.000000'
											preserveAspectRatio='xMidYMid meet'
										>
											<g
												transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
												fill={isDarkTheme ? '#fff' : '#000000'}
												stroke='none'
											>
												<path
													d='M1931 5109 c-77 -15 -182 -72 -240 -130 -97 -97 -140 -221 -141 -401
l0 -78 -302 0 c-341 0 -416 -8 -506 -50 -81 -38 -178 -134 -215 -213 -84 -178
-48 -384 90 -521 48 -48 161 -116 192 -116 8 0 11 -422 13 -1542 l3 -1543 27
-80 c38 -111 92 -196 168 -269 79 -74 162 -120 266 -146 75 -19 115 -20 1274
-20 1159 0 1199 1 1274 20 243 62 418 264 456 527 6 42 10 639 10 1560 l0
1491 38 13 c143 46 267 199 293 359 27 169 -57 358 -202 451 -109 69 -126 72
-510 77 l-346 4 -6 117 c-7 129 -28 204 -77 282 -67 104 -188 186 -309 209
-66 12 -1186 12 -1250 -1z m1264 -251 c90 -49 126 -118 133 -255 l5 -103 -773
0 -772 0 3 108 c4 95 7 112 32 154 15 26 41 57 58 69 69 49 66 49 694 46 528
-2 593 -4 620 -19z m1080 -625 c51 -27 80 -58 101 -108 38 -92 6 -203 -75
-260 l-43 -30 -1676 -3 c-1171 -2 -1688 0 -1714 8 -100 29 -164 144 -138 249
19 79 82 141 165 162 17 4 775 6 1685 6 l1655 -2 40 -22z m-217 -2118 c2
-1003 -1 -1492 -8 -1540 -21 -138 -93 -240 -208 -297 l-67 -33 -1189 -3
c-1290 -3 -1256 -4 -1343 51 -82 52 -150 153 -172 255 -8 38 -11 479 -11 1548
l0 1494 1498 -2 1497 -3 3 -1470z'
												/>
												<path
													d='M1772 3231 c-16 -17 -32 -44 -36 -62 -3 -17 -6 -542 -6 -1166 0
-1209 -1 -1172 47 -1216 31 -27 84 -32 126 -12 71 34 67 -47 67 1240 0 1255 3
1191 -54 1229 -14 9 -45 16 -70 16 -36 0 -50 -6 -74 -29z'
												/>
												<path
													d='M2488 3237 c-14 -12 -31 -32 -37 -44 -8 -15 -11 -361 -11 -1178 0
-1287 -4 -1206 67 -1240 42 -20 95 -15 126 12 48 44 47 7 47 1216 0 624 -3
1149 -6 1166 -4 18 -20 45 -36 62 -38 38 -109 41 -150 6z'
												/>
												<path
													d='M3184 3226 l-34 -34 0 -1171 c0 -1007 2 -1176 15 -1200 15 -31 69
-61 108 -61 37 0 90 41 104 80 16 46 18 2276 3 2332 -15 54 -61 88 -117 88
-38 0 -50 -5 -79 -34z'
												/>
											</g>
										</svg>
									</div>
								</div>
								<div className='admin__list-cell admin__list-cell--product'>{item.id}</div>
								<div className='admin__list-cell admin__list-cell--product'>{item.title}</div>
								<div className='admin__list-cell admin__list-cell--product'>
									{item?.description && item?.description?.length < 20
										? item?.description
										: item?.description?.substring(0, 20) + '...'}
								</div>
								<div className='admin__list-cell admin__list-cell--product'>{item.price}</div>
								<div className='admin__list-cell admin__list-cell--product'>
									{arrCategories[item.category ? item.category : 0]}
								</div>
								<div className='admin__list-cell admin__list-cell--product admin__list-cell--img'>
									<img
										src={`${process.env.REACT_APP_SERVER_URL}/uploads/productImg/${item.imgurl}`}
										style={{ maxWidth: 60 }}
										alt='img'
									/>
								</div>
								<div className='admin__list-cell admin__list-cell--product'>{item.rating}</div>
								<div className='admin__list-cell admin__list-cell--product'>{item.count}</div>
								<div className='admin__list-cell admin__list-cell--product'>{item.discount}</div>
							</div>
						</div>
					))}
			</div>
			{isVisiblePopupUpdate && (
				<div className='popup-update__wrapper'>
					<div className={isDarkTheme ? 'popup-update dark-theme-background' : 'popup-update'}>
						<h3 className='form-block__title'>Обновить продукт</h3>
						<div className='popup-update__close-wrap' onClick={onClosePopup}>
							<div className='popup-update__close'></div>
						</div>
						<AdminFormUpdate
							getProducts={getProducts}
							nameButton='Обновить'
							productData={selectedProductData}
							setIsVisiblePopupUpdate={setIsVisiblePopupUpdate}
						/>
					</div>
				</div>
			)}
		</div>
	)
}

export default ProductTable
