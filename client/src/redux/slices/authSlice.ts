import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'
import customAxios from '../../axios'
import { FormData } from '../../pages/Registration'

export const fetchUserData = createAsyncThunk(
	'auth/fetchUserData',
	async (params: { email: string; password: string }) => {
		const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`, params)
		return data
	},
)

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params: FormData) => {
	const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/reg`, params)
	return data
})

export const fetchUserMe = createAsyncThunk('auth/fetchUserDataMe', async () => {
	const { data } = await customAxios.get(`${process.env.REACT_APP_SERVER_URL}/auth/me`)
	return data
})

export const fetchAdminMe = createAsyncThunk('auth/fetchAdminMe', async () => {
	const { data } = await customAxios.get(`${process.env.REACT_APP_SERVER_URL}/auth/adminme`)
	return data
})

export const fetchDeleteMe = createAsyncThunk(
	'auth/fetchUserDataMe',
	async (params: string | null, { rejectWithValue }) => {
		try {
			const { data } = await customAxios.delete(
				`${process.env.REACT_APP_SERVER_URL}/auth/delete?token=${params}`,
			)
			return data
		} catch (error: any) {
			return rejectWithValue(error.message)
		}
	},
)

export enum Status {
	LOADING = 'loading',
	SUCCESS = 'success',
	ERROR = 'error',
}

type TypeAuthState = {
	data: any
	status: string
	userImgUrl: string
	isAdmin: boolean
	isAuth: boolean
	isDarkTheme: boolean
}

const initialState: TypeAuthState = {
	data: null,
	status: Status.LOADING,
	userImgUrl: '',
	isAdmin: false,
	isAuth: false,
	isDarkTheme: false,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.data = null
		},
		setUserImgUrl: (state, action) => {
			state.userImgUrl = action.payload
		},
		setIsAdmin: (state, action) => {
			state.isAdmin = action.payload
		},
		setIsAuth: (state, action) => {
			state.isAuth = action.payload
		},
		setIsDarkTheme: (state, action) => {
			state.isDarkTheme = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				isAnyOf(
					fetchUserData.pending,
					fetchUserMe.pending,
					fetchRegister.pending,
					fetchAdminMe.pending,
					fetchDeleteMe.pending,
				),
				(state) => {
					state.status = Status.LOADING
					state.data = null
				},
			)
			.addMatcher(
				isAnyOf(
					fetchUserData.fulfilled,
					fetchUserMe.fulfilled,
					fetchRegister.fulfilled,
					fetchAdminMe.fulfilled,
				),
				(state, action) => {
					state.data = action.payload
					state.status = Status.SUCCESS
				},
			)
			.addMatcher(
				isAnyOf(
					fetchUserData.rejected,
					fetchUserMe.rejected,
					fetchRegister.rejected,
					fetchAdminMe.rejected,
					fetchDeleteMe.rejected,
				),
				(state) => {
					state.status = Status.ERROR
					state.data = null
				},
			)
	},
})

export const selectIsAuth = (state: RootState) => state.authSlice.data

export const selectIsAuthAdmin = (state: RootState) => Boolean(state.authSlice.data)

export default authSlice.reducer

export const { logout, setUserImgUrl, setIsAdmin, setIsAuth, setIsDarkTheme } = authSlice.actions
