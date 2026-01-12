// packages\idae-api\src\lib\services\AuthService.ts

import type { Express, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export class AuthService {
	private jwtSecret: string;
	private tokenExpiration: string;

	constructor(jwtSecret: string, tokenExpiration: string) {
		this.jwtSecret = jwtSecret;
		this.tokenExpiration = tokenExpiration;
	}

	public generateToken(payload: object): string {
		return jwt.sign(payload, this.jwtSecret, { expiresIn: this.tokenExpiration as any });
	}

	public verifyToken(token: string): any {
		try {
			return jwt.verify(token, this.jwtSecret);
		} catch (error) {
			throw new Error('Invalid token');
		}
	}

	public refreshToken(token: string): string {
		const payload = this.verifyToken(token);
		delete payload.iat;
		delete payload.exp;
		return this.generateToken(payload);
	}

	public configureAuthRoutes(app: Express): void {
		app.post('/login', this.handleLogin.bind(this));
		app.post('/logout', this.handleLogout.bind(this));
		app.post('/refresh-token', this.handleRefreshToken.bind(this));
	}

	private handleLogin(req: Request, res: Response): void {
		const { username, password } = req.body;

		// Validate user credentials (this is a placeholder, replace with actual validation logic)
		if (username === 'admin' && password === 'password') {
			const payload = { username };
			const token = this.generateToken(payload);
			res.json({ token });
		} else {
			res.status(401).json({ error: 'Invalid credentials' });
		}
	}

	private handleLogout(req: Request, res: Response): void {
		// Invalidate the token (this is a placeholder, implement actual token invalidation logic if needed)
		res.json({ message: 'Logged out successfully' });
	}

	private handleRefreshToken(req: Request, res: Response): void {
		const { token } = req.body;

		try {
			const newToken = this.refreshToken(token);
			res.json({ token: newToken });
		} catch (error) {
			res.status(401).json({ error: 'Invalid token' });
		}
	}
}
