// packages\idae-api\src\lib\services\AuthService.ts

import jwt from 'jsonwebtoken';

export class AuthService {
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
}
