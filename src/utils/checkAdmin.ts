import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'

export default (req: Request, res: Response, next: NextFunction) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.json({ error: 'Неверный токен' })
		} else {
			pool.query(
				'SELECT FROM users WHERE id = $1 AND access = true',
				[decoded.id],
				(error: Error, results: QueryResult) => {
					if (!results.rows.length) {
						res.json({
							error: 'нет доступа',
						})
					} else {
						next()
					}
				},
			)
		}
	})
}
