import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import nodemailer from 'nodemailer'

export const postEmail = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			pool.query(
				`SELECT carts.*, users.name_user AS user_name, users.fname_user AS user_fname, users.oname_user AS user_oname, users.email AS user_email, users.phone_number AS user_phone, product.price
				FROM carts INNER JOIN users ON carts.user_id = users.id INNER JOIN product ON carts.product_id = product.id WHERE carts.user_id = $1`,
				[decoded.id],
				(error: Error, results: QueryResult) => {
					if (error) throw error
					pool.query(
						'SELECT title, price FROM services WHERE id = ANY($1)',
						[req.body.services],
						(error: Error, resultsServices: QueryResult) => {
							if (error) throw error

							const promises = results.rows.map((row: any) => {
								return pool.query('SELECT title FROM product WHERE id = $1', [row.product_id])
							})

							Promise.all(promises).then((titlesResults: QueryResult[]) => {
								const titles = titlesResults.map(
									(titleResult: QueryResult) => titleResult.rows[0].title,
								)
								const counts = results.rows
									.map(
										(row: any) =>
											`Продукт: ${titles.shift()}\nКоличество: ${row.totalcount}\nЦена: ${
												row.price
											} ₽`,
									)
									.join(', \n\n')

								const countsServices = resultsServices.rows
									? resultsServices.rows
											.map((row: any) => `${row.title} ${row.price} ₽`)
											.join(', \n')
									: ''

								const transporter = nodemailer.createTransport({
									service: 'Gmail',
									auth: {
										user: `${process.env.EMAIL_LOGIN}`,
										pass: `${process.env.EMAIL_PASS}`,
									},
								})

								const mailOptions = {
									from: `${process.env.EMAIL_LOGIN}`,
									to: `${process.env.EMAIL_LOGIN}`,
									subject: 'Заказ',
									text: `ФИО пользователя: ${results.rows[0].user_fname} ${
										results.rows[0].user_name
									} ${results.rows[0].user_oname}.\nEmail: ${
										results.rows[0].user_email
									}\nНомер телефона: ${results.rows[0].user_phone}\n\n${counts}\n\n${
										Boolean(countsServices) ? `Услуги:\n${countsServices}` : ''
									}\n\nДоставка: ${req.body.address ? req.body.address : '-'}\n\nОбщая сумма: ${
										req.body.totalPrice
									}`,
								}

								transporter.sendMail(mailOptions, function (error: Error, info: any) {
									if (error) {
										console.log(error)
									} else {
										console.log('Email sent: ' + info.response)
									}
								})
								return res.status(200).json({ message: 'email has been posted' })
							})
						},
					)
				},
			)
		}
	})
}

export const postEmailComplaint = (req: Request, res: Response) => {
	pool.query(
		`SELECT reviews.*, users.name_user AS user_name, users.fname_user AS user_fname, users.oname_user AS user_oname, product.title
		FROM reviews 
		INNER JOIN users ON reviews.user_id = users.id 
		INNER JOIN product ON reviews.product_id = product.id 
		WHERE reviews.id = $1`,
		[req.params.id],
		(error: Error, results: QueryResult) => {
			if (error) throw error
			const transporter = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: `${process.env.EMAIL_LOGIN}`,
					pass: `${process.env.EMAIL_PASS}`,
				},
			})

			const mailOptions = {
				from: `${process.env.EMAIL_LOGIN}`,
				to: `${process.env.EMAIL_LOGIN}`,
				subject: 'Жалоба на комментарий',
				text: `ФИО пользователя: ${results.rows[0].user_fname} ${results.rows[0].user_name} ${results.rows[0].user_oname}.\n\nПродукт: ${req.body.name_product}\n\nПричина жалобы: ${req.body.desc}\n\n`,
			}

			transporter.sendMail(mailOptions, function (error: Error, info: any) {
				if (error) {
					console.log(error)
				} else {
					console.log('Email sent: ' + info.response)
				}
			})
			return res.status(200).json({ message: 'email has been posted' })
		},
	)
}

export const postEmailIdea = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

	jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			pool.query(
				`SELECT name_user, fname_user, oname_user, email FROM users WHERE id = $1`,
				[decoded.id],
				(error: Error, results: QueryResult) => {
					if (error) throw error
					const transporter = nodemailer.createTransport({
						service: 'Gmail',
						auth: {
							user: `${process.env.EMAIL_LOGIN}`,
							pass: `${process.env.EMAIL_PASS}`,
						},
					})

					const mailOptions = {
						from: `${process.env.EMAIL_LOGIN}`,
						to: `${process.env.EMAIL_LOGIN}`,
						subject: 'Идея',
						text: `ФИО пользователя: ${results.rows[0].name_user} ${results.rows[0].fname_user} ${results.rows[0].oname_user}.\n\nEmail: ${results.rows[0].email}\n\nПредложение: ${req.body.desc}\n\n`,
					}

					transporter.sendMail(mailOptions, function (error: Error, info: any) {
						if (error) {
							console.log(error)
						} else {
							console.log('Email sent: ' + info.response)
						}
					})
					return res.status(200).json({ message: 'email has been posted' })
				},
			)
		}
	})
}
