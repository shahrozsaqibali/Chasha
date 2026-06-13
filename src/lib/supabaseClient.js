// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kgovpnlfkfqqxpfoqdfj.supabase.co';
const supabaseKey = 'sb_publishable_-q94hfmHbrhFRlDLB30Zpg_iKrZOrr5';

export const supabase = createClient(supabaseUrl, supabaseKey);
