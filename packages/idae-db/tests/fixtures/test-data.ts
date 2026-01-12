/**
 * Test data fixtures
 */

export const testUsers = [
	{
		name: 'Alice Johnson',
		email: 'alice@example.com',
		age: 28,
		active: true
	},
	{
		name: 'Bob Smith',
		email: 'bob@example.com',
		age: 35,
		active: true
	},
	{
		name: 'Charlie Brown',
		email: 'charlie@example.com',
		age: 42,
		active: false
	},
	{
		name: 'Diana Prince',
		email: 'diana@example.com',
		age: 31,
		active: true
	}
];

export const testProducts = [
	{
		name: 'Laptop',
		price: 1200,
		stock: 5,
		category: 'Electronics'
	},
	{
		name: 'Mouse',
		price: 25,
		stock: 50,
		category: 'Electronics'
	},
	{
		name: 'Desk',
		price: 300,
		stock: 3,
		category: 'Furniture'
	},
	{
		name: 'Chair',
		price: 150,
		stock: 8,
		category: 'Furniture'
	}
];

export const testOrders = [
	{
		userId: '1',
		productId: '1',
		quantity: 2,
		total: 2400,
		status: 'pending'
	},
	{
		userId: '2',
		productId: '2',
		quantity: 5,
		total: 125,
		status: 'delivered'
	},
	{
		userId: '1',
		productId: '3',
		quantity: 1,
		total: 300,
		status: 'processing'
	}
];

export type TestUser = (typeof testUsers)[0];
export type TestProduct = (typeof testProducts)[0];
export type TestOrder = (typeof testOrders)[0];
