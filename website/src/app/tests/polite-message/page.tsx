'use client'

import {announce} from '@primer/live-region-element'
import {LiveRegion} from '../../../components/LiveRegion'

export default function PoliteMessageTest() {
  return (
    <>
      <h1>Polite message test suite</h1>
      <p>This is a test suite for a polite message for a live region</p>
      <h2>Example 1: polite message</h2>
      <button
        type="button"
        onClick={() => {
          announce('Example polite message')
        }}
      >
        Polite message
      </button>
      <p>End of example</p>
      <LiveRegion />
    </>
  )
}
