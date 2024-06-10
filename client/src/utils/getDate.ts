export const getDate = () => {
	const date = new Date()
	const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
	const month = date.getMonth() >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
	const year = date.getFullYear()

	const hours = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`
	const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`

	return `${year}-${month}-${day} ${hours}:${minutes}:00`
}
