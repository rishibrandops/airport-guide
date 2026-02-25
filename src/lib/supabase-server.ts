import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Server-side client with service role key — never expose to browser
export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
