

# @medyll/htmludom

The HTMLdom lib contains methods to track attributes changes on HTML elements.
Mutations Observer and CSS Observer selector method, are utilities for arise, changes and events for specified CSS selectors in the DOM.

## Installation

You can install the @medyll/htmludom package using npm, yarn, or pnpm:

```bash
npm i @medyll/htmludom
yarn add @medyll/htmludom
pnpm add @medyll/htmludom
```

## Usage

- ### Mutations Observers

```typescript 
import { HtmluDom, HtmlDomCore } from '@medyll/htmludom'; 

// using a HtmluDom instance
HtmluDom.track(['.any_class'], {
	onAttributesChange: (element, mutation, observer) => {
		console.log(mutation);
	},
	onChildListChange: (mutation) => {
		console.log(mutation);
	},
	onCharacterDataChange: (mutation) => {
		console.log(mutation);
	}
});

// using HtmlDomCore single instance
HtmlDomCore.attach({
	selectors: [{ element: '#element', mutations: { attributes: '[data-role]' } }],
	selectorCallback: (mutations, observer) => {
		return {
			attributes: (mutation: MutationRecord, observer: MutationObserver) => {},
			childList: (mutation: MutationRecord, observer: MutationObserver) => {},
			characterData: (mutation: MutationRecord, observer: MutationObserver) => {}
		};
	}
}); 
```

- ### CSS Observer

The selector function allows you to track elements from their animation events for a specified CSS selector.

```typescript
import { cssDom, type QuerySelector } from '@medyll/htmludom';

const qy: QuerySelector = '.your-css-selector'; 

const eachTracking = cssDom(qy).each((element) => {
	// Callback function when the animation is completed
});

const summaryTracking = cssDom(qy).summary((summary) => {
	// Callback function for summary tracking
});
```

## Contributing  
* Fork the repository  
Create your feature branch  
Commit your changes  
Push to the branch  
Create a new Pull Request  
License  
This project is licensed under the MIT License - see the LICENSE file for details.
