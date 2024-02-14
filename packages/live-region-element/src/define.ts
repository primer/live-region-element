import {LiveRegionElement} from './live-region-element'

declare global {
  interface HTMLElementTagNameMap {
    'live-region': LiveRegionElement
  }
}

if (!customElements.get('live-region')) {
  customElements.define('live-region', LiveRegionElement)
}
