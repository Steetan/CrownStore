import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type typeSortSlice = {
	name: string
	sort: string
}

type IFilterSliceState = {
	categoryId: number
	nameCategory: string
	selectedPage: number
	searchInput: string
	sort: typeSortSlice
	typeSort: typeSortSlice
	isVisibleFilterPopup: boolean
	fromRangeFilter: number
	toRangeFilter: number
	selectedRatingFilter: null | number
	maxRangePrice: number
	minRangePrice: number
}

const initialState: IFilterSliceState = {
	categoryId: 0,
	nameCategory: 'Все',
	selectedPage: 1,
	searchInput: '',
	sort: {
		name: 'популярности',
		sort: 'rating',
	},
	typeSort: {
		name: 'возрастанию',
		sort: 'asc',
	},
	isVisibleFilterPopup: false,
	fromRangeFilter: 0,
	toRangeFilter: 0,
	selectedRatingFilter: null,
	maxRangePrice: 0,
	minRangePrice: 0,
}

const filterSlice = createSlice({
	name: 'filter',
	initialState,
	reducers: {
		setCategoryId(state, action: PayloadAction<number>) {
			state.categoryId = action.payload
		},
		setSort(state, action: PayloadAction<typeSortSlice>) {
			state.sort = action.payload
		},
		setTypeSort(state, action: PayloadAction<typeSortSlice>) {
			state.typeSort = action.payload
		},
		setNameCategory(state, action: PayloadAction<string>) {
			state.nameCategory = action.payload
		},
		setSearchInput(state, action: PayloadAction<string>) {
			state.searchInput = action.payload
		},
		setSelectedPage(state, action: PayloadAction<number>) {
			state.selectedPage = action.payload
		},
		setIsVisibleFilterPopup(state, action: PayloadAction<boolean>) {
			state.isVisibleFilterPopup = action.payload
		},
		setFromRangeFilter(state, action: PayloadAction<number>) {
			state.fromRangeFilter = action.payload
		},
		setToRangeFilter(state, action: PayloadAction<number>) {
			state.toRangeFilter = action.payload
		},
		setSelectedRatingFilter(state, action: PayloadAction<null | number>) {
			state.selectedRatingFilter = action.payload
		},
		setMinPrice(state, action: PayloadAction<number>) {
			state.minRangePrice = action.payload
		},
		setMaxPrice(state, action: PayloadAction<number>) {
			state.maxRangePrice = action.payload
		},
		setFilters(state, action) {
			state.sort = action.payload.sort
			state.typeSort = action.payload.typeSort
			state.selectedPage = Number(action.payload.selectedPage)
			state.categoryId = Number(action.payload.categoryId)
			state.nameCategory = action.payload.nameCategory
		},
	},
})

export const {
	setCategoryId,
	setSort,
	setTypeSort,
	setNameCategory,
	setSearchInput,
	setSelectedPage,
	setFilters,
	setIsVisibleFilterPopup,
	setFromRangeFilter,
	setToRangeFilter,
	setSelectedRatingFilter,
	setMinPrice,
	setMaxPrice,
} = filterSlice.actions

export default filterSlice.reducer
