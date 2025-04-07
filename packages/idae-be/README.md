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

**Comments:**

1. **`append`**: Adds a new `<div>` to the container and applies a class and event listener.
2. **Nested `append`**: Adds a `<span>` inside the appended `<div>` with its own class and event listener.
3. **`prepend`**: Adds a title at the beginning of the container and styles its children.

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

**Comments:**

1. **`on`**: Adds a click event to buttons and toggles a class on the clicked button.
2. **`siblings`**: Removes a class from sibling buttons and adds a hover event.
3. **`fire`**: Dispatches a custom event and applies a class to all child elements.

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

**Comments:**

1. **`setStyle`**: Applies styles to the selected element and its children.
2. **`setAttr`**: Sets attributes on the selected element and its children.
3. **`addClass`**: Adds a class to the element and modifies its siblings.

---

### Example 4: Timers

```javascript
import { be } from '@medyll/idae-be';

// Set a timeout to execute a callback after 100ms
be('#test').timeout(100, ({ be }) => {
	be.setStyle({ backgroundColor: 'yellow' }).append('<span>Timeout executed</span>');
});

// Set an interval to execute a callback every 100ms
be('#test').interval(100, ({ be }) => {
	be.toggleClass('highlight');
});

// Clear a timeout before it executes
const timeoutInstance = be('#test').timeout(500, ({ be }) => {
	be.setStyle({ color: 'red' });
});
timeoutInstance.clearTimeout();

// Clear an interval after 600ms
const intervalInstance = be('#test').interval(400, ({ be }) => {
	be.setStyle({ fontSize: '20px' });
});
intervalInstance.clearInterval();
```

---

### Example 5: Walk

```javascript
import { be } from '@medyll/idae-be';

// Traverse up the DOM tree to find the parent element
be('#child').up('#parent', ({ be: parent }) => {
	parent.addClass('highlight').children(({ be: child }) => {
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

## License

This project is licensed under the MIT License.
