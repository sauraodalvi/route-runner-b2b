// This script sets up the Supabase database schema
// Run with: node setup-supabase.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials from environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ixvnwlnbvfqbwfnbxnzs.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_KEY || 'sbp_e32eba27975a890a601b4db9f563ad10b74fc9e5';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function setupSupabase() {
  console.log('Setting up Supabase schema for B2B Logistics App...');
  console.log(`Using Supabase URL: ${SUPABASE_URL}`);
  
  try {
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'supabase', 'simple-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('SQL file loaded successfully.');
    console.log('Executing SQL statements...');
    
    // Execute the SQL directly using the REST API
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSql });
    
    if (error) {
      console.error('Error executing SQL:', error.message);
      return;
    }
    
    console.log('Supabase schema setup completed successfully!');
    console.log('Your B2B Logistics App database is now ready to use.');
    
  } catch (error) {
    console.error('Error setting up Supabase schema:', error.message);
  }
}

setupSupabase();
