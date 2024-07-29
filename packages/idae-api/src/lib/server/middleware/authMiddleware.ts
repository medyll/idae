// packages\idae-api\src\lib\authMiddleware.ts

import type { Express, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

class AuthMiddleWare {
	private jwtSecret: string;
	private tokenExpiration: string;

	constructor(jwtSecret: string, tokenExpiration: string) {
		this.jwtSecret = jwtSecret;
		this.tokenExpiration = tokenExpiration;
	}

	// Generate a JWT token
	public generateToken(payload: object): string {
		return jwt.sign(payload, this.jwtSecret, { expiresIn: this.tokenExpiration });
	}

	// Verify a JWT token
	public verifyToken(token: string): any {
		try {
			return jwt.verify(token, this.jwtSecret);
		} catch (error) {
			throw new Error('Invalid token');
		}
	}

	// Refresh a JWT token
	public refreshToken(token: string): string {
		const payload = this.verifyToken(token);
		delete payload.iat;
		delete payload.exp;
		return this.generateToken(payload);
	}

	// Middleware to verify JWT token
	public createMiddleware() {
		return (req: Request, res: Response, next: NextFunction) => {
			const authHeader = req.headers.authorization;

			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			const token = authHeader.split(' ')[1];

			try {
				const user = this.verifyToken(token);
				req.user = user; // Attach user info to the request object
				next();
			} catch (error) {
				return res.status(401).json({ error: 'Unauthorized' });
			}
		};
	}

	// Configure authentication routes
	public configureAuthRoutes(app: Express): void {
		app.post('/login', this.handleLogin.bind(this));
		app.post('/logout', this.handleLogout.bind(this));
		app.post('/refresh-token', this.handleRefreshToken.bind(this));
	}

	// Handle login
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

	// Handle logout
	private handleLogout(req: Request, res: Response): void {
		// Invalidate the token (this is a placeholder, implement actual token invalidation logic if needed)
		res.json({ message: 'Logged out successfully' });
	}

	// Handle token refresh
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
// always use named exports !
export { AuthMiddleWare };
