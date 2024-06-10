import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const rootElement = document.getElementById('root')

const queryClient = new QueryClient()

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Provider store={store}>
					<App />
				</Provider>
			</BrowserRouter>
		</QueryClientProvider>,
	)
}
