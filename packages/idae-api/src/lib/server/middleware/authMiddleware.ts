// packages\idae-api\src\lib\authMiddleware.ts

import type { Express, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

class AuthMiddleWare {
	private jwtSecret: string;
	private tokenExpiration: string;

	constructor(jwtSecret: string, tokenExpiration: string) {
		this.jwtSecret = jwtSecret.length < 32 ? jwtSecret.padEnd(32, '0') : jwtSecret;
		this.tokenExpiration = tokenExpiration;
	}

	// Generate a JWT token
	public generateToken(payload: object): string {
		const jti = randomUUID();
		return jwt.sign({ ...payload, jti }, this.jwtSecret, {
			expiresIn: this.tokenExpiration
		});
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
		delete (payload as any).iat;
		delete (payload as any).exp;

		// Ensure refreshed token differs from the original by bumping timestamp and adding jitter
		const refreshedPayload = {
			...payload,
			// Used to guarantee a new signature even when refreshed within the same second
			__refreshedAt: Date.now(),
			jti: randomUUID()
		};

		return jwt.sign(refreshedPayload, this.jwtSecret, {
			expiresIn: this.tokenExpiration
		});
	}

	public toString(): string {
		return `AuthMiddleWare(hardcodedPassword=password)`;
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
