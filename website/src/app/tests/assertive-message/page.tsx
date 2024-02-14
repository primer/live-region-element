'use client'

import {announce} from '@primer/live-region-element'

export default function AssertiveMessageTest() {
  return (
    <>
      <h1>Assertive message test suite</h1>
      <p>This is a test suite for an assertive message for a live region</p>
      <h2>Example 1: assertive message</h2>
      <button
        type="button"
        onClick={() => {
          announce('Example polite message that should be interupted by the assertive message', {
            politeness: 'polite',
          })
        }}
      >
        Polite message to be interupted
      </button>
      <button
        type="button"
        onClick={() => {
          announce('Example assertive message', {
            politeness: 'assertive',
          })
        }}
      >
        Assertive message
      </button>
      <p>End of example</p>
      <live-region />
    </>
  )
}
