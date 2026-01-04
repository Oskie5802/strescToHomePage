'use client'

import { useState, useEffect } from 'react'

export default function SummaryClient({ teaser, fullContentId, isPremium = true }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('strescto_token')
    if (token) {
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) return null;

  const appUrl = `https://app.strescto.pl/book/${fullContentId}`;

  return (
    <div style={{ 
      marginTop: '2rem', 
      padding: '48px 32px', 
      backgroundColor: '#fff', 
      borderRadius: '24px', 
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ 
        backgroundColor: '#E05D44', 
        color: '#fff', 
        display: 'inline-block', 
        padding: '5px 14px', 
        borderRadius: '20px', 
        fontSize: '11px', 
        fontWeight: '800', 
        marginBottom: '20px',
        textTransform: 'uppercase',
        letterSpacing: '1.2px'
      }}>
        {isPremium ? 'Treść Chroniona' : 'Dostępne w aplikacji'}
      </div>

      <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '28px', marginBottom: '16px', color: '#232323', fontWeight: 'bold' }}>
        {isLoggedIn ? 'Kontynuuj czytanie' : 'Chcesz poznać całą historię?'}
      </h3>

      <p style={{ color: '#5D5D5D', marginBottom: '36px', fontSize: '17px', lineHeight: '1.6', maxWidth: '520px', margin: '0 auto 36px' }}>
        {isPremium 
          ? 'Pełne streszczenie, plan wydarzeń, charakterystyka postaci oraz analiza motywów dostępne są w naszej aplikacji Streść.to.'
          : 'To tylko fragment opracowania. Pełna wersja, quizy i dodatkowe materiały czekają na Ciebie w aplikacji.'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <a 
          href={appUrl}
          style={{
            backgroundColor: '#E05D44',
            color: '#fff',
            padding: '16px 40px',
            borderRadius: '100px',
            fontSize: '16px',
            fontWeight: '700',
            textDecoration: 'none',
            transition: 'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
            display: 'inline-block',
            boxShadow: '0 10px 20px rgba(224, 93, 68, 0.2)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#d04d34';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(224, 93, 68, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#E05D44';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(224, 93, 68, 0.2)';
          }}
        >
          Przejdź do aplikacji
        </a>
      </div>
    </div>
  )
}
