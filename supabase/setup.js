const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
const prompt = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => resolve(answer));
});

async function main() {
  console.log('B2B Logistics App - Supabase Setup Script');
  console.log('=========================================\n');
  
  // Get Supabase URL and key from user
  const supabaseUrl = await prompt('Enter your Supabase URL (https://your-project-ref.supabase.co): ');
  const supabaseKey = await prompt('Enter your Supabase API key (starts with sbp_): ');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL and API key are required.');
    rl.close();
    return;
  }
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('\nConnecting to Supabase...');
    
    // Test connection
    const { data: testData, error: testError } = await supabase.from('_test').select('*').limit(1).maybeSingle();
    if (testError && !testError.message.includes('relation "_test" does not exist')) {
      throw new Error(`Connection test failed: ${testError.message}`);
    }
    
    console.log('Connection successful!\n');
    
    // Read schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema SQL...');
    
    // Execute SQL
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSql });
    
    if (error) {
      throw new Error(`Failed to execute schema SQL: ${error.message}`);
    }
    
    console.log('\nSchema setup completed successfully!');
    console.log('\nYour B2B Logistics App database is now ready to use.');
    console.log('You can now run the application and visit the Supabase Demo page to see the integration in action.');
    
    // Update .env file
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace Supabase URL and key
    envContent = envContent.replace(/VITE_SUPABASE_URL=.*/, `VITE_SUPABASE_URL=${supabaseUrl}`);
    envContent = envContent.replace(/VITE_SUPABASE_KEY=.*/, `VITE_SUPABASE_KEY=${supabaseKey}`);
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('\nEnvironment variables updated in .env file.');
    
  } catch (error) {
    console.error(`\nError: ${error.message}`);
  } finally {
    rl.close();
  }
}

main();
