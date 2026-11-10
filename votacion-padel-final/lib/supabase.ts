import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// These values should be set via environment variables in production
const supabaseUrl = 'https://vjxuzesqoaujroozzrzo.supabase.co'
const supabaseAnonKey = 'sb_publishable_dTBAv_4cPwYbrsiCjWR3cQ_gAyXwrUW'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})