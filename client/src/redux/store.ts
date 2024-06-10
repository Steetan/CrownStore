import authSlice from './slices/authSlice'
import { configureStore } from '@reduxjs/toolkit'
import filterSlice from './slices/filterSlice'
import cartSlice from './slices/cartSlice'
import productSlice from './slices/productSlice'
import { useDispatch } from 'react-redux'

const store = configureStore({
	reducer: {
		authSlice,
		filterSlice,
		cartSlice,
		productSlice,
	},
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export default store
