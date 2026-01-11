/**
 * Test Fixtures & Mock Data
 * Centralized test data for consistent test scenarios
 */

export const mockUsers = [
	{
		id: '1',
		name: 'Alice Johnson',
		email: 'alice@example.com',
		role: 'admin',
		age: 28,
		active: true,
		createdAt: '2026-01-01T00:00:00Z'
	},
	{
		id: '2',
		name: 'Bob Smith',
		email: 'bob@example.com',
		role: 'user',
		age: 25,
		active: true,
		createdAt: '2026-01-02T00:00:00Z'
	},
	{
		id: '3',
		name: 'Charlie Brown',
		email: 'charlie@example.com',
		role: 'user',
		age: 32,
		active: false,
		createdAt: '2026-01-03T00:00:00Z'
	}
];

export const mockPosts = [
	{
		id: '1',
		title: 'First Post',
		content: 'This is the first post',
		authorId: '1',
		published: true,
		createdAt: '2026-01-10T00:00:00Z'
	},
	{
		id: '2',
		title: 'Second Post',
		content: 'This is the second post',
		authorId: '2',
		published: false,
		createdAt: '2026-01-11T00:00:00Z'
	}
];

export const mockComments = [
	{
		id: '1',
		text: 'Great post!',
		postId: '1',
		authorId: '2',
		createdAt: '2026-01-10T12:00:00Z'
	},
	{
		id: '2',
		text: 'I agree',
		postId: '1',
		authorId: '3',
		createdAt: '2026-01-10T13:00:00Z'
	}
];

export const mockTokens = {
	valid: {
		admin: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIn0.mock',
		user: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJyb2xlIjoidXNlciJ9.mock',
		expired: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJleHAiOjE2MDAwMDAwMDB9.mock'
	},
	invalid: {
		malformed: 'not.a.token',
		tampered: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhY2tlciIsInJvbGUiOiJhZG1pbiJ9.wrong',
		none: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VybmFtZSI6ImhheGVyIn0.'
	}
};

export const mockSQLInjectionPayloads = [
	"'; DROP TABLE users; --",
	"1' OR '1'='1",
	"admin'--",
	"1; DELETE FROM users; --",
	"' OR 1=1 --"
];

export const mockNoSQLInjectionPayloads = [
	{ $ne: null },
	{ $where: 'function() { return true }' },
	{ $function: { body: 'function(x) { return true }', args: ['$field'], lang: 'js' } },
	{ $regex: '.*' },
	{ $gt: '' }
];

export const mockXSSPayloads = [
	'<script>alert("XSS")</script>',
	'<img src=x onerror="alert(\'XSS\')">',
	'<svg onload="alert(\'XSS\')">',
	'javascript:alert("XSS")',
	'<iframe src="javascript:alert(\'XSS\')">',
	'<body onload="alert(\'XSS\')">',
	'<input onfocus="alert(\'XSS\')" autofocus>',
	'<marquee onstart="alert(\'XSS\')">'
];

export const mockCSRFPayloads = [
	{ csrfToken: 'forged' },
	{ _token: 'invalid' },
	{ 'x-csrf-token': 'wrong' }
];

export const mockEdgeCasesData = {
	veryLongString: 'a'.repeat(10000),
	unicodeChars: '你好世界🚀',
	specialChars: "!@#$%^&*()_+-=[]{}|;':\",./<>?",
	nullByte: 'test\x00value',
	newlines: 'line1\nline2\rline3\r\nline4',
	tabs: 'col1\tcol2\tcol3'
};

export const mockDatabaseConfigs = {
	mongodb: {
		host: 'localhost',
		port: 27017,
		dbName: 'testdb',
		uri: 'mongodb://localhost:27017/testdb'
	},
	mysql: {
		host: 'localhost',
		port: 3306,
		dbName: 'testdb',
		uri: 'mysql://localhost:3306/testdb'
	}
};

export const mockErrorResponses = {
	unauthorized: {
		status: 401,
		body: { error: 'Unauthorized', message: 'No Authorization header provided' }
	},
	forbidden: {
		status: 403,
		body: { error: 'Forbidden', message: 'Insufficient permissions' }
	},
	notFound: {
		status: 404,
		body: { error: 'Not Found', message: 'Resource not found' }
	},
	badRequest: {
		status: 400,
		body: { error: 'Bad Request', message: 'Invalid request parameters' }
	},
	internalError: {
		status: 500,
		body: { error: 'Internal Server Error', message: 'An unexpected error occurred' }
	},
	serviceUnavailable: {
		status: 503,
		body: { error: 'Service Unavailable', message: 'Database connection failed' }
	}
};

export const mockMiddlewareContext = {
	req: {
		headers: {},
		params: {},
		query: {},
		body: {}
	},
	res: {
		statusCode: 200,
		headers: {},
		body: null
	},
	next: () => {}
};

/**
 * Helper to create mock request with standard properties
 */
export function createMockRequest(overrides: any = {}) {
	return {
		headers: {},
		params: {},
		query: {},
		body: {},
		user: { username: 'testuser' },
		idaeDb: undefined,
		dbName: undefined,
		collectionName: undefined,
		connectedCollection: undefined,
		...overrides
	};
}

/**
 * Helper to create mock response with standard methods
 */
export function createMockResponse() {
	let statusCode = 200;
	let responseData: any;

	return {
		status: (code: number) => {
			statusCode = code;
			return {
				json: (data: any) => {
					responseData = data;
					return {};
				}
			};
		},
		json: (data: any) => {
			responseData = data;
			return {};
		},
		send: (data: any) => {
			responseData = data;
			return {};
		},
		statusCode,
		responseData
	};
}

/**
 * Helper to create mock IdaeDb instance
 */
export function createMockIdaeDb() {
	return {
		init: async (uri: string, options: any) => {
			return {
				db: async (dbName: string) => {
					return {
						collection: async (collectionName: string) => {
							return {
								find: async (filter?: any) => mockUsers.filter(u => u.role === filter?.role || true),
								findById: async (id: string) => mockUsers.find(u => u.id === id) || null,
								create: async (data: any) => ({ id: '4', ...data }),
								update: async (id: string, data: any) => ({
									...mockUsers.find(u => u.id === id),
									...data
								}),
								deleteById: async (id: string) => undefined,
								deleteWhere: async (filter: any) => 1
							};
						}
					};
				}
			};
		}
	};
}
