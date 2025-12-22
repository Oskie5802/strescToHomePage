export const metadata = {
  title: 'Strescto - Streszczenia AI',
  description: 'Twoje centrum streszczeń lektur generowanych przez sztuczną inteligencję.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  )
}
