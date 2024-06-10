import jwt from 'jsonwebtoken'
import { Request, Response, query } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from '../../node_modules/express-validator/src/validation-result.js'

export const createOrder = (req: Request, res: Response) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				const generateId = uuidv4()
				const cartItems = req.body.cartItems
				const serviceItems = req.body.serviceItems
				pool.query(
					"INSERT INTO orders (id, date, sum, user_id, status) VALUES ($1, TO_TIMESTAMP($2, 'YYYY-MM-DD HH24:MI'), $3, $4, $5)",
					[generateId, req.body.date, req.body.sum, decoded.id, 'активный'],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						cartItems.forEach((item: any) => {
							pool.query(
								'INSERT INTO orders_product(id, order_id, product_id, product_title, product_count, product_price, product_img) VALUES($1, $2, $3, $4, $5, $6, $7)',
								[
									uuidv4(),
									generateId,
									item.product_id,
									item.title,
									item.totalcount,
									item.res_price,
									item.imgurl,
								],
								(error: Error, results: QueryResult) => {
									if (error) throw error
								},
							)
						})
						serviceItems.forEach((item: any) => {
							pool.query(
								'INSERT INTO orders_service(id, order_id, service_id, service_title, service_price) VALUES($1, $2, $3, $4, $5)',
								[uuidv4(), generateId, item.id, item.title, item.price],
								(error: Error, results: QueryResult) => {
									if (error) throw error
								},
							)
						})
						res.status(200).json({
							message: 'Заказ был успешно добавлен',
						})
					},
				)
			}
		})
	} catch (error) {
		console.log(error)
	}
}

export const getAllOrders = (req: Request, res: Response) => {
	try {
		pool.query('SELECT * FROM orders', (error: Error, results: QueryResult) => {
			if (error) throw error
			res.status(200).json(results.rows)
		})
	} catch (error) {
		console.log(error)
	}
}

export const deleteAllOrders = (req: Request, res: Response) => {
	try {
		pool.query('DELETE FROM orders', (error: Error, results: QueryResult) => {
			if (error) throw error
			pool.query('DELETE FROM orders_product', (error: Error, results: QueryResult) => {
				if (error) throw error
				pool.query('DELETE FROM orders_service', (error: Error, results: QueryResult) => {
					if (error) throw error
					res.status(200).json(results.rows)
				})
			})
		})
	} catch (error) {
		console.log(error)
	}
}

export const deleteOrderById = (req: Request, res: Response) => {
	try {
		pool.query(
			'DELETE FROM orders WHERE id = $1',
			[req.params.id],
			(error: Error, results: QueryResult) => {
				if (error) throw error
				pool.query(
					'DELETE FROM orders_product WHERE order_id = $1',
					[req.params.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						pool.query(
							'DELETE FROM orders_service WHERE order_id = $1',
							[req.params.id],
							(error: Error, results: QueryResult) => {
								if (error) throw error
								res.status(200).json(results.rows)
							},
						)
					},
				)
			},
		)
	} catch (error) {
		console.log(error)
	}
}

export const getOrdersById = (req: Request, res: Response) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'SELECT * FROM orders WHERE user_id = $1',
					[decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.status(200).json(results.rows)
					},
				)
			}
		})
	} catch (error) {
		console.log(error)
	}
}

export const getOrderInfoById = (req: Request, res: Response) => {
	try {
		pool.query(
			'SELECT * FROM orders_product WHERE order_id = $1',
			[req.params.id],
			(error: Error, resultsProduct: QueryResult) => {
				if (error) throw error
				pool.query(
					'SELECT * FROM orders_service WHERE order_id = $1',
					[req.params.id],
					(error: Error, resultsService: QueryResult) => {
						if (error) throw error
						res.status(200).json({
							products: resultsProduct.rows,
							services: resultsService.rows,
						})
					},
				)
			},
		)
	} catch (error) {
		console.log(error)
	}
}

export const updateOrderStatus = (req: Request, res: Response) => {
	try {
		pool.query(
			`UPDATE orders SET status = $1 WHERE id = $2`,
			[req.body.status, req.params.id],
			(error: Error, resultsProduct: QueryResult) => {
				if (error) throw error
				res.status(200).json({ message: 'Статус заказа был обновлен' })
			},
		)
	} catch (error) {
		console.log(error)
	}
}
