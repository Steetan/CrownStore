import { typeCartItem } from './cartSlice'
import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { DataProduct } from '../../pages/AdminPanel/AdminPanel'

export enum Status {
	LOADING = 'loading',
	SUCCESS = 'success',
	ERROR = 'error',
}

export type TypeProductState = {
	items: typeCartItem[]
	status: Status
	fetchFavorites: any
}

const initialState: TypeProductState = {
	items: [],
	status: Status.LOADING,
	fetchFavorites: [],
}

export const fetchProducts = createAsyncThunk(
	'product/fetchProductStatus',
	async ({
		categoryParam,
		sortParam,
		orderParam,
		inputParam,
		selectedPage,
		fromRangeFilter,
		toRangeFilter,
		selectedRating,
	}: Record<string, string>) => {
		const { data } = await axios.get(
			`${process.env.REACT_APP_SERVER_URL}/?${categoryParam}${sortParam}${orderParam}${inputParam}&page=${selectedPage}&limit=8&fromRange=${fromRangeFilter}&toRange=${toRangeFilter}&selectedRatingFilter=${selectedRating}`,
		)
		return data
	},
)

export const createProduct = createAsyncThunk(
	'product/createProduct',
	async (params: DataProduct) => {
		const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}`, params)
		return data
	},
)

export const updateProduct = createAsyncThunk(
	'product/updateProduct',
	async (params: DataProduct) => {
		const { data } = await axios.put(`${process.env.REACT_APP_SERVER_URL}`, params)
		return data
	},
)

const productSlice = createSlice({
	name: 'product',
	initialState,
	reducers: {
		setItems(state, action) {
			state.items = action.payload
		},
		setFetchFavorites(state, action) {
			state.fetchFavorites = action.payload
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchProducts.pending, (state) => {
			state.status = Status.LOADING
			state.items = []
		})
		builder.addCase(fetchProducts.fulfilled, (state, action) => {
			state.items = action.payload.products
			state.status = Status.SUCCESS
		})
		builder.addCase(fetchProducts.rejected, (state) => {
			state.status = Status.ERROR
			state.items = []
		})
		builder.addCase(createProduct.pending, (state) => {
			state.status = Status.LOADING
			state.items = []
		})
		builder.addCase(createProduct.fulfilled, (state, action) => {
			state.items = action.payload
			state.status = Status.SUCCESS
		})
		builder.addCase(createProduct.rejected, (state) => {
			state.status = Status.ERROR
			state.items = []
		})
	},
})

export const { setItems, setFetchFavorites } = productSlice.actions

export default productSlice.reducer
