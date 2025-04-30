import { supabase } from '@/lib/supabase';

/**
 * Checks what tables exist in the Supabase project
 */
export async function checkExistingTables() {
  try {
    // Query the pg_tables view to get a list of all tables in the public schema
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (error) {
      console.error('Error checking tables:', error);
      return { tables: [], error };
    }
    
    // Extract table names
    const tables = data.map(row => row.tablename);
    console.log('Existing tables in Supabase:', tables);
    
    return { tables, error: null };
  } catch (error) {
    console.error('Error checking tables:', error);
    return { tables: [], error };
  }
}

/**
 * Checks if a specific table exists in the Supabase project
 */
export async function checkTableExists(tableName: string) {
  try {
    const { tables, error } = await checkExistingTables();
    
    if (error) {
      return { exists: false, error };
    }
    
    const exists = tables.includes(tableName);
    console.log(`Table ${tableName} ${exists ? 'exists' : 'does not exist'}`);
    
    return { exists, error: null };
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return { exists: false, error };
  }
}

/**
 * Gets the structure of a specific table
 */
export async function getTableStructure(tableName: string) {
  try {
    // First check if the table exists
    const { exists, error: existsError } = await checkTableExists(tableName);
    
    if (existsError || !exists) {
      return { columns: [], error: existsError || new Error(`Table ${tableName} does not exist`) };
    }
    
    // Query the information_schema.columns view to get the structure of the table
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');
    
    if (error) {
      console.error(`Error getting structure of table ${tableName}:`, error);
      return { columns: [], error };
    }
    
    console.log(`Structure of table ${tableName}:`, data);
    
    return { columns: data, error: null };
  } catch (error) {
    console.error(`Error getting structure of table ${tableName}:`, error);
    return { columns: [], error };
  }
}
