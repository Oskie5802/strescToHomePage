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
    <div style={{ backgroundColor: '#F2F0E9', minHeight: '100vh', color: '#232323', fontFamily: 'var(--font-manrope), sans-serif', display: 'flex' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Sidebar (Desktop) */}
      <aside style={{ 
        width: '300px', 
        position: 'fixed', 
        height: '100vh', 
        borderRight: '1px solid rgba(0,0,0,0.05)', 
        padding: '40px 24px', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#fff'
      }} className="hidden md:flex">
        
        {/* Back Button */}
        <a href="/" style={{ 
          textDecoration: 'none', 
          color: '#5D5D5D', 
          display: 'flex', 
          alignItems: 'center', 
          fontSize: '14px', 
          fontWeight: '600',
          marginBottom: '32px'
        }}>
          <span style={{ marginRight: '8px' }}>&larr;</span> Wróć
        </a>

        {/* Title & User */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontFamily: 'var(--font-fraunces)', 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#232323', 
            marginBottom: '4px',
            lineHeight: '1.1'
          }}>
            {summary.title}
          </h1>
          <p style={{ fontSize: '14px', color: '#888' }}>{summary.author}</p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Overview Group */}
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', letterSpacing: '1px', marginBottom: '12px', fontWeight: 'bold' }}>overview</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
               <div style={{ 
                 padding: '10px 16px', 
                 backgroundColor: '#FFF0EE', 
                 color: '#E05D44', 
                 borderRadius: '12px', 
                 fontWeight: 'bold', 
                 fontSize: '14px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'space-between'
               }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✨ Streszczenie</span>
                 <span style={{ width: '8px', height: '8px', backgroundColor: '#E05D44', borderRadius: '50%' }}></span>
               </div>
               
               <a href={`https://app.strescto.pl/book/${summary.fullContentId}`} style={{ padding: '10px 16px', color: '#5D5D5D', textDecoration: 'none', fontSize: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 👥 Postacie
               </a>
               
               <a href={`https://app.strescto.pl/book/${summary.fullContentId}`} style={{ padding: '10px 16px', color: '#5D5D5D', textDecoration: 'none', fontSize: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 📈 Plan Wydarzeń
               </a>
            </div>
          </div>

          {/* Analysis Group */}
          <div>
             <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', letterSpacing: '1px', marginBottom: '12px', fontWeight: 'bold' }}>Analiza</div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <a href={`https://app.strescto.pl/book/${summary.fullContentId}`} style={{ padding: '10px 16px', color: '#5D5D5D', textDecoration: 'none', fontSize: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>💡 Motywy i Wątki</span>
                  <span style={{ fontSize: '12px' }}>⭐</span>
                </a>
                <a href={`https://app.strescto.pl/book/${summary.fullContentId}`} style={{ padding: '10px 16px', color: '#5D5D5D', textDecoration: 'none', fontSize: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>📖 Analiza Literacka</span>
                  <span style={{ fontSize: '12px' }}>⭐</span>
                </a>
             </div>
          </div>

           {/* Extras Group */}
           <div>
             <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', letterSpacing: '1px', marginBottom: '12px', fontWeight: 'bold' }}>extras</div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <a href={`https://app.strescto.pl/book/${summary.fullContentId}`} style={{ padding: '10px 16px', color: '#5D5D5D', textDecoration: 'none', fontSize: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ❓ Quizy
                </a>
             </div>
          </div>

        </nav>

        {/* Recommended Analysis (Banner) */}
        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
           <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#999', letterSpacing: '1px', marginBottom: '12px', fontWeight: 'bold' }}>REKOMENDOWANE ANALIZY</div>
           <a href={`https://app.strescto.pl/book/${summary.fullContentId}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: '#E05D44', fontSize: '16px', marginTop: '2px' }}>✨</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#232323', lineHeight: '1.4' }}>
                Konflikt romantyzmu i pozytywizmu w światopoglądzie Stanisława Wokulskiego
              </span>
              <span style={{ color: '#E05D44', fontSize: '16px' }}>⊕</span>
           </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '300px', maxWidth: '900px', padding: '60px 80px' }}>
        
        {/* Intro Paragraph */}
        <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#232323', marginBottom: '40px' }}>
          <p>
            {summary.teaser || `Powieść jest panoramicznym obrazem społeczeństwa, ukazującym konflikty społeczne, 
            miłosne rozterki i marzenia o odnowie. Składa się z wielu wątków i łączy formy realistycznej powieści 
            z elementami modernistycznymi. Poniżej przedstawiam szczegółowe streszczenie fabuły, 
            analizę głównego tematu oraz szerszy kontekst literacki.`}
          </p>
        </div>

        {/* Characters Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-fraunces)', fontWeight: 'bold', marginBottom: '20px', color: '#232323' }}>
            ### Główne postacie
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
             {summary.characters.map((char, i) => (
               <li key={i} style={{ marginBottom: '16px', fontSize: '16px', lineHeight: '1.6', color: '#232323', display: 'flex', alignItems: 'flex-start' }}>
                 <span style={{ marginRight: '10px', marginTop: '8px', width: '6px', height: '6px', backgroundColor: '#232323', borderRadius: '50%', flexShrink: 0 }}></span>
                 <span>
                   <strong>{char.name}</strong>: {char.description}
                 </span>
               </li>
             ))}
             <li style={{ marginTop: '20px' }}>
                <a href={`https://app.strescto.pl/book/${summary.fullContentId}`} style={{ color: '#E05D44', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>
                  + Zobacz pozostałe postacie w aplikacji
                </a>
             </li>
          </ul>
        </section>

        {/* Summary Content Section */}
        <section>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-fraunces)', fontWeight: 'bold', marginBottom: '20px', color: '#232323' }}>
            ### Szczegółowe streszczenie fabuły (bez spoilerów kluczowych zwrotów)
          </h2>
          
          <div style={{ position: 'relative' }}>
             <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#232323' }}>
                <div dangerouslySetInnerHTML={{ __html: summary.summaryPreview.replace(/\n/g, '<br/><br/>') }} />
             </div>
             
             {/* Fade Out Overlay */}
             <div style={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '250px',
                background: 'linear-gradient(to bottom, rgba(242,240,233,0) 0%, rgba(242,240,233,1) 80%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '0'
              }}>
             </div>
          </div>
          
          {/* CTA Button Block - Positioned after text */}
          <div style={{ 
            marginTop: '0px', 
            textAlign: 'center', 
            padding: '30px', 
            backgroundColor: '#fff', 
            borderRadius: '16px', 
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
             <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '20px', marginBottom: '8px' }}>Chcesz wiedzieć co było dalej?</h3>
             <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>To dopiero początek. W aplikacji czeka na Ciebie pełne streszczenie tom po tomie.</p>
             <a href={`https://app.strescto.pl/book/${summary.fullContentId}`} style={{
                display: 'inline-block',
                backgroundColor: '#232323',
                color: '#fff',
                padding: '14px 32px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px'
             }}>
               Dokończ czytanie w aplikacji
             </a>
          </div>

        </section>

      </div>

      {/* Mobile Header (Visible only on mobile) */}
      <style jsx global>{`
        @media (max-width: 768px) {
          aside { display: none !important; }
          div[style*="marginLeft: '300px'"] { margin-left: 0 !important; padding: 20px !important; }
        }
      `}</style>
    </div>
  )
}
