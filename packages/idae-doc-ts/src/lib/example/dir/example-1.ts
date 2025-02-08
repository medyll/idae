/**
 * Interface representing a generic user
 */
export interface User {
	id: number;
	name: string;
	email: string;
}

/**
 * Enum representing user roles
 */
export enum UserRole {
	Admin,
	Editor,
	Viewer
}

/**
 * Type alias for a list of users
 */
export type UserList = User[];

/**
 * Class representing a system user
 */
export class SystemUser implements User {
	id: number;
	name: string;
	email: string;
	role: UserRole;

	/**
	 * Constructor for SystemUser
	 * @param id - User ID
	 * @param name - User name
	 * @param email - User email
	 * @param role - User role
	 */
	constructor(id: number, name: string, email: string, role: UserRole) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.role = role;
	}

	/**
	 * Get user info
	 * @returns User information as a string
	 */
	getUserInfo(): string {
		return `${this.name} (${this.email}) - Role: ${UserRole[this.role]}`;
	}
}
