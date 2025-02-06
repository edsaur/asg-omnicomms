import { createClient } from "@supabase/supabase-js";

export const supabaseURL = 'https://ovntvnnoudwgkgvjauzl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92bnR2bm5vdWR3Z2tndmphdXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTkzMTgsImV4cCI6MjA1NDE3NTMxOH0.sbZV-0Sz_AIWxU6aErKhUMsA6ZUXTqppuCfWQpHMn84';

export const supabase = createClient(supabaseURL, supabaseKey);