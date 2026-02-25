import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Lazy singleton — created on first call, not at module load time
let _client: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseAdmin() {
  if (!_client) {
    _client = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _client
}

// Backwards-compatible alias
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_, prop: string) {
    return (getSupabaseAdmin() as any)[prop]
  }
})
