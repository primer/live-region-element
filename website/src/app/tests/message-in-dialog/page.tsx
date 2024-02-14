'use client'

import {announce} from '@primer/live-region-element'
import {type ElementRef, useRef} from 'react'
import {LiveRegion} from '../../../components/LiveRegion'

export default function AssertiveMessageTest() {
  const dialogRef = useRef<ElementRef<'dialog'>>(null)
  return (
    <>
      <h1>Message in dialog test suite</h1>
      <p>This is a test suite for message in a dialog for a live region</p>
      <h2>Example 1: message in dialog</h2>
      <button
        type="button"
        onClick={() => {
          dialogRef.current.showModal()
        }}
      >
        Open dialog
      </button>
      <dialog ref={dialogRef}>
        <h1>Dialog example</h1>
        <button
          type="button"
          onClick={() => {
            dialogRef.current.close()
          }}
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => {
            announce('Example polite message')
          }}
        >
          Announce
        </button>
        <LiveRegion />
      </dialog>
      <p>End of example</p>
    </>
  )
}
