import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eaggkuxydmkdtkshzdyu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZ2drdXh5ZG1rZHRrc2h6ZHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODA4MDYsImV4cCI6MjA5NDc1NjgwNn0.d526QMtOIDzIUpfyrnWZDhsScXLkkggXqe1E9fJW-kc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
