import { supabase } from '@/lib/supabase';

/**
 * Tests the connection to Supabase
 * @returns A promise that resolves to a boolean indicating if the connection was successful
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Try to fetch a single row from the teams table
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { 
        success: false, 
        message: `Connection failed: ${error.message}. Check your Supabase URL and API key in the .env file.` 
      };
    }
    
    return { 
      success: true, 
      message: 'Successfully connected to Supabase!' 
    };
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return { 
      success: false, 
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Gets the Supabase project information
 * @returns A promise that resolves to the project information
 */
export async function getSupabaseProjectInfo(): Promise<{ 
  url: string; 
  tables: string[]; 
  rowCounts: Record<string, number>;
}> {
  const url = supabase.supabaseUrl;
  const tables: string[] = [];
  const rowCounts: Record<string, number> = {};
  
  try {
    // Get list of tables
    const { data: tableData } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tableData) {
      for (const table of tableData) {
        const tableName = table.tablename;
        tables.push(tableName);
        
        // Get row count for each table
        const { count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        rowCounts[tableName] = count || 0;
      }
    }
  } catch (error) {
    console.error('Error getting Supabase project info:', error);
  }
  
  return { url, tables, rowCounts };
}
