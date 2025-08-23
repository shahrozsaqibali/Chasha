// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxznarkknnyivsrspdrg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4em5hcmtrbm55aXZzcnNwZHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NjcxMzQsImV4cCI6MjA3MTU0MzEzNH0.xVxEYUdl-xFeGkove2U6oEjDUnWOSS4bDl-PwcrKxVY';

export const supabase = createClient(supabaseUrl, supabaseKey);
