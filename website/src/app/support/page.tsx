import Link from 'next/link'

export default function SupportPage() {
  return (
    <main>
      <h1>Support information</h1>

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
          <tr>
            <td>
              <Link href="/tests/polite-message">Polite message</Link>
            </td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="supported">Supported</td>
            <td className="supported">Supported</td>
          </tr>
          <tr>
            <td>
              <Link href="/tests/assertive-message">Assertive message</Link>
            </td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="supported">Supported</td>
            <td className="supported">Supported</td>
          </tr>
          <tr>
            <td>
              <Link href="/tests/repeated-message">Repeated message</Link>
            </td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="unknown-support">Unknown</td>
            <td className="supported">Supported</td>
            <td className="supported">Supported</td>
          </tr>
        </tbody>
      </table>
    </main>
  )
}
