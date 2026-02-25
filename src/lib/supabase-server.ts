import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export function getSupabaseAdmin() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
