# @medyll/idae-api

A flexible and extensible API framework for Node.js, designed to work with multiple database types and configurations.

## Features

- Modular architecture with clear separation of concerns
- Dynamic database connection management
- Flexible routing system
- Support for multiple database types (currently MongoDB, with easy extensibility for others)
- TypeScript support for improved robustness and maintainability

## Installation

```
npm install @medyll/idae-api
```

## Quick Start

```javascript
import { idaeApi } from '@medyll/idae-api';

// Configure the server
idaeApi.setOptions({
  port: 3000,
  enableAuth: false,
  onInUse: 'reboot'
});

// Start the server
idaeApi.start();
```

## Configuration

You can configure the API server using the `setOptions` method:

```javascript
idaeApi.setOptions({
  port: 3000,
  routes: customRoutes,
  enableAuth: true,
  jwtSecret: 'your-secret-key',
  tokenExpiration: '1h',
  onInUse: 'reboot'
});
```

## Custom Routes

You can add custom routes to the API:

```javascript
const customRoutes = [
  {
    method: 'get',
    path: '/custom/hello',
    handler: async () => ({ message: 'Hello from custom route!' }),
    requiresAuth: false
  }
];

idaeApi.router.addRoutes(customRoutes);
```

## Database Adapters

The API currently supports MongoDB out of the box. You can easily extend it to support other databases by implementing the `DatabaseAdapter` interface.

## Error Handling

The API includes built-in error handling middleware. You can customize error handling by modifying the `configureErrorHandling` method in the `IdaeApi` class.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
 