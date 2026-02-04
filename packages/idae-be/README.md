# @medyll/idae-be

A DOM walk and manipulation library with a callback-based approach for precise element targeting.

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
- HTTP content loading and insertion

## Unique Approach

Unlike jQuery and other chained libraries, `@medyll/idae-be` always returns the root object. This approach allows for consistent chaining while using callbacks to manipulate targeted elements. This design provides more control and clarity in complex DOM operations.

---

## Basic Usage

### Example 1: DOM Manipulation with Callbacks

```javascript
import { be, toBe } from '@medyll/idae-be';

// Select the container element
be('#container')
    .append(toBe('<div>New content</div>'), ({ be }) => {
        be.addClass('highlight')
            .on('click', () => console.log('Clicked!'))
            .append(toBe('<span>Nested content</span>'), ({ be }) => {
                be.addClass('nested').on('mouseover', () => console.log('Hovered!'));
            });
    })
    .prepend(toBe('<h1>Title</h1>'), ({ be }) => {
        be.addClass('title').children(({ be }) => {
            be.setStyle({ color: 'blue' });
        });
    });
```

---

### Example 2: Event Handling and Traversal

```javascript
import { be } from '@medyll/idae-be';

// Add a click event to all buttons inside the container
be('#container button').on('click', ({ target }) => {
    be(target)
        .toggleClass('active')
        .siblings(({ be }) => {
            be.removeClass('active').on('mouseover', () => console.log('Sibling hovered!'));
        });
});

// Fire a custom event and handle it
be('#container').fire('customEvent', { detailKey: 'detailValue' }, ({ be }) => {
    be.children(({ be }) => {
        be.addClass('custom-event-handled');
    });
});
```

---

### Example 3: Styling and Attributes

```javascript
import { be } from '@medyll/idae-be';

// Select an element and update its styles and attributes
be('#element')
    .setStyle({ backgroundColor: 'yellow', fontSize: '16px' }, ({ be }) => {
        be.setAttr('data-role', 'admin').children(({ be }) => {
            be.setStyle({ color: 'red' }).setAttr('data-child', 'true');
        });
    })
    .addClass('styled-element', ({ be }) => {
        be.siblings(({ be }) => {
            be.setStyle({ opacity: '0.5' });
        });
    });
```
#### `unwrap(callback?: HandlerCallBackFn): Be`
Removes the parent element of the selected element(s), keeping the selected element(s) in the DOM.

**Example:**
```javascript
// HTML: <div id="wrapper"><span id="child">Content</span></div>
be('#child').unwrap();
// Result: <span id="child">Content</span>
---

### Example 4: Timers

```javascript
import { be } from '@medyll/idae-be';

// Set a timeout to execute a callback after 100ms
be('#test').timeout(100, ({ be }) => {
    be.setStyle({ backgroundColor: 'yellow' }).append('<span>Timeout executed</span>');
});

// Set an interval to execute a callback every 400ms
const intervalInstance = be('#test').interval(400, ({ be }) => {
    be.toggleClass('highlight');
});

// Clear the interval after 600ms
setTimeout(() => {
    intervalInstance.clearInterval();
}, 600);
```

---

### Example 5: Walk

```javascript
import { be } from '@medyll/idae-be';

// Traverse up the DOM tree to find the parent element
be('#child').up('#parent', ({ be: parent }) => {
    parent.addClass('highlight')
        .children(({ be: child }) => {
            child.setStyle({ color: 'blue' });
        });
});

// Find all siblings of an element and add a class
be('#target').siblings(({ be: siblings }) => {
    siblings.addClass('sibling-class').children(({ be }) => {
        be.setStyle({ fontWeight: 'bold' });
    });
});

// Find the closest ancestor matching a selector
be('#child').closest('.ancestor', ({ be: closest }) => {
    closest.setStyle({ border: '2px solid red' }).children(({ be }) => {
        be.addClass('ancestor-child');
    });
});
```

---

### Example 6: HTTP Content Loading and Insertion

```javascript
import { be } from '@medyll/idae-be';

// Load content from a URL and update the element
be('#test').updateHttp('/content.html', ({ be }) => {
    console.log('Content loaded:', be.html);
});

// Load content and insert it at a specific position
be('#test').insertHttp('/content.html', 'afterbegin', ({ be }) => {
    console.log('Content inserted:', be.html);
});
```

---

## API Reference

### Core Methods

#### `be(selector: string | HTMLElement | HTMLElement[]): Be`
Create a new Be instance.

**Example:**
```javascript
const instance = be('#test');
```

#### `toBe(str: string | HTMLElement, options?: { tag?: string }): Be`
Convert a string or HTMLElement to a Be instance.

**Example:**
```javascript
const newElement = toBe('<div>Content</div>');
```

#### `createBe(tagOrHtml: string, options?: Object): Be`
Create a new Be element.

**Example:**
```javascript
const newElement = createBe('div', { className: 'my-class' });
```

---

### HTTP Methods

#### `updateHttp(url: string, callback?: HandlerCallBackFn): Be`
Loads content from a URL and updates the element's content.

**Example:**
```javascript
be('#test').updateHttp('/content.html', ({ be }) => {
    console.log(be.html);
});
```

#### `insertHttp(url: string, mode?: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend', callback?: HandlerCallBackFn): Be`
Loads content from a URL and inserts it into the element at a specified position.

**Example:**
```javascript
be('#test').insertHttp('/content.html', 'afterbegin', ({ be }) => {
    console.log(be.html);
});
```

---

### Timers

#### `timeout(delay: number, callback: HandlerCallBackFn): Be`
Set a timeout for an element.

**Example:**
```javascript
be('#test').timeout(1000, () => console.log('Timeout executed'));
```

#### `interval(delay: number, callback: HandlerCallBackFn): Be`
Set an interval for an element.

**Example:**
```javascript
be('#test').interval(500, () => console.log('Interval executed'));
```

#### `clearTimeout(): Be`
Clear a timeout.

**Example:**
```javascript
const timeoutInstance = be('#test').timeout(1000, () => console.log('Timeout executed'));
timeoutInstance.clearTimeout();
```

#### `clearInterval(): Be`
Clear an interval.

**Example:**
```javascript
const intervalInstance = be('#test').interval(500, () => console.log('Interval executed'));
intervalInstance.clearInterval();
```

---

### Traversal

#### `up(selector?: string, callback?: HandlerCallBackFn): Be`
Traverse up the DOM tree.

**Example:**
```javascript
be('#child').up();
```

#### `next(selector?: string, callback?: HandlerCallBackFn): Be`
Traverse to the next sibling.

**Example:**
```javascript
be('#sibling1').next();
```

#### `previous(selector?: string, callback?: HandlerCallBackFn): Be`
Traverse to the previous sibling.

**Example:**
```javascript
be('#sibling2').previous();
```

#### `siblings(selector?: string, callback?: HandlerCallBackFn): Be`
Find all sibling elements.

**Example:**
```javascript
be('#child').siblings();
```

#### `children(selector?: string, callback?: HandlerCallBackFn): Be`
Find all child elements.

**Example:**
```javascript
be('#parent').children();
```

#### `closest(selector: string, callback?: HandlerCallBackFn): Be`
Find the closest ancestor matching a selector.

**Example:**
```javascript
be('#child').closest('#ancestor');
```

---

### Styling

#### `setStyle(styles: Record<string, string>): Be`
Set CSS styles for an element.

**Example:**
```javascript
be('#test').setStyle({ color: 'red', fontSize: '16px' });
```

#### `getStyle(property: string): string | null`
Get the value of a CSS property.

**Example:**
```javascript
const color = be('#test').getStyle('color');
console.log(color); // Output: "red"
```

#### `unsetStyle(property: string): Be`
Remove a CSS property from an element.

**Example:**
```javascript
be('#test').unsetStyle('color');
```

---

### Events

#### `on(eventName: string, handler: EventListener): Be`
Add an event listener to an element.

**Example:**
```javascript
be('#test').on('click', () => console.log('Clicked!'));
```

#### `off(eventName: string, handler: EventListener): Be`
Remove an event listener from an element.

**Example:**
```javascript
be('#test').off('click', handler);
```

#### `fire(eventName: string, detail?: any): Be`
Dispatch a custom event.

**Example:**
```javascript
be('#test').fire('customEvent', { key: 'value' });
```

---


## Architecture

```mermaid
flowchart LR
  Target[Selector / Element] --> Be[be()]
  Be --> Chain[Chained Operations]
  
  subgraph Operations [DOM Manipulation]
    Chain --> Attr[Attributes / Classes]
    Chain --> Style[Styles]
    Chain --> Events[Event Listeners]
    Chain --> Content[Append / Prepend]
  end

  Chain -- returns --> Be
```

## License

This project is licensed under the MIT License.
