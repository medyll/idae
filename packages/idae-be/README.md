
# @medyll/idae-be

A powerful DOM manipulation library with a callback-based approach for precise element targeting.

## Installation

```bash
npm install @medyll/idae-be
```

## Key Features

- Root object persistence for consistent chaining
- Callback-based element manipulation for precise targeting
- Comprehensive DOM traversal and manipulation
- Event handling, style management, and attribute control
- Timer integration for dynamic operations

## Unique Approach

Unlike jQuery and other chained libraries, `@medyll/idae-be` always returns the root object. This approach allows for consistent chaining while using callbacks to manipulate targeted elements. This design provides more control and clarity in complex DOM operations.

## Basic Usage

```javascript
import { be, toBe } from '@medyll/idae-be';

be('#container')
  .append(toBe('<div>New content</div>'), ({ be }) => {
    be
      .addClass('highlight')
      .on('click', () => console.log('Clicked!'));
  })
  .prepend(toBe('<h1>Title</h1>'))
  .children(undefined, ({ be }) => {
    be.setStyle({ color: 'blue' });
  });
```

## API Reference

### Core Methods

- `be(selector: string | HTMLElement | HTMLElement[]): Be` - Create a new Be instance
- `toBe(str: string | HTMLElement, options?: { tag?: string }): Be` - Convert string or HTMLElement to Be instance
- `createBe(tagOrHtml: string, options?: Object): Be` - Create a new Be element

### DOM Manipulation

- `update(content: string): Be`
- `append(content: string | HTMLElement): Be`
- `prepend(content: string | HTMLElement): Be`
- `insert(mode: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend', element: HTMLElement | Be): Be`
- `remove(): Be`
- `replace(content: string | HTMLElement): Be`
- `clear(): Be`
- `normalize(): Be`
- `wrap(tag?: string): Be`

### Traversal

- `up(selector?: string, callback?: HandlerCallBackFn): Be`
- `next(selector?: string, callback?: HandlerCallBackFn): Be`
- `previous(selector?: string, callback?: HandlerCallBackFn): Be`
- `siblings(selector?: string, callback?: HandlerCallBackFn): Be`
- `children(selector?: string, callback?: HandlerCallBackFn): Be`
- `closest(selector: string, callback?: HandlerCallBackFn): Be`
- `firstChild(selector?: string, callback?: HandlerCallBackFn): Be`
- `lastChild(selector?: string, callback?: HandlerCallBackFn): Be`
- `find(selector: string, callback?: HandlerCallBackFn): Be`
- `findAll(selector: string, callback?: HandlerCallBackFn): Be`
- `without(selector: string, callback?: HandlerCallBackFn): Be`

### Styling

- `setStyle(styles: Record<string, string>): Be`
- `getStyle(property: string): string | null`
- `unsetStyle(properties: string[]): Be`
- `addClass(className: string): Be`
- `removeClass(className: string): Be`
- `toggleClass(className: string): Be`
- `replaceClass(oldClass: string, newClass: string): Be`

### Events

- `on(eventName: string, handler: EventListener): Be`
- `off(eventName: string, handler: EventListener): Be`
- `fire(eventName: string, detail?: any): Be`

### Attributes and Properties

- `setAttr(name: string, value: string): Be`
- `getAttr(name: string): string | null`
- `deleteAttr(name: string): Be`
- `setData(key: string, value: string): Be`
- `getData(key: string): string | null`
- `deleteData(key: string): Be`

### Timers

- `timeout(delay: number, callback: HandlerCallBackFn): Be`
- `interval(delay: number, callback: HandlerCallBackFn): Be`
- `clearTimeout(): Be`
- `clearInterval(): Be`

## Advanced Example

```javascript
be('#app')
  .append(toBe('<div id="content"></div>'), ({ be  }) => {
    be
      .append(toBe('<button>Add Item</button>'), ({ be }) => {
        be.on('click', () => {
          content.append(toBe('<p>New item</p>'), ({ be }) => {
            be
              .addClass('item')
              .setStyle({ color: 'blue' })
              .on('click', ({ target }) => {
                be(target).toggleClass('selected');
              });
          });
        });
      })
      .children('.item', ({ be }) => {
        be.setStyle({ padding: '5px', margin: '2px' });
      });
  })
  .up(({ be }) => {
    be.setStyle({ backgroundColor: '#f0f0f0' });
  });
```

This example demonstrates:
1. Nested element creation and manipulation
2. Event handling with dynamic content addition
3. Traversal and bulk operations on children
4. Accessing and styling parent elements

## TypeScript Support

This library is written in TypeScript and includes type definitions for a great developer experience.

## Browser Support

Designed for modern browsers. May require polyfills for older browser support.

## Contributing

Contributions are welcome! Please submit pull requests or open issues on our GitHub repository.

## License

This project is licensed under the MIT License.