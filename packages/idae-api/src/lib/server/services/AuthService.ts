// packages\idae-api\src\lib\services\AuthService.ts

import type { Express, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Callback used to validate login credentials.
 * Implement and inject this to connect AuthService to a real user store.
 * @returns true if credentials are valid, false otherwise.
 */
export type UserValidatorFn = (
	username: string,
	password: string
) => boolean | Promise<boolean>;

export class AuthService {
	private jwtSecret: string;
	private tokenExpiration: string;
	private validateUser: UserValidatorFn | null;

	constructor(
		jwtSecret: string,
		tokenExpiration: string,
		validateUser: UserValidatorFn | null = null
	) {
		this.jwtSecret = jwtSecret;
		this.tokenExpiration = tokenExpiration;
		this.validateUser = validateUser;
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

	private async handleLogin(req: Request, res: Response): Promise<void> {
		if (!this.validateUser) {
			res.status(501).json({ error: 'Login not implemented: no user validator provided.' });
			return;
		}

		const { username, password } = req.body;

		if (!username || !password) {
			res.status(400).json({ error: 'username and password are required.' });
			return;
		}

		try {
			const valid = await this.validateUser(username, password);
			if (valid) {
				const token = this.generateToken({ username });
				res.json({ token });
			} else {
				res.status(401).json({ error: 'Invalid credentials.' });
			}
		} catch {
			res.status(500).json({ error: 'Authentication error.' });
		}
	}

	private handleLogout(_req: Request, res: Response): void {
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
