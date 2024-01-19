import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://hynwatxcksdzrrwbkitu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5bndhdHhja3NkenJyd2JraXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQzMDE2NjgsImV4cCI6MjAxOTg3NzY2OH0.iDM1Y24LDdJRhiXCNMuBTc-UQOcaesYTnOnxczgg0KE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
