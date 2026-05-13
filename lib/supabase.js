import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnon)

export const storageUrl = (bucket, path) =>
  `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`