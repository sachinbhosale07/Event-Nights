import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION START ---
// 1. Create a project at https://supabase.com
// 2. Run the SQL from supabase_setup.sql in your Supabase SQL Editor
// 3. Paste your URL and ANON KEY below from Project Settings -> API

const supabaseUrl = 'https://nomigspyajcgvznltbxb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbWlnc3B5YWpjZ3Z6bmx0YnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTEyMzIsImV4cCI6MjA4MTAyNzIzMn0.B4-MjWXezmq0rCgoUl9VAQ3J7xwQL_ZsJa8Zj10XOjg';

// --- CONFIGURATION END ---

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
