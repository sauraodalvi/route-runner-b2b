import { supabase } from '@/lib/supabase';

/**
 * Tests the connection to Supabase
 */
export async function testSupabaseConnection() {
  try {
    console.log('Testing connection to Supabase...');
    console.log('Supabase URL:', supabase.supabaseUrl);

    // First try a simple health check
    console.log('Trying health check...');
    const healthCheck = await fetch(`${supabase.supabaseUrl}/health`);
    console.log('Health check status:', healthCheck.status);

    if (healthCheck.ok) {
      const healthData = await healthCheck.json();
      console.log('Health check data:', healthData);
    } else {
      console.error('Health check failed:', healthCheck.statusText);
    }

    // Now try to query a table that we know exists
    console.log('Trying to query the teams table...');
    const { data, error } = await supabase.from('teams').select('*').limit(1);

    if (error) {
      console.error('Connection test failed:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return { success: false, error };
    }

    console.log('Connection test successful!');
    console.log('Data received:', data);
    return { success: true, error: null };
  } catch (error) {
    console.error('Connection test failed with exception:', error);
    return { success: false, error };
  }
}

/**
 * Checks if the required tables exist in Supabase
 */
export async function checkRequiredTables() {
  try {
    console.log('Checking required tables...');

    const requiredTables = [
      'organizations',
      'partners',
      'teams',
      'routes',
      'stops',
      'samples',
      'attachments'
    ];

    // Check each table individually
    const existingTables = [];
    const missingTables = [];
    const tablesStatus = [];

    for (const table of requiredTables) {
      try {
        console.log(`Checking if table '${table}' exists...`);
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        const exists = !error;

        if (exists) {
          existingTables.push(table);
          console.log(`Table '${table}' exists with ${count} rows`);
        } else {
          missingTables.push(table);
          console.error(`Table '${table}' does not exist:`, error);
        }

        tablesStatus.push({
          name: table,
          exists,
          count: count || 0,
          error: error ? error.message : null
        });
      } catch (tableError) {
        console.error(`Error checking table '${table}':`, tableError);
        missingTables.push(table);
        tablesStatus.push({
          name: table,
          exists: false,
          count: 0,
          error: tableError instanceof Error ? tableError.message : 'Unknown error'
        });
      }
    }

    console.log('Tables check complete:');
    console.log('- Existing tables:', existingTables);
    console.log('- Missing tables:', missingTables);

    return {
      tables: existingTables,
      requiredTables,
      missingTables,
      tablesStatus,
      allTablesExist: missingTables.length === 0,
      error: null
    };
  } catch (error) {
    console.error('Error checking tables:', error);
    return {
      tables: [],
      requiredTables: [],
      missingTables: [],
      tablesStatus: [],
      allTablesExist: false,
      error
    };
  }
}
