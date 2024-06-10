import jwt from 'jsonwebtoken'
import { Request, Response, query } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from '../../node_modules/express-validator/src/validation-result.js'
import fs from 'fs'

export const getAllServices = (req: Request, res: Response) => {
	pool.query('SELECT * FROM services', (error: Error, results: QueryResult) => {
		if (error) throw error
		res.status(200).json(results.rows)
	})
}

export const updateService = (req: Request, res: Response) => {
	pool.query(
		'UPDATE services SET title = $1, description = $2, price = $3 WHERE id = $4',
		[req.body.title, req.body.description, req.body.price, req.body.id],
		(error: Error, results: QueryResult) => {
			if (error) throw error
			res.status(200).json({ message: 'Услуга была обновлена' })
		},
	)
}

export const createService = (req: Request, res: Response) => {
	try {
		pool.query(
			'INSERT INTO services (id, title, description, price) VALUES ($1, $2, $3, $4)',
			[uuidv4(), req.body.title, req.body.description, req.body.price],
			(error: Error, results: QueryResult) => {
				if (error) throw error
				res.status(200).json({
					message: 'Услуга была успешно добавлена',
				})
			},
		)
	} catch (error) {
		console.log(error)
	}
}

export const deleteServiceById = (req: Request, res: Response) => {
	try {
		pool.query(
			'DELETE FROM services WHERE id = $1',
			[req.params.id],
			(error: Error, results: QueryResult) => {
				if (error) throw error
				res.status(200).json({ message: 'Услуга была удалена' })
			},
		)
	} catch (error) {
		console.log(error)
	}
}

export const deleteServices = (req: Request, res: Response) => {
	try {
		pool.query('DELETE FROM services', (error: Error, results: QueryResult) => {
			if (error) throw error
			res.status(200).json({ message: 'Услуги были удалены' })
		})
	} catch (error) {
		console.log(error)
	}
}
