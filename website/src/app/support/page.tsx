import Link from 'next/link'

type TestResult =
  | boolean
  | {
      type: 'pass' | 'fail' | 'partial' | 'unknown'
    }

type JAWSResult = {
  chrome: TestResult
  edge: TestResult
  firefox: TestResult
}

type NVDAResult = {
  chrome: TestResult
  edge: TestResult
  firefox: TestResult
}

type VoiceOverResult = {
  safari: TestResult
}

type Results = {
  jaws: JAWSResult
  nvda: NVDAResult
  voiceover_ios: VoiceOverResult
  voiceover_macos: VoiceOverResult
}

type Expectation = {
  expectation: string
  description: string
  testUrl: string
  procedure: Array<string>
  results: Results
}

const resultOrder: Array<[keyof Results, string]> = [
  ['jaws', 'chrome'],
  ['jaws', 'edge'],
  ['jaws', 'firefox'],
  ['nvda', 'chrome'],
  ['nvda', 'edge'],
  ['nvda', 'firefox'],
  ['voiceover_ios', 'safari'],
  ['voiceover_macos', 'safari'],
]
function getResults(expectation: Expectation) {
  const {results} = expectation
  return resultOrder.map(([screenReader, browser]) => {
    let support: TestResult = results[screenReader][browser] ?? {
      type: 'unknown',
    }
    if (typeof support === 'boolean') {
      support = {
        type: support ? 'pass' : 'fail',
      }
    }
    return {
      screenReader,
      browser,
      support,
    }
  })
}

const expectations: Array<Expectation> = [
  {
    expectation: 'Polite message',
    description: 'The live region should support announcing a polite message',
    testUrl: '/tests/polite-message',
    procedure: [
      'Visit the test page URL',
      'Navigate to the Polite message button',
      'Activate the button',
      'The message "Example polite message" should be announced',
    ],
    results: {
      jaws: {
        chrome: true,
        edge: true,
        firefox: true,
      },
      nvda: {
        chrome: true,
        edge: true,
        firefox: true,
      },
      voiceover_ios: {
        safari: true,
      },
      voiceover_macos: {
        safari: true,
      },
    },
  },
  {
    expectation: 'Assertive message',
    description: 'The live region should support announcing an assertive message',
    testUrl: '/tests/assertive-message',
    procedure: [
      'Visit the test page URL',
      'Navigate to the Assertive message button',
      'Activate the button',
      'The message "Example assertive message" should be announced',
    ],
    results: {
      jaws: {
        chrome: true,
        edge: true,
        firefox: true,
      },
      nvda: {
        chrome: true,
        edge: true,
        firefox: true,
      },
      voiceover_ios: {
        safari: true,
      },
      voiceover_macos: {
        safari: true,
      },
    },
  },
  {
    expectation: 'Repeated message',
    description: 'The live region should support announcing a message with the same contents',
    testUrl: '/tests/repeated-message',
    procedure: [
      'Visit the test page URL',
      'Navigate to the Repeated message button',
      'Activate the button',
      'Observe that the "Example message that should be repeated" message was announced',
      'Activate the button again',
      'Observe that the "Example message that should be repeated" message was announced again',
    ],
    results: {
      jaws: {
        chrome: true,
        edge: true,
        firefox: true,
      },
      nvda: {
        chrome: true,
        edge: true,
        firefox: true,
      },
      voiceover_ios: {
        safari: true,
      },
      voiceover_macos: {
        safari: true,
      },
    },
  },
  {
    expectation: 'Message in dialog',
    description: 'The live region should announce messages within a dialog element or an element with aria-modal',
    testUrl: '/tests/message-in-dialog',
    procedure: [
      'Visit the test page URL',
      'Navigate to the Open dialog button',
      'Activate the button',
      'Navigate to the Announce button',
      'Activate the button',
      'The message "Example polite message" should be announced',
      'Only the live region within the dialog should be updated',
      'Navigate to the Open aria-modal dialog button',
      'Activate the button',
      'Navigate to the Announce button',
      'The message "Example polite message" should be announced',
      'Only the live region within the dialog should be updated',
    ],
    results: {
      jaws: {
        chrome: true,
        edge: true,
        firefox: true,
      },
      nvda: {
        chrome: true,
        edge: true,
        firefox: true,
      },
      voiceover_ios: {
        safari: true,
      },
      voiceover_macos: {
        safari: true,
      },
    },
  },
]

export default function SupportPage() {
  return (
    <main>
      <h1>Support information</h1>
      <Link href="/">View examples page</Link>

      <table>
        <caption>Live region support</caption>
        <thead>
          <tr>
            <th rowSpan={2}>Expectation</th>
            <th scope="colgroup" colSpan={3}>
              JAWS
            </th>
            <th scope="colgroup" colSpan={3}>
              NVDA
            </th>
            <th scope="colgroup" colSpan={1}>
              VoiceOver on iOS
            </th>
            <th scope="colgroup" colSpan={1}>
              VoiceOver on macOS
            </th>
          </tr>
          <tr>
            <th scope="col">Chrome</th>
            <th scope="col">Edge</th>
            <th scope="col">Firefox</th>
            <th scope="col">Chrome</th>
            <th scope="col">Edge</th>
            <th scope="col">Firefox</th>
            <th scope="col">Safari</th>
            <th scope="col">Safari</th>
          </tr>
        </thead>
        <tbody>
          {expectations.map(expectation => {
            const results = getResults(expectation)
            return (
              <tr key={expectation.expectation}>
                <td>
                  <Link href={expectation.testUrl}>{expectation.expectation}</Link>
                </td>
                {results.map(result => {
                  let formatted = 'None'
                  let className = ''

                  if (result.support.type === 'pass') {
                    formatted = 'Supported'
                    className = 'supported'
                  } else if (result.support.type === 'partial') {
                    formatted = 'Partial'
                    className = 'partial-support'
                  } else if (result.support.type === 'fail') {
                    formatted = 'None'
                    className = 'no-support'
                  } else if (result.support.type === 'unknown') {
                    formatted = 'Unknown'
                    className = 'unknown-support'
                  }

                  return (
                    <td key={`${result.screenReader}:${result.browser}`} className={className}>
                      {formatted}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <h2>Version information</h2>
      <dl>
        <dt>JAWS</dt>
        <dd>Version 2024.2312.53</dd>
        <dt>NVDA</dt>
        <dd>Version 2023.3.3.30854</dd>
        <dt>Windows 11</dt>
        <dd>Version 10.0.22621</dd>
        <dt>macOS</dt>
        <dd>Version 14.3</dd>
        <dt>iOS</dt>
        <dd>Version 17.2.1</dd>
        <dt>Safari on macOS</dt>
        <dd>Version 17.3</dd>
      </dl>

      <section>
        <h2>Expectations</h2>
        {expectations.map(expectation => {
          const results = getResults(expectation)
          return (
            <article key={expectation.expectation}>
              <h3>{expectation.expectation}</h3>
              <p>{expectation.description}</p>
              <Link href={expectation.testUrl}>{expectation.expectation} test URL</Link>
              <table>
                <caption>{expectation.expectation} support</caption>
                <thead>
                  <tr>
                    <th scope="colgroup" colSpan={3}>
                      JAWS
                    </th>
                    <th scope="colgroup" colSpan={3}>
                      NVDA
                    </th>
                    <th scope="colgroup" colSpan={1}>
                      VoiceOver on iOS
                    </th>
                    <th scope="colgroup" colSpan={1}>
                      VoiceOver on macOS
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">Chrome</th>
                    <th scope="col">Edge</th>
                    <th scope="col">Firefox</th>
                    <th scope="col">Chrome</th>
                    <th scope="col">Edge</th>
                    <th scope="col">Firefox</th>
                    <th scope="col">Safari</th>
                    <th scope="col">Safari</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {results.map(result => {
                      let formatted = 'None'
                      let className = ''

                      if (result.support.type === 'pass') {
                        formatted = 'Supported'
                        className = 'supported'
                      } else if (result.support.type === 'partial') {
                        formatted = 'Partial'
                        className = 'partial-support'
                      } else if (result.support.type === 'fail') {
                        formatted = 'None'
                        className = 'no-support'
                      } else if (result.support.type === 'unknown') {
                        formatted = 'Unknown'
                        className = 'unknown-support'
                      }

                      return (
                        <td key={`${result.screenReader}:${result.browser}`} className={className}>
                          {formatted}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>

              <h4>{expectation.expectation} test procedure</h4>
              <ol>
                {expectation.procedure.map(step => {
                  return <li key={step}>{step}</li>
                })}
              </ol>
            </article>
          )
        })}
      </section>
    </main>
  )
}
