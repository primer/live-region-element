'use client'

import {announce} from '@primer/live-region-element'
import {LiveRegion} from '../../../components/LiveRegion'

export default function PoliteMessageTest() {
  return (
    <>
      <h1>Repeated message test suite</h1>
      <p>This is a test suite for a repeated message for a live region</p>
      <h2>Example 1: repeated message</h2>
      <button
        type="button"
        onClick={() => {
          announce('Example message that should be repeated')
        }}
      >
        Repeated message
      </button>
      <p>End of example</p>
      <LiveRegion />
    </>
  )
}
