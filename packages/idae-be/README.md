
# @medyll/idae-be

A lightweight, chainable DOM manipulation library for modern web development.

## Installation

```bash
npm install @medyll/idae-be
```

or

```bash
yarn add @medyll/idae-be
```

## Introduction

`@medyll/idae-be` is a powerful and flexible DOM manipulation library that provides a fluent interface for common DOM operations. It's designed to make working with HTML elements easier and more intuitive, with support for chaining methods, handling multiple elements, and performing complex DOM manipulations with ease.

## Key Features

- Chainable methods for fluid DOM manipulation
- Support for single elements, arrays of elements, and query selectors
- Handlers for attributes, DOM manipulation, properties, and data attributes
- Advanced class manipulation
- Event handling
- Element positioning and overlap functionality
- Lightweight and performant

## Basic Usage

```javascript
import { be } from '@medyll/idae-be';

// Select an element and modify it
be('#myElement')
  .classAdd('highlight')
  .setStyle('color: blue; font-size: 16px')
  .on('click', () => console.log('Clicked!'));
```

## API Reference

### Element Selection

- `be(selector)`: Create a new Be instance
    - `selector`: string | HTMLElement | HTMLElement[]

### Class Manipulation

- `classAdd(className: string): Be`
- `classRemove(className: string): Be`
- `classToggle(className: string): Be`
- `classes(actions: ClassHandlerHandler): Be`
    - `actions.add`: Classes to add (string or string[])
    - `actions.remove`: Classes to remove (string or string[])
    - `actions.toggle`: Classes to toggle (string or string[])
    - `actions.replace`: Classes to replace (string "oldClass newClass" or [string, string][])

### DOM Manipulation

- `update(content: string): Be`
- `updateText(content: string): Be`
- `append(content: string | HTMLElement): Be`
- `prepend(content: string | HTMLElement): Be`
- `remove(): Be`
- `replace(content: string | HTMLElement): Be`
- `clear(): Be`
- `dom(actions: DomHandlerActions): Be`
    - `actions.update(content: string): Be`
    - `actions.updateText(content: string): Be`
    - `actions.append(content: string | HTMLElement): Be`
    - `actions.prepend(content: string | HTMLElement): Be`
    - `actions.remove(): Be`
    - `actions.replace(content: string | HTMLElement): Be`
    - `actions.clear(): Be`


### Attribute Handling

- `attr.get(name?: string): string | null`
- `attr.set(nameOrObject: string | Record<string, string>, value?: string): Be`

### Data Attribute Handling

- `data.get(key: string): string | null`
- `data.set(keyOrObject: string | Record<string, string>, value?: string): Be`

### Property Handling

- `prop.get(name: string): any`
- `prop.set(nameOrObject: string | Record<string, any>, value?: any): Be`

### Event Handling

- `on(eventName: string, handler: EventListener): Be`
- `off(eventName: string, handler: EventListener): Be`
- `event(actions: EventHandlerActions): Be`

### Element Positioning

- `clonePosition(sourceElement: string | HTMLElement, options?: PositionOptions): Be`
- `overlapPosition(targetElement: string | HTMLElement, options?: OverlapOptions): Be`
- `snapTo(targetElement: string | HTMLElement, options: SnapToOptions): Be`

## Detailed Examples

### Class Manipulation

```javascript
be('.myClass').classes({
  add: 'newClass anotherClass',
  remove: 'oldClass',
  toggle: 'toggleClass',
  replace: 'oldClass newClass'
});
```
### DOM Manipulation
 
```javascript
// Using individual methods
be('#myElement').update('<h1>New Heading</h1>');
be('.myClass').append('<p>Appended paragraph</p>');
be('[data-id="123"]').remove();

// Using batch operations
be('#anotherElement').dom({
  update: '<h1>New Heading</h1>',
  append: '<p>Appended paragraph</p>',
  prepend: '<div>Prepended div</div>'
});
```

### Event Handling

```javascript
be('.button').event({
  on: {
    eventName: 'click',
    handler: (e) => console.log('Clicked!', e)
  }
});
```

### Element Positioning

```javascript
be('#floatingElement').clonePosition('#targetElement', {
  offsetX: 10,
  offsetY: 20,
  useTransform: true
});

be('#overlayElement').overlapPosition('#baseElement', {
  alignment: 'top',
  offset: 5
});

be('#snapElement').snapTo('#anchorElement', {
  sourceAnchor: 'bottom center',
  targetAnchor: 'top center',
  offset: { x: 0, y: 10 }
});
```

## TypeScript Support

This library is written in TypeScript and includes type definitions. You can enjoy full IntelliSense and type checking when using it in a TypeScript project.

## Browser Support

`@medyll/idae-be` is designed for modern browsers. It uses modern DOM APIs and may require polyfills for older browsers.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

 Lebrun Meddy

