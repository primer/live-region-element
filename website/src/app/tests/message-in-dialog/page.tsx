'use client'

import {announce} from '@primer/live-region-element'
import 'a11y-dialog'
import {type ElementRef, useRef} from 'react'

export default function AssertiveMessageTest() {
  const dialogRef = useRef<ElementRef<'dialog'>>(null)
  const buttonRef = useRef<ElementRef<'button'>>(null)
  const ariaButtonRef = useRef<ElementRef<'button'>>(null)

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
          ref={buttonRef}
          type="button"
          onClick={() => {
            announce('Example polite message', {
              from: buttonRef.current,
            })
          }}
        >
          Announce
        </button>
        <live-region />
      </dialog>
      <p>End of example</p>
      <h2>Example 2: message in dialog with aria-modal</h2>
      <button type="button" data-a11y-dialog-show="aria-modal-dialog">
        Open aria-modal dialog
      </button>
      <div
        id="aria-modal-dialog"
        aria-labelledby="aria-modal-dialog-title"
        aria-hidden="true"
        className="dialog-container"
        data-a11y-dialog="aria-modal-dialog"
        suppressHydrationWarning
      >
        <div data-a11y-dialog-hide />
        <div role="document">
          <h1 id="aria-modal-dialog-title">Example dialog</h1>
          <button type="button" data-a11y-dialog-hide>
            Close
          </button>
          <button
            ref={ariaButtonRef}
            type="button"
            onClick={() => {
              announce('Example polite message', {
                from: ariaButtonRef.current,
              })
            }}
          >
            Announce
          </button>
          <live-region />
        </div>
      </div>
      <p>End of example</p>
      <live-region />
    </>
  )
}
