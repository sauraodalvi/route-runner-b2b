const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project-ref.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sbp_e32eba27975a890a601b4db9f563ad10b74fc9e5';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function setupSupabase() {
  console.log('Setting up Supabase schema for B2B Logistics App...');
  
  try {
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the SQL into manageable chunks
    const sqlStatements = schemaSql.split(';').filter(stmt => stmt.trim().length > 0);
    
    // Execute each SQL statement
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i].trim() + ';';
      console.log(`Executing SQL statement ${i + 1}/${sqlStatements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}: ${error.message}`);
        console.error('Statement:', statement);
      }
    }
    
    console.log('Supabase schema setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up Supabase schema:', error.message);
  }
}

setupSupabase();
