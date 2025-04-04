# Component Creation in JSphere

This document provides a comprehensive guide on how to create and integrate
components in a JSphere project.

## Table of Contents

1. [Component Structure](#component-structure)
2. [Creating a Component](#creating-a-component)
3. [Component Lifecycle](#component-lifecycle)
4. [Server-Side vs. Client-Side Rendering](#server-side-vs-client-side-rendering)
5. [Registering Components](#registering-components)
6. [Using Components in Pages](#using-components-in-pages)
7. [Communication Between Components](#communication-between-components)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Component Structure

In JSphere, components typically follow this directory structure:

```
components/
  └── [component-type]/
      └── [component-name]/
          ├── [component-name].js
          └── [component-name].css
```

Where:

- `[component-type]` is either `pages`, `widgets`, or `controls`
- `[component-name]` is the name of your component

## Creating a Component

### Basic Component Template

```javascript
import { createComponent$ } from "../../../../shared/element.min.js";

createComponent$("component-name", (el) => {
    // Component state variables
    let stateVariable = initialValue;

    el.define$({
        // Define dependencies
        use$: () => [
            // List of dependencies
        ],

        // Define HTML template
        template$: () => /*html*/ `
            <link rel="stylesheet" href="/path/to/component.css" />
            <div class="component-container">
                <!-- Component HTML structure -->
                <div el-id="childElement" class="child-element"></div>
            </div>
        `,

        // Server-side rendering
        onRender$: async () => {
            // Server-side initialization
            // IMPORTANT: Avoid DOM manipulation here
        },

        // Client-side initialization
        onHydrate$: async () => {
            // Client-side initialization
            // DOM manipulation is safe here
            const { childElement } = el.children$;

            // Set up event listeners
            childElement.addEventListener("click", handleClick);
        },

        // Optional initialization
        onInit$: async () => {
            // Initialization logic
            // This runs before onRender$ and onHydrate$
        },
    });

    // ------------------------ MESSAGE LISTENERS -------------------------

    el.subscribeTo$("MessageName", (data) => {
        // Handle messages from other components
    });

    // ------------------------- HELPER FUNCTIONS -------------------------

    function handleClick() {
        // Handle click event
    }
});
```

## Component Lifecycle

JSphere components have the following lifecycle methods:

1. **onInit$**: Called during initialization, before rendering.
2. **onRender$**: Called during server-side rendering.
3. **onHydrate$**: Called during client-side initialization.

### Important Considerations

- **onRender$** is called on both server and client, but `document` is only
  available on the client.
- **onHydrate$** is only called on the client, so DOM manipulation is safe here.
- Use **template$** for defining the HTML structure, not dynamic DOM creation.

## Server-Side vs. Client-Side Rendering

JSphere uses a hybrid rendering approach:

### Server-Side Rendering (SSR)

During server-side rendering:

- The `template$` function is called to generate the initial HTML.
- The `onRender$` function is called to initialize the component.
- The `document` object is NOT available.
- DOM manipulation should be avoided.

### Client-Side Rendering (CSR)

During client-side rendering:

- The `onHydrate$` function is called to initialize client-side functionality.
- The `document` object IS available.
- DOM manipulation is safe.

### Best Practices for Hybrid Rendering

1. Include all HTML elements in the `template$` function.
2. Use `el-id` attributes to reference elements.
3. Avoid using `document.createElement()` in `onRender$`.
4. Perform all DOM manipulation in `onHydrate$`.

## Registering Components

Components must be registered in the `dependencies.js` file:

```javascript
import {
    registerDependencies$,
    registerServerDependencies$,
} from "./element.min.js";

registerDependencies$({
    "component-name": "/path/to/component.js",
});
```

For server-side components:

```javascript
registerServerDependencies$({
    "service-name": "/path/to/service.ts",
});
```

## Using Components in Pages

To use a component in a page:

```html
<div el-id="componentId" el-is="component-name"></div>
```

To initialize a component from JavaScript:

```javascript
const { componentId } = el.children$;
await componentId.init$({
    // Component properties
    prop1: value1,
    prop2: value2,
});
```

## Communication Between Components

Components can communicate using the message system:

### Sending Messages

```javascript
// From a component
await el.emitMessage$("MessageName", {
    // Message data
    key: value,
});
```

### Receiving Messages

```javascript
// In a component
el.subscribeTo$("MessageName", (data) => {
    // Handle message
    console.log(data.key);
});
```

### API Communication

For API endpoints:

1. Create a service file in `server/services/`
2. Register the service in `dependencies.js`
3. Use `subscribeTo$` to handle API requests

```javascript
// In server/services/service-name.ts
import { subscribeTo$ } from "../../shared/element.min.js";
import { onGET } from "../endpoint.ts";

subscribeTo$("RequestName", async (query, ctx) => {
    try {
        const response = await onGET(ctx);
        return { subject: "ResponseName", data: response };
    } catch (e) {
        return { subject: "Exception", data: { error: e.message } };
    }
});
```

## Best Practices

1. **Component Organization**:
   - Use `pages` for full pages
   - Use `widgets` for reusable UI components
   - Use `controls` for form elements and basic UI controls

2. **Server-Side Rendering**:
   - Include all HTML in the template string
   - Avoid DOM manipulation in `onRender$`
   - Use `el-id` attributes for element references

3. **Client-Side Rendering**:
   - Perform DOM manipulation in `onHydrate$`
   - Set up event listeners in `onHydrate$`
   - Use `el.children$` to access child elements

4. **CSS**:
   - Use component-specific CSS files
   - Use BEM naming convention for CSS classes
   - Include CSS link in the template

5. **State Management**:
   - Use `el.state$` for component state
   - Use message system for cross-component communication

## Troubleshooting

### Common Issues

1. **"document is not defined"**:
   - This occurs when trying to use the `document` object in `onRender$`
   - Solution: Move DOM manipulation to `onHydrate$` or include elements in the
     template

2. **Component not rendering**:
   - Check if the component is registered in `dependencies.js`
   - Check if the component path is correct
   - Check for JavaScript errors in the console

3. **Child elements not accessible**:
   - Ensure child elements have `el-id` attributes
   - Access child elements using `el.children$`

4. **CSS not applied**:
   - Check if the CSS file path is correct
   - Check if the CSS link is included in the template

### Example: Fixing "document is not defined"

Incorrect:

```javascript
onRender$: (async () => {
    const slideElement = document.createElement("div");
    slidesContainer.appendChild(slideElement);
});
```

Correct:

```javascript
template$: () => /*html*/`
    <div el-id="slide0" class="slide"></div>
    <div el-id="slide1" class="slide"></div>
`,
onRender$: async () => {
    // No DOM manipulation
},
onHydrate$: async () => {
    // DOM manipulation is safe here
    const { slide0, slide1 } = el.children$;
    // ...
}
```

By following these guidelines, you can create robust and reusable components in
JSphere that work correctly in both server-side and client-side rendering
environments.
