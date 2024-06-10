export const translateDate = (data: any) => {
	const newDate = data.map((item: any) => {
		const dateObj = new Date(item.date)

		const formattedDate = dateObj.toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})

		const formattedTime = dateObj.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
		})
		return {
			...item,
			date: `${formattedDate}, ${formattedTime}`,
		}
	})

	return newDate
}
