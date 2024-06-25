import moment from 'moment'

export const translateDate = (data: any) => {
	const newDate = data.map((item: any) => {
		const dateObj = moment(item.date).utcOffset('+0300')
		const formattedDate = dateObj.format('DD.MM.YYYY')
		const formattedTime = dateObj.format('HH:mm')

		return {
			...item,
			date: `${formattedDate}, ${formattedTime}`,
		}
	})

	return newDate
}
