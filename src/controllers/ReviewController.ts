import jwt from 'jsonwebtoken'
import { Request, Response, query } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from '../../node_modules/express-validator/src/validation-result.js'

export const createReview = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			try {
				const errors = validationResult(req)
				if (!errors.isEmpty()) {
					return res.status(400).json(errors.array())
				}

				pool.query(
					"INSERT INTO reviews (id, user_id, count_stars, description, product_id, date) VALUES ($1, $2, $3, $4, $5, TO_TIMESTAMP($6, 'YYYY-MM-DD HH24:MI'))",
					[
						uuidv4(),
						decoded.id,
						req.body.count_stars,
						req.body.description,
						req.params.id,
						req.body.date,
					],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						pool.query(
							'SELECT count_stars FROM reviews WHERE product_id = $1',
							[req.params.id],
							(error: Error, results: QueryResult) => {
								if (error) throw error

								let totalRating = 0
								results.rows.forEach((item) => {
									totalRating += Number(item.count_stars)
								})

								pool.query(
									'UPDATE product SET rating = $1 WHERE id = $2',
									[totalRating / results.rows.length, req.params.id],
									(error: Error, results: QueryResult) => {
										if (error) throw error
										res.status(200).json({
											message: 'Отзыв был успешно добавлен',
										})
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
	})
}

export const getReviewById = (req: Request, res: Response) => {
	pool.query(
		`SELECT reviews.*, users.name_user, users.fname_user, users.user_imgurl 
    FROM reviews 
    LEFT JOIN users ON reviews.user_id = users.id 
    WHERE reviews.product_id = $1 
    AND reviews.count_stars ${req.query.sort} 
    ORDER BY reviews.date ${req.query.type}`,
		[req.params.id],
		(error: Error, resultsReviews: QueryResult) => {
			if (error) throw error
			pool.query(
				'SELECT count_stars FROM reviews WHERE product_id = $1',
				[req.params.id],
				(error: Error, results: QueryResult) => {
					if (error) throw error

					let totalRating = 0
					results.rows.forEach((item) => {
						totalRating += Number(item.count_stars)
					})

					pool.query(
						'UPDATE product SET rating = $1 WHERE id = $2',
						[totalRating ? totalRating / results.rows.length : 0, req.params.id],
						(error: Error, results: QueryResult) => {
							if (error) throw error
							res.status(200).json(resultsReviews.rows)
						},
					)
				},
			)
		},
	)
}

export const deleteReviewById = (req: Request, res: Response) => {
	pool.query(
		'DELETE FROM reviews WHERE id = $1',
		[req.params.id],
		(error: Error, results: QueryResult) => {
			if (error) throw error
			pool.query(
				'DELETE FROM reviews_likes WHERE review_id = $1',
				[req.params.id],
				(error: Error) => {
					if (error) throw error
					res.status(200).json({ message: 'Отзыв был удален' })
				},
			)
		},
	)
}

export const deleteReviews = (req: Request, res: Response) => {
	pool.query('DELETE FROM reviews', [req.body.id], (error: Error, results: QueryResult) => {
		if (error) throw error
		res.status(200).json({ message: 'Отзывы были удалены' })
	})
}

export const createLike = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			pool.query(
				'SELECT * FROM reviews_likes WHERE review_id = $1 AND user_id = $2',
				[req.params.id, decoded.id],
				(error: Error, results: QueryResult) => {
					if (error) throw error
					!results.rows.length &&
						pool.query(
							'INSERT INTO reviews_likes (id, review_id, user_id, product_id) VALUES ($1, $2, $3, $4)',
							[uuidv4(), req.params.id, decoded.id, req.body.product_id],
							(error: Error) => {
								if (error) throw error
							},
						)
					res.status(200).json({ message: 'Вы поставили лайк' })
				},
			)
		}
	})
}

export const deleteLike = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			pool.query(
				'DELETE FROM reviews_likes WHERE review_id = $1 AND user_id = $2',
				[req.params.id, decoded.id],
				(error: Error) => {
					if (error) throw error
					res.status(200).json({ message: 'Вы убрали лайк' })
				},
			)
		}
	})
}

export const getLikeById = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			pool.query(
				'SELECT * FROM reviews_likes WHERE review_id = $1',
				[req.params.id],
				(error: Error, results: QueryResult) => {
					if (error) throw error
					res.status(200).json(results.rows)
				},
			)
		}
	})
}

export const getLikeByIdMe = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			pool.query(
				'SELECT * FROM reviews_likes WHERE review_id = $1 AND user_id = $2',
				[req.params.id, decoded.id],
				(error: Error, results: QueryResult) => {
					if (error) throw error
					res.status(200).json(results.rows)
				},
			)
		}
	})
}
