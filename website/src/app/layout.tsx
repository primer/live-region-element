import {Layout} from '../components/Layout'
import './global.css'

export const metadata = {
  title: 'Live Region Element',
  description: 'Examples for the live region custom element',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
