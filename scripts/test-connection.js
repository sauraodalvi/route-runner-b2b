// This script tests the connection to Supabase
// Run with: node scripts/test-connection.js

import { createClient } from '@supabase/supabase-js';

// B2B Logistics App - Supabase Configuration
const supabaseUrl = 'https://wnvonjgjusywqewejeho.supabase.co';
const supabaseKey = 'sbp_e32eba27975a890a601b4db9f563ad10b74fc9e5';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

async function testConnection() {
  console.log('Testing connection to Supabase project: B2B Logistics App');
  console.log('Project ID:', 'wnvonjgjusywqewejeho');
  console.log('URL:', supabaseUrl);
  
  try {
    // Try to fetch the server timestamp
    const { data, error } = await supabase.rpc('get_timestamp');
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      
      // Try a simpler query
      console.log('\nTrying a simpler query...');
      const { data: versionData, error: versionError } = await supabase.from('pg_stat_activity').select('*').limit(1);
      
      if (versionError) {
        console.error('Error with simpler query:', versionError);
        console.log('\n❌ Connection failed. Please check your Supabase URL and API key.');
      } else {
        console.log('\n✅ Connection successful!');
        console.log('Data:', versionData);
      }
      
      return;
    }
    
    console.log('\n✅ Connection successful!');
    console.log('Server timestamp:', data);
    
  } catch (error) {
    console.error('Error testing connection:', error);
    console.log('\n❌ Connection failed. Please check your Supabase URL and API key.');
  }
}

// Run the test
testConnection();
