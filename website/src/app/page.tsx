'use client'

import {announce, announceFromElement} from '@primer/live-region-element'
import Link from 'next/link'

export default function IndexPage() {
  return (
    <>
      <h1>live-region-element</h1>
      <Link href="/support">View screen reader support</Link>

      <h2>announce</h2>

      <h3>Polite</h3>
      <button
        type="button"
        onClick={() => {
          announce('Example polite message', {
            politeness: 'polite',
          })
        }}
      >
        Announce politely
      </button>

      <h3>Assertive</h3>
      <button
        type="button"
        onClick={() => {
          announce('Example assertive message', {
            politeness: 'assertive',
          })
        }}
      >
        Announce assertively
      </button>

      <h2>announceFromElement</h2>
      <h3>Polite</h3>
      <p id="some-text">Hello world.</p>
      <button
        type="button"
        onClick={() => {
          announceFromElement(document.querySelector('#some-text'), {
            politeness: 'polite',
          })
        }}
      >
        Announce element politely
      </button>

      <h3>Assertive</h3>
      <p id="more-text">Goodbye for now.</p>
      <button
        type="button"
        onClick={() => {
          announceFromElement(document.querySelector('#more-text'), {
            politeness: 'assertive',
          })
        }}
      >
        Announce element assertively
      </button>

      <live-region />
    </>
  )
}
