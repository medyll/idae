export type UserNameSimple = string;
export type UserEmail = string;

/**
 * Interface representing a generic user
 */
export interface User {
	/** Unique identifier for the user */
	id: number;
	/** Name of the user */
	name: string;
	/** Email address of the user */
	email?: string;
}

/**
 * Enum representing user roles
 */
export enum UserRole {
	/** Administrator with full permissions */
	Admin,
	/** Editor with modification permissions */
	Editor,
	/** Viewer with read-only permissions */
	Viewer
}

/**
 * Type alias for a list of users
 */
export type UserList = User[];

/**
 * Generic interface for a repository
 * @template T The type of items in the repository
 */
export interface Repository<T> {
	/**
	 * Adds an item to the repository
	 * @param item The item to add
	 */
	add(item: T): void;
	/**
	 * Retrieves an item by its identifier
	 * @param id The identifier of the item
	 * @returns The corresponding item or undefined
	 */
	get(id: number): T | undefined;
	/**
	 * Retrieves all items in the repository
	 * @returns A list of all items
	 */
	getAll(): T[];
}

/**
 * Properties for the Example component
 */
export type ExampleProps = {
	/** CSS class for the component */
	class: string;
	/** Message to display */
	message: string;
	/** Indicates if the component is draggable */
	draggable?: boolean;
	/** Alert level */
	level?: any;
	/** Children of the component */
	children?: any;
	/** Button at the top of the alert */
	alertTopButton?: any;
};
