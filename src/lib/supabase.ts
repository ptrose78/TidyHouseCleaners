import { createClient } from '@supabase/supabase-js';

// The ! asserts that the environment variables are defined.
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 

// Use the Service Role Key for server-side API routes for full control
// e.g., posting new bookings, canceling bookings.
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);