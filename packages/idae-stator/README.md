# Stator Demo

This is a demonstration of the **Stator** library, which provides reactive state management for JavaScript applications.

## Features

- Reactive state creation using `stator`.
- Automatic state change detection with `onchange` handlers.
- Manual and automatic state updates.
- Simple UI updates based on state changes.

## Code Example

Below is an example of how to use the Stator library:

```javascript
// Import the stator library
import { stator } from './Stator.ts';

// Create reactive states
let countState = stator(0);
let countObje = stator({ index: 0 });
let monobjSte = stator({ index: 0 });

// State change handlers
countState.onchange = (oldValue, newValue) => {
    console.log('countState', oldValue, newValue);
};
countObje.onchange = (oldValue, newValue) => {
    console.log('countObje', oldValue, newValue);
};

// Increment the value every 30 seconds
setInterval(() => {
    // Uncomment to enable automatic increment
    // countState.stator++;
    // monobjSte.stator.index++;
}, 30000);

// Function to manually increment the count
function incrementCount() {
    countState.stator++;
    monobjSte.stator.index++;
    updateUI();
}

// Function to update the UI
function updateUI() {
    document.getElementById('count').textContent = `${countState.stator}-${countObje.stator.index}`;
}

// Initialize the UI
window.onload = () => {
    updateUI();
    console.log(monobjSte, countState.stator);
};
```

## HTML Structure

The following HTML structure is used for the demo:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stator Demo</title>
</head>
<body>
    <h1>Stator Demo</h1>
    <p>Count: <span id="count">0-0</span></p>
    <button onclick="incrementCount()">Increment</button>
</body>
</html>
```

## How It Works

1. **Reactive States**: The `stator` function creates reactive states that automatically notify changes.
2. **State Handlers**: The `onchange` handlers log state changes to the console.
3. **UI Updates**: The `updateUI` function updates the DOM based on the current state values.
4. **Manual Increment**: The `incrementCount` function allows manual state updates via a button click.

## Usage

1. Clone the repository and include the `Stator.js` library in your project.
2. Use the provided code to create reactive states and bind them to your UI.
3. Customize the logic as needed for your application.

Enjoy building reactive applications with **Stator**!  