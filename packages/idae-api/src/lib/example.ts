import { apiServer } from './apiServer';

// Configure the server
apiServer.setOptions({ port: 3050, onInUse: 'reboot' });

// Start the server
apiServer.start();

console.log(apiServer.state); // 'running'

// Add a new route at runtime
apiServer.router.addRoute({
	method: 'post',
	path: '/dynamic',
	handler: async (service, params, body) => ({ message: 'Dynamic route', data: body })
});

// Disable a route
apiServer.router.disableRoute('/custom', 'get');

// Enable a route
apiServer.router.enableRoute('/custom', 'get');

// Add multiple routes
apiServer.router.addRoutes([
	{
		method: 'get',
		path: '/multiple1',
		handler: async () => ({ message: 'Multiple 1' })
	},
	{
		method: 'get',
		path: '/multiple2',
		handler: async () => ({ message: 'Multiple 2' })
	}
]);

// Stop the server
apiServer.stop();

console.log(apiServer.state); // 'stopped'
