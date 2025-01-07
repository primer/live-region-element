# @primer/live-region-element

## 0.8.0

### Minor Changes

- 9c72551: Add export condition for browser for compatability with vitest

## 0.7.2

### Patch Changes

- 4c1bf0a: Update visually hidden styles for `<live-region>` element

## 0.7.1

### Patch Changes

- 273ddb9: Fix race condition caused by calling `clear` immediately after `announce`

## 0.7.0

### Minor Changes

- 2e1d6ab: Add support for waiting for announcement completion by returning a promise from announce, announceFromElement
- 2e1d6ab: Add support for dynamically inserting live regions while still announcing to screen readers

## 0.6.1

### Patch Changes

- f845f45: Update the CommonJS bundles emitted to inline ESM-only dependencies

## 0.6.0

### Minor Changes

- 4fbbc8e: Update delayMs to only work with politeness="polite"

### Patch Changes

- e2c8e1f: Update default throttle delay for announcements from 500ms to 150ms.

## 0.5.1

### Patch Changes

- 623a9ed: Update ordering of announcements to prioritize assertive announcements over polite if they are scheduled before or at the same time

## 0.5.0

### Minor Changes

- a20aa47: Update how LiveRegion throttles announcements for better ordering of announcements

## 0.4.0

### Minor Changes

- 9adf94d: Update logic for finding, or creating, live regions to work while within dialog elements

## 0.3.0

### Minor Changes

- 689b686: Add support for delayMs to announcements, along with support for canceling announcements

## 0.2.0

### Minor Changes

- 15464e5: Add define behavior to entrypoint, remove define entrypoint

## 0.1.1

### Patch Changes

- 078f16a: Add main and types to package.json

## 0.1.0

### Minor Changes

- 592c4c5: Release package to npm
