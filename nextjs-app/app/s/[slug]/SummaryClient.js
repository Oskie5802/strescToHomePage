'use client'

import { useState, useEffect } from 'react'

export default function SummaryClient({ teaser, fullContentId }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [content, setContent] = useState(teaser)
  const [isLocked, setIsLocked] = useState(true)

  useEffect(() => {
    // Check if user is logged in (mock)
    const token = localStorage.getItem('strescto_token')
    if (token) {
      setIsLoggedIn(true)
      // fetchFullContent(fullContentId)
    }
  }, [fullContentId])

  const handleLogin = () => {
    // Mock login
    localStorage.setItem('strescto_token', 'mock_token')
    setIsLoggedIn(true)
    alert('Zalogowano pomyślnie! Odśwież stronę, aby zobaczyć pełną treść (w prawdziwej wersji załadowałoby się dynamicznie).')
    window.location.reload()
  }

  return (
    <div>
      <div 
        className="summary-content"
        dangerouslySetInnerHTML={{ __html: content }} 
        style={{ lineHeight: '1.6', fontSize: '18px' }}
      />
      
      {isLocked && !isLoggedIn && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '2rem', 
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(240,240,240,1))', 
          textAlign: 'center',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h3>To jest treść Premium</h3>
          <p>Zaloguj się, aby przeczytać całość.</p>
          <button 
            onClick={handleLogin}
            style={{ 
              padding: '12px 24px', 
              fontSize: '16px', 
              background: '#0070f3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            Zaloguj się / Wykup dostęp
          </button>
        </div>
      )}

      {isLoggedIn && (
         <div style={{ marginTop: '20px', color: 'green', fontWeight: 'bold' }}>
           Jesteś zalogowany. Tutaj pojawiłaby się pełna treść pobrana z API.
         </div>
      )}
    </div>
  )
}
