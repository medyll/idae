
# dom-events Library

dom-events is a powerful library for observing and reacting to DOM changes in web applications. It provides two main classes: cssDom and htmlDom.

## Installation

```bash
npm install @medyll/dom-events
```

## Usage

```javascript
import { cssDom, htmlDom } from "@medyll/dom-events";
```

## CssObserver

CssObserver allows you to track CSS changes and animations on specified elements to trigger custom actions or updates.

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

## HtmluDomLib (htmlDom)

HtmluDomLib provides a more detailed way to observe DOM mutations.

### Key Features:
- Singleton instance for global use
- Flexible mutation tracking
- Support for multiple selectors and mutation types

### Basic Usage:

```javascript
htmlDom.track('#myElement', ['class'], {
  onAttributesChange: (element, mutation, observer) => {
    console.log('Attribute changed:', mutation);
  }
});
```

### Advanced Usage:

```javascript
htmlDom.attach({
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

## Detailed Usage Guide

### CssObserver (cssDom)

The CssObserver class, accessed via the `cssDom` function, provides a powerful way to track CSS changes and animations on specified elements.

#### Basic Usage:

```javascript
import { cssDom } from "@medyll/htmludom";

cssDom('#myElement').each((element) => {
  console.log('Element changed:', element);
});
```

#### Advanced Features:

1. **Track Only New Elements:**
   ```javascript
   cssDom('#myElement', { onlyNew: true }).each((element , changes) => {
     console.log('New element added:', element);
   });
   ```

2. **Observe Child List Changes:**
   ```javascript
   cssDom('#myElement', { trackChildList: true }).each((element , changes) => {
     console.log('Child list changed for:', element);
   });
   ```

3. **Monitor Specific Attributes:**
   ```javascript
   cssDom('#myElement', { trackAttributes: ['class', 'style'] }).each((element , changes) => {
     console.log('Tracked attribute changed for:', element);
   });
   ```

4. **Track Resize Events:**
   ```javascript
   cssDom('#myElement', { trackResize: true }).each((element , changes) => {
     console.log('Element resized:', element);
   });
   ```

5. **Get Summary of Changes:**
   ```javascript
   cssDom('#myElement').summary((changedElements) => {
     console.log('Elements changed:', changedElements);
   });
   ```
 

#### Basic Usage:

```javascript
import { htmlDom } from "@medyll/htmludom";

htmlDom.track('#myElement', ['class'], {
  onAttributesChange: (element, mutation, observer) => {
    console.log('Class attribute changed:', element, mutation);
  }
});
```

#### Advanced Features:

1. **Observe Multiple Mutation Types:**
   ```javascript
   htmlDom.track('#myElement', {
     onAttributesChange: (element, mutation, observer) => {
       console.log('Attribute changed:', mutation.attributeName);
     },
     onChildListChange: (element, mutation, observer) => {
       console.log('Child nodes changed');
     },
     onCharacterDataChange: (element, mutation, observer) => {
       console.log('Text content changed');
     }
   });
   ```

2. **Use Complex Selectors:**
   ```javascript
   htmlDom.track(['#myElement', '.myClass'], ['style', 'class'], {
     onAttributesChange: (element, mutation, observer) => {
       console.log('Style or class changed for:', element);
     }
   });
   ```

3. **Attach Multiple Observers:**
   ```javascript
   htmlDom.attach([
     {
       selectors: [{ element: '#element1', mutations: { attributes: ['class'] } }],
       selectorCallback: (mutations, observer) => ({
         attributes: (mutation, observer) => console.log('Class changed for element1')
       }),
       observerParameters: { subtree: true }
     },
     {
       selectors: [{ element: '#element2', mutations: { childList: true } }],
       selectorCallback: (mutations, observer) => ({
         childList: (mutation, observer) => console.log('Children changed for element2')
       }),
       observerParameters: { childList: true }
     }
   ]);
   ```

4. **Detach Observers:**
   ```javascript
   // Detach all observers
   htmlDom.detach();

   // Detach observer for specific selector
   htmlDom.detach('#myElement');
   ```

### The why and how of using cssEvents and domChange together in web applications. 

Using cssEvents and domChange offers a balanced approach to tracking DOM changes and CSS-related events in web applications. This combination provides several advantages:

1. Efficiency: cssEvents leverages CSS animations to detect new elements, which is more performant than constantly querying the DOM.

2. Flexibility: domChange uses MutationObserver, allowing for precise tracking of various DOM mutations, including attribute changes and child node modifications.

3. Comprehensive coverage: Together, these methods can capture a wide range of changes, from style updates to structural DOM alterations.

4. Browser compatibility: This approach works well across modern browsers, providing a consistent experience.

5. Reduced overhead: By focusing on specific changes, you can minimize unnecessary processing and improve overall application performance.

6. Ease of use: The API for both methods is designed to be developer-friendly, making it simple to implement and maintain.

7. Scalability: This solution is suitable for both small projects and large-scale applications, adapting well to different complexity levels.  
By combining cssEvents for style-related changes and domChange for structural modifications, developers can create responsive, efficient, and robust web applications that react seamlessly to various types of DOM and CSS updates.  

8. Resume  
dom-events is a TypeScript library designed to simplify the use of the MutationObserver API, making manipulation of the Document Object Model (DOM) more intuitive and suitable for different use cases. This library is particularly useful for web applications that require dynamic DOM management, such as tracking attribute changes, observing changes in the child list of an element, and detecting character data changes.

     The versatility of dom-events allows it to be used in a wide range of web applications, from simple to complex. It is ideal for situations where dynamic DOM monitoring is required, such as tracking attribute changes, observing changes in the child list of an element, or detecting character data changes.
### Performance Considerations

- Use specific selectors when possible to limit the scope of observation.
- When tracking attributes, specify only the attributes you need to observe.
- For frequently changing elements, consider using debounce techniques in your callback functions.
- Detach observers when they are no longer needed to free up resources.

### Browser Compatibility

dom-events uses modern browser features such as MutationObserver and ResizeObserver. Ensure your target browsers support these APIs. For older browsers, consider using polyfills or fallback mechanisms.
 

## Browser Compatibility

dom-events uses modern browser features.  
Ensure your target browsers support MutationObserver and other required APIs.

## License

[MIT License](LICENSE)
