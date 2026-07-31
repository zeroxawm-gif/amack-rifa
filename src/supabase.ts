import { createClient } from '@supabase/supabase-js';

// Masukkan URL dan Anon Key Supabase abang secara langsung di sini agar tidak error di Vercel
const supabaseUrl = "https://bgdvkemqfxyigupvppnb.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZHZrZW1xZnh5aWd1cHZwcG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMDc1ODgsImV4cCI6MjEwMDg4MzU4OH0.V4UzWegJHQGjjGXt-OBANKNvtDfdwbLB7-aFI3Tmexg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

