# Stator Demo

This is a demonstration of the **Stator** library, which provides reactive state management for JavaScript applications.

## Features

- Reactive state creation using `stator`.
- Automatic state change detection with `onchange` handlers.
- Manual and automatic state updates.
- Simple UI updates based on state changes.


## Code Example

Below is an example of how to use the Stator library, including deep reactivity:

```javascript
// Import the stator library
import { stator } from './Stator.ts';

// Create reactive states
let countState = stator(0); // primitive
let userState = stator({
    name: 'Alice',
    profile: {
        age: 30,
        hobbies: ['reading', 'sports']
    }
});
let arrState = stator([1, 2, { deep: true }]);

// State change handlers
countState.onchange = (oldValue, newValue) => {
    console.log('countState', oldValue, newValue);
};
userState.onchange = (oldValue, newValue) => {
    console.log('userState', oldValue, newValue);
};
arrState.onchange = (oldValue, newValue) => {
    console.log('arrState', oldValue, newValue);
};

// --- Deep reactivity demonstration ---
// Mutate a nested property (deep object)
userState.stator.profile.age = 31; // onchange will be triggered

// Mutate a nested array
userState.stator.profile.hobbies.push('music'); // onchange will be triggered

// Mutate a nested object inside an array
arrState.stator[2].deep = false; // onchange will be triggered

// Add/remove array elements
arrState.stator.push(99); // onchange will be triggered
arrState.stator.splice(0, 1); // onchange will be triggered

// Function to update the UI (example)
function updateUI() {
    document.getElementById('count').textContent = `${countState.stator} - ${userState.stator.profile.age}`;
}

// Initialize the UI
window.onload = () => {
    updateUI();
    console.log(userState, arrState, countState.stator);
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
2. **Deep Reactivity**: Mutations to nested properties or arrays (objects within objects, arrays within objects, etc.) are detected and trigger the `onchange` handler.
3. **State Handlers**: The `onchange` handlers log state changes to the console.
4. **UI Updates**: The `updateUI` function updates the DOM based on the current state values.
5. **Manual Increment**: The `incrementCount` function allows manual state updates via a button click.

## Usage

1. Clone the repository and include the `Stator.js` library in your project.
2. Use the provided code to create reactive states and bind them to your UI.
3. Customize the logic as needed for your application.

Enjoy building reactive applications with **Stator**!  