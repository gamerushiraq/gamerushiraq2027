import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eyjjmacxxcmdzkfqxifo.supabase.co';
const supabasePublishableKey = 'sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
