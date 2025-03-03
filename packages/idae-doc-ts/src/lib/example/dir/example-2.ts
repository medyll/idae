import type { User, UserList, Repository } from './types.js';
import { UserRole } from './types.js';

/**
 * Class representing a user repository
 */
class UserRepository implements Repository<User> {
	private users: UserList = [];

	/**
	 * Add a user to the repository
	 * @param user - User to add
	 */
	add(user: User): void {
		this.users.push(user);
	}

	/**
	 * Get a user by ID
	 * @param id - User ID
	 * @returns User or undefined
	 */
	get(id: number): User | undefined {
		return this.users.find((user) => user.id === id);
	}

	/**
	 * Get all users
	 * @returns List of users
	 */
	getAll(): UserList {
		return this.users;
	}
}
