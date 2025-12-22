import { createClient } from '@supabase/supabase-js'

export default async function sitemap() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return []
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const { data: summaries } = await supabase
    .from('summaries')
    .select('slug, created_at')
    .not('slug', 'is', null) 

  const entries = summaries?.map((item) => ({
    url: `https://strescto.pl/s/${item.slug}`,
    lastModified: new Date(item.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) || []

  return [
    {
      url: 'https://strescto.pl',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...entries,
  ]
}
