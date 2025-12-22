import { createClient } from '@supabase/supabase-js'
import SummaryClient from './SummaryClient'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch summary from Supabase
async function getSummary(slug) {
  try {
    // 1. Try by direct slug match
    if (!slug) return null;

    let { data: slugData } = await supabase
      .from('summaries')
      .select('id, book_title, content_json')
      .eq('slug', slug)
      .maybeSingle()

    if (slugData) {
      return processData(slugData)
    }

    // 2. Try by ID if it looks like a UUID
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(slug)
    if (isUuid) {
      let { data: idData } = await supabase
        .from('summaries')
        .select('id, book_title, content_json')
        .eq('id', slug)
        .maybeSingle()
        
      if (idData) return processData(idData)
    }

    // 3. Fallback: Fuzzy search by title (Slug -> Title)
    // "zemsta-fredro" -> "zemsta fredro"
    const titleQuery = slug.replace(/-/g, ' ')
    let { data: titleData } = await supabase
      .from('summaries')
      .select('id, book_title, content_json')
      .ilike('book_title', `%${titleQuery}%`)
      .limit(1)
      .maybeSingle()

    if (titleData) return processData(titleData)

    return null
  } catch (e) {
    console.error('Supabase fetch error:', e)
    return null
  }
}

function processData(record) {
  const json = record.content_json || {}
  
  // Extract teaser from content (keep existing logic for metadata)
  let teaserText = json.seo_description || ''
  
  if (!teaserText) {
    const summarySection = json.custom_sections?.find(s => s.id === 'summary')
    if (summarySection) {
       teaserText = summarySection.content.substring(0, 300) + '...'
    }
  }
  
  if (!teaserText && json.literary_analysis?.context) {
     teaserText = json.literary_analysis.context.substring(0, 200) + '...'
  }
  
  // Process real content for UI
  const summarySection = json.custom_sections?.find(s => s.id === 'summary')
  // Use first 30% of summary as free preview
  const summaryContent = summarySection ? summarySection.content : ''
  const summaryPreview = summaryContent.length > 500 
      ? summaryContent.substring(0, 500) + '...' 
      : summaryContent

  // Process characters (limit to 3 main ones for free view)
  const characters = (json.characters || [])
      .filter(c => c.role === 'Protagonist' || c.role === 'Antagonist')
      .slice(0, 3)
      .map(c => ({
          name: c.name,
          role: c.role,
          description: c.description,
          icon: c.icon_emoji
      }))

  // Process timeline (limit to 3 events)
  const timeline = (json.timeline || []).slice(0, 3).map(e => ({
      chapter: e.chapter,
      event: e.event,
      description: e.description
  }))

  return {
    title: json.title || record.book_title,
    author: json.author_name || 'Autor nieznany',
    teaser: teaserText, // For SEO
    summaryPreview: summaryPreview,
    characters: characters,
    timeline: timeline,
    fullContentId: record.id,
    slug: json.slug || slugify(json.title || record.book_title)
  }
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const summary = await getSummary(slug)
  if (!summary) return { title: 'Nie znaleziono - Strescto' }
  
  return {
    title: `${summary.title} - Streszczenie, Plan Wydarzeń, Analiza | Strescto`,
    description: `Pełne streszczenie i opracowanie lektury ${summary.title}. ${summary.author}. Plan wydarzeń, charakterystyka bohaterów, motywy literackie.`,
    alternates: {
      canonical: `https://app.strescto.pl/s/${slug}`,
    },
    openGraph: {
      title: `${summary.title} - Streszczenie`,
      description: `Przygotuj się do sprawdzianu z lektury ${summary.title}.`,
      url: `https://app.strescto.pl/s/${slug}`,
      siteName: 'Strescto',
      type: 'article',
    },
  }
}

export default async function SummaryPage({ params }) {
  const { slug } = await params
  const summary = await getSummary(slug)

  if (!summary) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px', fontSize: '2rem' }}>Nie znaleziono streszczenia</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '40px', lineHeight: '1.6', color: '#444' }}>
          Jeszcze nie wygenerowaliśmy streszczenia dla tej książki, ale możesz to zrobić w naszej aplikacji w kilka sekund!
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <a href="https://app.strescto.pl" 
             style={{ 
               backgroundColor: '#000', 
               color: '#fff', 
               padding: '16px 32px', 
               borderRadius: '12px', 
               textDecoration: 'none',
               fontWeight: 'bold',
               fontSize: '18px',
               boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
             }}>
             Otwórz aplikację Streść.to
          </a>
          
          <p style={{ color: '#666', fontSize: '14px', maxWidth: '400px' }}>
            Aplikacja automatycznie wygeneruje plan wydarzeń, charakterystykę postaci i analizę.
          </p>
          
          <a href="/" style={{ color: '#0070f3', marginTop: '20px', textDecoration: 'none' }}>&larr; Wróć na stronę główną</a>
        </div>
      </div>
    )
  }

  // Schema.org JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    'name': summary.title,
    'author': {
      '@type': 'Person',
      'name': summary.author
    },
    'workExample': {
      '@type': 'CreativeWork',
      'potentialAction': {
        '@type': 'ReadAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `https://app.strescto.pl/s/${slug}`
        }
      },
      'isAccessibleForFree': 'False',
      'hasPart': {
        '@type': 'WebPageElement',
        'isAccessibleForFree': 'False',
        'cssSelector': '.premium-lock'
      }
    }
  }

  return (
    <div style={{ backgroundColor: '#F2F0E9', minHeight: '100vh', color: '#232323', fontFamily: 'var(--font-manrope), sans-serif' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Navbar */}
      <nav style={{ padding: '20px', borderBottom: '1px solid #E5E0D5', backgroundColor: '#F2F0E9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', fontFamily: 'var(--font-fraunces)' }}>Streść.to</div>
        <a href="https://app.strescto.pl" style={{ textDecoration: 'none', color: '#E05D44', fontWeight: 'bold', fontSize: '14px' }}>
          Otwórz aplikację &rarr;
        </a>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        
        {/* Header */}
        <header style={{ marginTop: '40px', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '10px', fontFamily: 'var(--font-fraunces)', color: '#232323', lineHeight: 1.1 }}>{summary.title}</h1>
          <p style={{ color: '#5D5D5D', fontSize: '1.2rem', fontFamily: 'var(--font-manrope)' }}>{summary.author}</p>
        </header>

        <main>
          {/* Summary Section */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-fraunces)', marginBottom: '20px', borderBottom: '2px solid #E05D44', display: 'inline-block', paddingBottom: '5px' }}>Streszczenie</h2>
            <div style={{ 
              backgroundColor: '#fff', 
              padding: '30px', 
              borderRadius: '20px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              lineHeight: '1.8',
              fontSize: '18px'
            }}>
              <div dangerouslySetInnerHTML={{ __html: summary.summaryPreview.replace(/\n/g, '<br/>') }} />
              
              <div style={{ 
                marginTop: '20px', 
                padding: '20px', 
                background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(242,240,233,1))', 
                textAlign: 'center',
                borderRadius: '12px',
                border: '1px solid #E5E0D5'
              }}>
                 <p style={{ fontWeight: 'bold', marginBottom: '15px', color: '#5D5D5D' }}>To tylko fragment...</p>
                 <a href={`https://app.strescto.pl/book/${summary.fullContentId}`} style={{
                   display: 'inline-block',
                   backgroundColor: '#232323',
                   color: '#fff',
                   padding: '12px 24px',
                   borderRadius: '12px',
                   textDecoration: 'none',
                   fontWeight: 'bold',
                   boxShadow: '0 4px 12px rgba(35,35,35,0.2)'
                 }}>
                   Czytaj całość w aplikacji
                 </a>
              </div>
            </div>
          </section>

          {/* Characters Section */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-fraunces)', marginBottom: '20px', borderBottom: '2px solid #E05D44', display: 'inline-block', paddingBottom: '5px' }}>Bohaterowie</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
               {summary.characters.map((char, i) => (
                 <div key={i} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #E5E0D5' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>{char.icon}</div>
                    <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '20px', marginBottom: '5px' }}>{char.name}</h3>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: '#E05D44', marginBottom: '10px' }}>{char.role}</div>
                    <p style={{ fontSize: '14px', color: '#5D5D5D', lineHeight: '1.5' }}>
                      {char.description.substring(0, 100)}...
                    </p>
                 </div>
               ))}
               
               {/* Locked Character Card */}
               <div style={{ 
                 backgroundColor: '#f9f9f9', 
                 padding: '20px', 
                 borderRadius: '16px', 
                 border: '1px dashed #ccc',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 color: '#888',
                 minHeight: '200px'
               }}>
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>🔒</div>
                  <p style={{ fontWeight: 'bold' }}>+15 innych postaci</p>
                  <p style={{ fontSize: '13px', textAlign: 'center', marginTop: '5px' }}>Dostępne w pełnej wersji</p>
               </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-fraunces)', marginBottom: '20px', borderBottom: '2px solid #E05D44', display: 'inline-block', paddingBottom: '5px' }}>Plan Wydarzeń</h2>
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #E5E0D5' }}>
               {summary.timeline.map((event, i) => (
                 <div key={i} style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '20px' }}>
                    <div style={{ minWidth: '80px', fontSize: '14px', color: '#888', fontWeight: 'bold' }}>{event.chapter}</div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '18px', marginBottom: '8px' }}>{event.event}</h3>
                      <p style={{ fontSize: '15px', color: '#5D5D5D', lineHeight: '1.6' }}>{event.description}</p>
                    </div>
                 </div>
               ))}
               <div style={{ padding: '20px', backgroundColor: '#fafafa', textAlign: 'center', color: '#666' }}>
                  <p style={{ marginBottom: '15px' }}>...i 20 kolejnych punktów fabuły</p>
                  <a href={`https://app.strescto.pl/book/${summary.fullContentId}`} style={{ color: '#E05D44', fontWeight: 'bold', textDecoration: 'none' }}>Odblokuj pełny plan &rarr;</a>
               </div>
            </div>
          </section>

          {/* Premium Locked Sections */}
          <section style={{ marginBottom: '40px' }}>
             <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-fraunces)', marginBottom: '20px', color: '#888' }}>Analiza i Motywy</h2>
             <div style={{ 
               backgroundColor: '#232323', 
               borderRadius: '20px', 
               padding: '40px', 
               color: '#fff', 
               textAlign: 'center',
               position: 'relative',
               overflow: 'hidden'
             }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '24px', marginBottom: '15px' }}>Głęboka Analiza Literacka</h3>
                  <p style={{ color: '#ccc', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px auto' }}>
                    Uzyskaj dostęp do pełnej analizy motywów, symboli, kontekstu historycznego oraz quizów sprawdzających wiedzę.
                  </p>
                  <a href={`https://app.strescto.pl/book/${summary.fullContentId}`} style={{
                     display: 'inline-block',
                     backgroundColor: '#E05D44',
                     color: '#fff',
                     padding: '14px 30px',
                     borderRadius: '12px',
                     textDecoration: 'none',
                     fontWeight: 'bold',
                     fontSize: '16px',
                     boxShadow: '0 4px 15px rgba(224, 93, 68, 0.4)'
                   }}>
                     Zaloguj się aby zobaczyć
                   </a>
                </div>
                {/* Abstract bg shapes */}
                <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '300px', height: '300px', backgroundColor: 'rgba(224, 93, 68, 0.1)', borderRadius: '50%' }} />
             </div>
          </section>

        </main>

        <footer style={{ marginTop: '80px', fontSize: '0.9rem', color: '#888', textAlign: 'center', borderTop: '1px solid #E5E0D5', paddingTop: '40px' }}>
          <p>Streszczenie wygenerowane przez sztuczną inteligencję Strescto.</p>
          <p>&copy; 2025 Strescto. <a href="https://strescto.pl" style={{ color: '#232323' }}>Pobierz aplikację</a></p>
        </footer>
      </div>
    </div>
  )
}
