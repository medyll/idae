#### README.md for htmlu

# HTMLU.
HTMLU is a package that allows using classNames as element tags.  
We are playing with utility classes since epoch, now could be the time of utility html-tag.  

So u is for utility.

This package delivers a preprocessor for vite + svelte

## Installation of htmlu

Install with npm, yarn, or another package manager:

```bash
npm install --save-dev @medyll/htmlu
```

or

```bash
yarn add --dev @medyll/htmlu
```

## Configuration with Svelte  

### - install and configure 

Import "**htmluSveltePreprocess**" into your `svelte.config.js` file:

```typescript
import { htmluSveltePreprocess } from "@medyll/htmlu";
```

And update it with those settings, adding "**htmluSveltePreprocess**" to the preprocess list:

```typescript
config.preprocess = [vitePreprocess(), htmluSveltePreprocess()];
```

you can also pass options to the preprocessor

```typescript
type HtmlUuOptionsType = { options: { allowedTags: []; excludeTags: [] } };
```
### - optionals arguments  

- options.allowedTags takes precedence over all.

    - If you pass an empty array, all tags will be allowed.
    - If you pass an array with tags, only those tags will be allowed.  

- options.excludeTags will exclude tags from the allowed tags list.
    - it contains all dom native tags by default.
    - if you pass some tags, they will be merged with the default one.


  
  
## Usage

Usage examples:

```html
<!-- this pattern -->
<absolute w-full h-full> content </absolute>
<!-- will be transformed into -->
<div class="absolute w-full h-full">content</div>
```

```html
<!-- this pattern -->
<flex-col:relative gap-2 pad-2>content</flex-col:relative>
<!-- will be transformed into -->
<div class="flex-col relative gap-2 pad-2">content</div>
```

```html
<!-- this pattern -->
<grid gap-2 pad-2>content</grid>
<!-- will be transformed into -->
<div class="grid gap-2 pad-2">content</div>
```

Auto-closing tags are also supported.


