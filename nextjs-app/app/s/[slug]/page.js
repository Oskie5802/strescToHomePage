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
  
  // Extract teaser from content
  // Prioritize dedicated SEO description, then fallback to custom "summary" section, then analysis context
  let teaserText = json.seo_description || ''
  
  if (!teaserText) {
    const summarySection = json.custom_sections?.find(s => s.id === 'summary')
    if (summarySection) {
       // Take first 300 chars of summary
       teaserText = summarySection.content.substring(0, 300) + '...'
    }
  }
  
  if (!teaserText && json.literary_analysis?.context) {
     teaserText = json.literary_analysis.context.substring(0, 200) + '...'
  }
  
  // Convert Markdown to HTML (very basic, in real app use a library)
  // For now we just wrap paragraphs
  const teaserHtml = teaserText
    .split('\n\n')
    .map(p => `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`)
    .join('')

  return {
    title: json.title || record.book_title,
    author: json.author_name || 'Autor nieznany',
    teaser: teaserHtml,
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Georgia, serif' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <a href="/" style={{ textDecoration: 'none', color: '#666', fontSize: '0.9rem' }}>&larr; Wróć do Strescto</a>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', marginTop: '10px' }}>{summary.title}</h1>
        <p style={{ color: '#666', fontSize: '1.2rem' }}>Autor: {summary.author}</p>
      </header>

      <main>
        <SummaryClient teaser={summary.teaser} fullContentId={summary.fullContentId} />
      </main>

      <footer style={{ marginTop: '50px', fontSize: '0.9rem', color: '#888', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <p>Streszczenie wygenerowane przez sztuczną inteligencję Strescto.</p>
        <p>&copy; 2025 Strescto. <a href="https://strescto.pl">Pobierz aplikację</a></p>
      </footer>
    </div>
  )
}
