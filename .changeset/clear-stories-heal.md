---
"@primer/live-region-element": patch
---

Avoid the `innerHTML` sink by building the live-region template with DOM APIs, keeping it compatible with Trusted Types enforcement.
