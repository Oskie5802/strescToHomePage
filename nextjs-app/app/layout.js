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
  title: 'Strescto - Najlepsze Streszczenia Lektur i Opracowania Szkolne',
  description: 'Kompletne streszczenia lektur, precyzyjne plany wydarzeń i szczegółowe charakterystyki postaci. Przygotuj się do matury i egzaminu ósmoklasisty w mgnieniu oka.',
  keywords: ['streszczenia', 'lektury', 'plan wydarzeń', 'charakterystyka postaci', 'matura 2024', 'egzamin ósmoklasisty', 'opracowania lektur', 'język polski'],
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Strescto - Inteligentne Opracowania Lektur',
    description: 'Zrozum każdą lekturę w kilka minut. Plany wydarzeń, bohaterowie i motywy w jednym miejscu.',
    url: 'https://strescto.pl',
    siteName: 'Strescto',
    locale: 'pl_PL',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${fraunces.variable} ${manrope.variable}`}>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#F2F0E9', color: '#232323', userSelect: 'none' }}>
        {children}
        <style>{`
          @media print {
            body { display: none !important; }
          }
        `}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', e => e.preventDefault());
              document.addEventListener('keydown', e => {
                if (
                  e.key === 'F12' ||
                  (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
                  (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'c' || e.key === 'p')) ||
                  (e.metaKey && (e.key === 'u' || e.key === 's' || e.key === 'c' || e.key === 'p' || e.key === 'option'))
                ) {
                  e.preventDefault();
                  return false;
                }
              });
            `
          }}
        />
      </body>
    </html>
  )
}
