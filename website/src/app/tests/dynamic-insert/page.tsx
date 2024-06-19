'use client'

import {announce} from '@primer/live-region-element'
import React from 'react'

export default function DynamicInsertPage() {
  const dialogRef = React.useRef<React.ElementRef<'dialog'>>(null)

  return (
    <>
      <h1>Dynamic insert test suite</h1>
      <p>
        This test suite demonstrates that the live region element can still make an announcement even if it does not
        exist on the page at the time a helper is called
      </p>
      <h2>Example 1: dynamically insert live region into body</h2>
      <button
        onClick={() => {
          announce('Dynamic announcement')
        }}
      >
        Make announcement
      </button>
      <h2>Example 2: dynamically insert live region into dialog</h2>
      <button
        onClick={() => {
          dialogRef.current.showModal()
        }}
      >
        Open dialog
      </button>
      <dialog ref={dialogRef}>
        <h1>Example dialog</h1>
        <p>This is content within a dialog</p>
        <button
          type="button"
          onClick={() => {
            dialogRef.current.close()
            announce('Dynamic announcement from dialog')
          }}
        >
          Save
        </button>
      </dialog>
    </>
  )
}
