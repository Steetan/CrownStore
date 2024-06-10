import { RootState } from './../store'
import customAxios from '../../axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum Status {
	LOADING = 'loading',
	SUCCESS = 'success',
	ERROR = 'error',
}

export type typeCartItem = {
	id: string
	title: string
	imgurl: string
	price: number
	count: number
}

type typeInitialState = {
	totalPrice: number
	totalCount: number
	cartItems: typeCartItem[]
	status: Status
	countProduct: { product: string; count: number }[]
	isCheckedAddress: boolean
	totalPriceServices: number
}

const initialState: typeInitialState = {
	totalPrice: 0,
	totalCount: 0,
	cartItems: [],
	countProduct: [],
	status: Status.LOADING,
	isCheckedAddress: false,
	totalPriceServices: 0,
}

export const getCart = createAsyncThunk('auth/getCart', async () => {
	const { data } = await customAxios.get(`${process.env.REACT_APP_SERVER_URL}/cart/get`)
	return data
})

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setTotalPrice: (state, action: PayloadAction<number>) => {
			state.totalPrice = action.payload
		},
		setTotalCount: (state, action: PayloadAction<any>) => {
			state.totalCount = action.payload
		},
		setCountProduct: (state, action: PayloadAction<{ product: string; count: number }[]>) => {
			state.countProduct = action.payload
		},
		setIsCheckedAddress: (state, action: PayloadAction<boolean>) => {
			state.isCheckedAddress = action.payload
		},
		setTotalPriceServices: (state, action: PayloadAction<number>) => {
			state.totalPriceServices = action.payload
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getCart.pending, (state) => {
			state.status = Status.LOADING
		})
		builder.addCase(getCart.fulfilled, (state, action) => {
			state.status = Status.SUCCESS
			state.cartItems = action.payload.results
		})
		builder.addCase(getCart.rejected, (state) => {
			state.status = Status.ERROR
		})
	},
})

export const selectCart = (state: RootState) => state.cartSlice

export const {
	setTotalPrice,
	setTotalCount,
	setCountProduct,
	setIsCheckedAddress,
	setTotalPriceServices,
} = cartSlice.actions

export default cartSlice.reducer
