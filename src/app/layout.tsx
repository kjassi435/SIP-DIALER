import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'MCT - My Call Tracking | The Only Tracking Software You Need',
  description: 'Fast and robust call tracking platform. Set up modern call tracking to measure campaign effectiveness with virtual phone numbers & instant analytics.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: 'light', scrollBehavior: 'smooth' }}>
      <body className="chakra-ui-light">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
