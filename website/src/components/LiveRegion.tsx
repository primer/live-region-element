'use client'

import '@primer/live-region-element/define'
import {LiveRegionElement} from '@primer/live-region-element'
import * as React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'live-region': React.DetailedHTMLProps<React.HTMLAttributes<LiveRegionElement>, LiveRegionElement>
    }
  }
}

export function LiveRegion() {
  return <live-region />
}
