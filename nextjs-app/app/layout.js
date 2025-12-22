import { Fraunces, Manrope } from 'next/font/google'

const fraunces = Fraunces({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-fraunces',
  display: 'swap',
})

const manrope = Manrope({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata = {
  title: 'Strescto - Streszczenia AI',
  description: 'Twoje centrum streszczeń lektur generowanych przez sztuczną inteligencję.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${fraunces.variable} ${manrope.variable}`}>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#F2F0E9', color: '#232323' }}>
        {children}
      </body>
    </html>
  )
}
