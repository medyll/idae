
# HtmluDom Library

HtmluDom is a powerful library for observing and reacting to DOM changes in web applications. It provides two main classes: CssObserver and HtmluDomLib.

## Installation

```bash
npm install @medyll/htmludom
```

## Usage

```javascript
import { cssDom, HtmluDom } from "@medyll/htmludom";
```

## CssObserver

CssObserver allows you to track CSS changes and animations on specified elements.

### Key Features:
- Track new elements matching a selector
- Observe attribute changes
- Monitor child list modifications
- Track element resizing

### Basic Usage:

```javascript
cssDom('#myElement').each((element) => {
  console.log('Element changed:', element);
});
```

### Advanced Usage:

```javascript
cssDom('#myElement', {
  onlyNew: true,
  trackChildList: true,
  trackAttributes: ['class', 'style'],
  trackResize: true
}).each((element) => {
  console.log('Element updated:', element);
});
```

## HtmluDomLib (Htmlu)

HtmluDomLib provides a more detailed way to observe DOM mutations.

### Key Features:
- Singleton instance for global use
- Flexible mutation tracking
- Support for multiple selectors and mutation types

### Basic Usage:

```javascript
Htmlu.track('#myElement', ['class'], {
  onAttributesChange: (element, mutation, observer) => {
    console.log('Attribute changed:', mutation);
  }
});
```

### Advanced Usage:

```javascript
Htmlu.attach({
  selectors: [{ element: '#myElement', mutations: { attributes: ['class'] } }],
  selectorCallback: (mutations, observer) => ({
    attributes: (mutation, observer) => {
      console.log('Attribute mutation:', mutation);
    },
    childList: (mutation, observer) => {
      console.log('Child list mutation:', mutation);
    }
  }),
  observerParameters: {
    subtree: true,
    childList: true
  }
});
```

## Browser Compatibility

HtmluDom uses modern browser features.  
Ensure your target browsers support MutationObserver and other required APIs.

## License

[MIT License](LICENSE)
