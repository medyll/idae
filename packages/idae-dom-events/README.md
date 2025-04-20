# @medyll/idae-dom-events

`@medyll/idae-dom-events` is a powerful library for observing and reacting to changes in the DOM of web applications. It provides tools to track CSS changes, monitor DOM mutations, and manage various events efficiently, making it an ideal choice for dynamic web applications.

## Features

- **CSS Change Tracking**: Use `CssObserver` to monitor animations, style changes, and resize events.
- **DOM Mutation Observation**: Use `DomObserver` to track DOM mutations, such as attribute changes, child list modifications, and character data updates.
- **Event Management**: Efficiently manage DOM-related events.

## Installation

Install the library using npm:

```bash
npm install @medyll/idae-dom-events
```

## Usage

### CSS Change Tracking

```typescript
import { cssDom } from '@medyll/idae-dom-events';

// Track CSS changes on elements with the attribute data-cssDom
cssDom('[data-cssDom]', {
    trackChildList: true,
    trackAttributes: true,
    trackResize: true
}).each((element, changes) => {
    console.log('Modified element:', element);

    if (changes.attributes) {
        console.log('Attribute changes:', changes.attributes);
    }

    if (changes.childList) {
        console.log('Child list modifications:', changes.childList);
    }

    if (changes.characterData) {
        console.log('Character data changes:', changes.characterData);
    }

    if (changes.resize) {
        console.log('Resize detected:', changes.resize);
    }
});
``` 

### DOM Mutation Observation

```typescript
import { htmlDom } from '@medyll/idae-dom-events';

htmlDom.track('#widget', {
    onAttributesChange: (element, mutation) => {
        console.log('Modified attribute:', mutation);
    },
    onChildListChange: (mutation) => {
        console.log('Child list modified:', mutation);
    },
    onCharacterDataChange: (mutation) => {
        console.log('Character data modified:', mutation);
    }
});
```

## API

### `cssDom(selector, options)`

- **`selector`**: CSS selector to target elements.
- **`options`**: Options to configure tracking, such as `trackChildList`, `trackAttributes`, or `trackResize`.

#### Methods

- **`each(callback)`**: Tracks changes for each matching element.
- **`summary(callback)`**: Provides a summary of affected elements.

### `htmlDom.track(selector, options)`

- **`selector`**: Selector or DOM element to observe.
- **`options`**: Options to configure the types of mutations to track (`onAttributesChange`, `onChildListChange`, etc.).

## Scripts

The following npm scripts are available for development and testing:

- `npm run dev`: Starts the development server.
- `npm run build`: Compiles the library for production.
- `npm run test`: Runs unit tests.

## Contribution

Contributions are welcome! Feel free to submit a pull request or open an issue to report bugs or propose features.

## License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for more details.
