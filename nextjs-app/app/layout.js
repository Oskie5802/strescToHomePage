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
  title: 'Strescto - Streszczenia Lektur, Plany Wydarzeń i Opracowania',
  description: 'Twoje centrum streszczeń lektur. Szybko, konkretnie i na temat. Znajdź plany wydarzeń, charakterystyki postaci i motywy literackie.',
  keywords: ['streszczenia', 'lektury', 'plan wydarzeń', 'charakterystyka', 'matura', 'egzamin ósmoklasisty', 'strescto', 'opracowania'],
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Strescto - Twoje streszczenia AI',
    description: 'Najlepsze streszczenia lektur szkolnych. Ucz się szybciej z Strescto.',
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
