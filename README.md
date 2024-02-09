# live-region-element

> A custom element for making announcements with live regions

## Getting started

To install `@primer/live-region-element` in your project, you will need to run the
following command using [npm](https://www.npmjs.com/):

```bash
npm install -S @primer/live-region-element
```

## Usage

The `@primer/live-region-element` package provides a custom element to assist in making
announcements with live regions. You can make announcements with this custom
element by calling the `announce()` and `announceFromElement` methods:

```ts
const liveRegion = document.querySelector('live-region')

liveRegion.announce('Example message')
```

The package also provides `announce()` and `announceFromElement` so that you
can directly call them, as well.

```ts
import {announce, announceFromElement} from '@primer/live-region-element'

announce('Example message')
```

Each method also supports specifying the politeness level of the announcement
through the `politeness` option.

```ts
const liveRegion = document.querySelector('live-region')

liveRegion.announce('Example polite message', {
  politeness: 'polite',
})

liveRegion.announce('Example assertive message', {
  politeness: 'assertive',
})
```

It is **essential** that the `live-region` element exists in the initial HTML
payload of your application. To do so, include `<live-region></live-region>` in
your HTML and make sure that [the custom element has been
defined](#defining-live-region-as-a-custom-element). Follow the [Declarative
shadow DOM](#declarative-shadow-dom) section below if you would like to include
this in your HTML.

### Defining `live-region` as a custom element

The `@primer/live-region-element` package provides an entrypoint that you can
use to define the `live-region` custom element.

```ts
import '@primer/live-region-element/define`
```

If you prefer to define the custom element directly, import `LiveRegionElement`
directly from the package and use that to define the `live-region` element. For
example:

```ts
import {LiveRegionElement} from '@primer/live-region-element'

if (!customElements.get('live-region')) {
  customElements.define('live-region', LiveRegionElement)
}
```

### Declarative Shadow DOM

The `live-region` custom element includes support for [Declarative Shadow
DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom) and you
can leverage this feature by using the following snippet:

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

In addition, a `templateContent` export is available through the package which
can be used alongside `<template shadowrootmode="open">` to support this
feature.

## 🙌 Contributing

We're always looking for contributors to help us fix bugs, build new features,
or help us improve the project documentation. If you're interested, definitely
check out our [Contributing Guide](/.github/CONTRIBUTING.md)! 👀

## License

Licensed under the [MIT License](/LICENSE).
