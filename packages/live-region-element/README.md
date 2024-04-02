# live-region-element

> A custom element for making announcements with live regions

## Getting started

To install `@primer/live-region-element` in your project, you will need to run the following command using [npm](https://www.npmjs.com/):

```bash
npm install -S @primer/live-region-element
```

## Usage

The `@primer/live-region-element` package provides a custom element to assist in making announcements with live regions. You can make announcements with this custom element by calling the `announce()` and `announceFromElement` methods:

```ts
const liveRegion = document.querySelector('live-region')

liveRegion.announce('Example message')
```

The package also provides `announce()` and `announceFromElement` so that you can directly call them, as well.

```ts
import {announce, announceFromElement} from '@primer/live-region-element'

announce('Example message')
```

Each method also supports specifying the politeness level of the announcement through the `politeness` option.
By default, announcements will be `polite`.

```ts
const liveRegion = document.querySelector('live-region')

liveRegion.announce('Example polite message', {
  politeness: 'polite',
})

liveRegion.announce('Example assertive message', {
  politeness: 'assertive',
})
```

It is **essential** that the `live-region` element exists in the initial HTML payload of your application. Having multiple live regions on a page is discouraged so we recommend having a single global live region that is available across every page of your application by embedding this `live-region` element as part of your page layout.

To do so, include `<live-region></live-region>` in your HTML and make sure that [the custom element has been defined](#defining-live-region-as-a-custom-element). Follow the [Declarative shadow DOM](#declarative-shadow-dom) section below if you would like to include this in your HTML.

### Declarative Shadow DOM

The `live-region` custom element includes support for [Declarative Shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom) and you can leverage this feature by using the following snippet:

```html
<live-region>
  <template shadowrootmode="open">
    <style>
      :host {
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }
    </style>
    <div id="polite" aria-live="polite" aria-atomic="true"></div>
    <div id="assertive" aria-live="assertive" aria-atomic="true"></div>
  </template>
</live-region>
```

In addition, a `templateContent` export is available through the package which can be used alongside `<template shadowrootmode="open">` to support this feature.

### Delaying announcements

Both `announce` and `announceFromElement` provide support for announcing
messages at a later point in time. In the example below, we are waiting five
seconds before announcing the message.

```ts
import {announce} from '@primer/live-region-element'

announce('Example message', {
  delayMs: 5000,
})
```

### Canceling announcements

Any announcements made with `announce` and `announceFromElement` may be
cancelled. This may be useful if a delayed announcements has become outdated. To
cancel an announcement, call the return value of either method.

```ts
import {announce} from '@primer/live-region-element'

const cancel = announce('Example message', {
  delayMs: 5000,
})

// At some point before five seconds, call:
cancel()
```

If you would like to clear all announcements, like when transitioning between
routes, you can call the `clear()` method on an existing `LiveRegionElement`.

```ts
const liveRegion = document.querySelector('live-region')

// Send example messages
liveRegion.announce('Example polite message', {
  delayMs: 1000,
  politeness: 'polite',
})
liveRegion.announce('Example polite message', {
  delayMs: 1000,
  politeness: 'polite',
})

// Clear all pending messages
liveRegion.clear()
```

## 🙌 Contributing

We're always looking for contributors to help us fix bugs, build new features,
or help us improve the project documentation. If you're interested, definitely
check out our [Contributing Guide](/.github/CONTRIBUTING.md)! 👀

## License

Licensed under the [MIT License](/LICENSE).
