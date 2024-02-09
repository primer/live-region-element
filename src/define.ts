import {LiveRegionElement} from './live-region-element'

if (!customElements.get('live-region')) {
  customElements.define('live-region', LiveRegionElement)
}
