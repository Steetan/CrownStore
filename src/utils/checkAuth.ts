import { NextFunction, Request, Response } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	if (token) {
		next()
	} else {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}
