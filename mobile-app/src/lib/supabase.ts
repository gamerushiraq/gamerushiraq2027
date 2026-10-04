import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eyjjmacxxcmdzkfqxifo.supabase.co';
const supabasePublishableKey = 'sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: { autoRefreshToken:true, persistSession:true, detectSessionInUrl:false }
});