'use client'

import '@primer/live-region-element/define'
import {LiveRegionElement} from '@primer/live-region-element'
import {canUseDOM} from '../environment'

import * as React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'live-region': React.DetailedHTMLProps<React.HTMLAttributes<LiveRegionElement>, LiveRegionElement>
    }
  }
}

const style = `
  :host {
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`

export function LiveRegion() {
  return (
    <live-region>
      {canUseDOM ? null : (
        // @ts-expect-error shadowrootmode exists on `template`
        <template shadowrootmode="open">
          <style>{style}</style>
          <div id="polite" aria-live="polite" aria-atomic="true" />
          <div id="assertive" aria-live="assertive" aria-atomic="true" />
        </template>
      )}
    </live-region>
  )
}
