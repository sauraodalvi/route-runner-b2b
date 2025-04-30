// This script checks the existing tables in your Supabase project
// Run with: node scripts/check-supabase.js

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

async function checkTables() {
  console.log('Checking tables in Supabase project: B2B Logistics App');
  console.log('Project ID:', 'wnvonjgjusywqewejeho');
  console.log('URL:', supabaseUrl);

  try {
    // Query the pg_tables view to get a list of all tables in the public schema
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (error) {
      console.error('Error checking tables:', error);
      return;
    }

    // Extract table names
    const tables = data.map(row => row.tablename);
    console.log('\nExisting tables in Supabase:');
    tables.forEach(table => console.log(`- ${table}`));

    // Check if our required tables exist
    const requiredTables = [
      'organizations',
      'partners',
      'teams',
      'routes',
      'stops',
      'samples',
      'attachments'
    ];

    console.log('\nChecking required tables:');
    for (const table of requiredTables) {
      const exists = tables.includes(table);
      console.log(`- ${table}: ${exists ? '✅ Exists' : '❌ Missing'}`);
    }

    // Check if we need to create any tables
    const missingTables = requiredTables.filter(table => !tables.includes(table));
    if (missingTables.length > 0) {
      console.log('\nMissing tables that need to be created:');
      missingTables.forEach(table => console.log(`- ${table}`));
    } else {
      console.log('\nAll required tables exist! ✅');
    }

  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

// Run the check
checkTables();
