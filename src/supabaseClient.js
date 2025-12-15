// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';


// 🛑 REPLACE these with your actual key fetching method (e.g., hard-coded or import.meta.env) 🛑
const supabaseUrl = 'https://tylqvppxqbsqyxgfgtxf.supabase.co'; 
const supabaseAnonKey = `sb_publishable_9EnhJ_AXSeQiCPzZF0Q0lg_MBcRkEt_`; 



export const supabase = createClient(supabaseUrl, supabaseAnonKey,{
    auth: {
        persistSession: true ,
        autoRefreshToken:true ,
    }
});
