import jwt from 'jsonwebtoken'
import { Request, Response, query } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { v4 as uuidv4 } from 'uuid'

export const getFavoritesById = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			pool.query(
				`SELECT p.*, f.id AS favorite_id
        FROM product p
        JOIN favorites f ON p.id = f.product_id
        WHERE f.user_id = $1;`,
				[decoded.id],
				(error: Error, results: QueryResult) => {
					if (error) throw error
					res.status(200).json(results.rows)
				},
			)
		}
	})
}

export const getFavoritesByArr = (req: Request, res: Response) => {
	const arrFavorites = JSON.parse(req.query.arrFavorites as string)
	const values = arrFavorites.map((item: any) => `'${item}'`).join(',')

	const query = `SELECT * FROM product WHERE id IN (${values})`

	pool.query(query, (error: Error, results: QueryResult) => {
		if (error) {
			throw error
		}

		res.status(200).json(results.rows)
	})
}

export const createFavoritesItem = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			try {
				pool.query(
					'INSERT INTO favorites (id, product_id, user_id) VALUES ($1, $2, $3)',
					[uuidv4(), req.params.id, decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.status(200).json({
							message: 'Товар был успешно добавлен',
						})
					},
				)
			} catch (error) {
				console.log(error)
			}
		}
	})
}

export const createFavoritesArrItems = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			try {
				pool.query(
					'SELECT product_id FROM favorites WHERE user_id = $1',
					[decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						const existingProductIds = results.rows.map((row) => row.product_id) // Получаем массив существующих product_id

						const favArr = req.body.arrFavorites
						const newProductIds = favArr.filter(
							(productId: any) => !existingProductIds.includes(productId),
						)

						newProductIds.forEach((productId: string) => {
							pool.query(
								'INSERT INTO favorites (id, product_id, user_id) VALUES ($1, $2, $3)',
								[uuidv4(), productId, decoded.id],
								(error: Error, results: QueryResult) => {
									if (error) throw error
								},
							)
						})
						res.status(200).json({
							message: 'Товары были успешно добавлены',
						})
					},
				)
			} catch (error) {
				console.log(error)
			}
		}
	})
}

export const deleteFavoritesById = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			try {
				pool.query(
					'DELETE FROM favorites WHERE product_id = $1 AND user_id = $2',
					[req.params.id, decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.status(200).json({ message: 'Товар был удален' })
					},
				)
			} catch (error) {
				console.log(error)
			}
		}
	})
}

export const deleteFavorites = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			try {
				pool.query(
					`DELETE FROM favorites WHERE user_id = $1`,
					[decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.status(200).json({ message: 'Товары были удалены' })
					},
				)
			} catch (error) {
				console.log(error)
			}
		}
	})
}
