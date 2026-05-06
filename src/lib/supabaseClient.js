import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ikizyehiynanobniqpfy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlraXp5ZWhpeW5hbm9ibmlxcGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTE2MDEsImV4cCI6MjA5MDI2NzYwMX0.TFi8zClYmHIXBn-GuhL45_6uO6mQjmZn_qacG_xRyq4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
