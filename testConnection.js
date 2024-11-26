import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

async function main() {
  console.log('URL:', process.env.REACT_APP_SUPABASE_URL);
  console.log('KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY);
  
  const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
  )

  try {
    const { data, error } = await supabase
      .from('files')
      .select('count')
      .limit(1)

    if (error) throw error

    console.log('✓ החיבור הצליח!')
    process.exit(0)
  } catch (err) {
    console.error('✗ שגיאת חיבור:', err.message)
    process.exit(1)
  }
}

main() 