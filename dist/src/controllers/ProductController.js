import { pool } from '../db.js'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from '../../node_modules/express-validator/src/validation-result.js'
export const getProducts = (req, res) => {
	let sortBy = req.query.sortBy || 'id'
	let order = req.query.order || 'ASC'
	let category = parseInt(req.query.category) || 0
	let search = req.query.search || ''
	let page = parseInt(req.query.page) || 1
	let limit = parseInt(req.query.limit) || 8
	let fromRange = parseInt(req.query.fromRange) || 0
	let toRange = parseInt(req.query.toRange)
	let selectedRating = req.query.selectedRatingFilter
	let parseSelectedRating = ''
	switch (selectedRating) {
		case '0':
			parseSelectedRating = 'rating >= 4'
			break
		case '1':
			parseSelectedRating = 'rating <= 3'
			break
		default:
			parseSelectedRating = ''
			break
	}
	let queryString = `SELECT * FROM product ${
		!search && category ? `WHERE category=${category}` : ''
	} ${search ? `WHERE title ILIKE ${"'%" + search + "%'"} ` : ''}`
	if (!category && !search) {
		queryString += toRange
			? `WHERE price >= ${fromRange} AND price <= ${toRange} `
			: `WHERE price >= ${fromRange} `
		queryString += parseSelectedRating !== '' ? `AND ${parseSelectedRating} ` : ''
	}
	if (category || search) {
		queryString += toRange
			? `AND price >= ${fromRange} AND price <= ${toRange} `
			: `AND price >= ${fromRange} `
		queryString += Boolean(parseSelectedRating) ? `AND ${parseSelectedRating} ` : ''
	}
	queryString += `ORDER BY ${sortBy} ${order}`

	pool.query(queryString, (error, results) => {
		if (error) throw error
		let startIndex = (page - 1) * limit
		let endIndex = page * limit
		let paginatedResults = results.rows.slice(startIndex, endIndex)
		let totalProducts = results.rows.length
		let totalPages = Math.ceil(totalProducts / limit)
		res.status(200).json({
			products: paginatedResults,
			totalPages: totalPages,
		})
	})
}
export const getProductById = (req, res) => {
	pool.query('SELECT * FROM product WHERE id = $1', [req.params.id], (error, results) => {
		if (error) throw error
		res.status(200).json(results.rows)
	})
}
export const createProduct = (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}
		pool.query(
			'INSERT INTO product (id, title, description, price, category, imgurl, rating, totalcount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
			[
				uuidv4(),
				req.body.title,
				req.body.description,
				req.body.price,
				req.body.category,
				req.body.imgurl,
				req.body.rating,
				req.body.totalcount,
			],
			(error, results) => {
				if (error) throw error
				res.status(200).json({
					message: 'Продукт был успешно добавлен',
				})
			},
		)
	} catch (error) {
		console.log(error)
	}
}
