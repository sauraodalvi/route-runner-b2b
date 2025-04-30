import { supabase } from '@/lib/supabase';

/**
 * A simple function to test the Supabase connection
 * This can be called from the browser console:
 * import { testSupabaseConnection } from '@/utils/test-supabase';
 * testSupabaseConnection();
 */
export async function testSupabaseConnection() {
  console.log('=== SUPABASE CONNECTION TEST ===');
  console.log('Supabase URL:', supabase.supabaseUrl);
  console.log('API Key provided:', !!supabase.supabaseKey);
  
  try {
    // Test 1: Health check
    console.log('\n--- Test 1: Health Check ---');
    try {
      const healthResponse = await fetch(`${supabase.supabaseUrl}/health`);
      console.log('Health check status:', healthResponse.status);
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('Health check response:', healthData);
        console.log('✅ Health check passed');
      } else {
        console.error('❌ Health check failed:', healthResponse.statusText);
      }
    } catch (error) {
      console.error('❌ Health check exception:', error);
    }
    
    // Test 2: Auth status
    console.log('\n--- Test 2: Auth Status ---');
    try {
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('❌ Auth check failed:', authError);
      } else {
        console.log('Auth session:', authData);
        console.log('✅ Auth check passed');
      }
    } catch (error) {
      console.error('❌ Auth check exception:', error);
    }
    
    // Test 3: Simple query
    console.log('\n--- Test 3: Simple Query ---');
    try {
      const { data, error } = await supabase
        .from('pg_tables')
        .select('tablename')
        .limit(1);
      
      if (error) {
        console.error('❌ Query failed:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log('Query result:', data);
        console.log('✅ Query passed');
      }
    } catch (error) {
      console.error('❌ Query exception:', error);
    }
    
    // Test 4: CORS check
    console.log('\n--- Test 4: CORS Check ---');
    try {
      const corsResponse = await fetch(`${supabase.supabaseUrl}/rest/v1/pg_tables?select=tablename&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`
        }
      });
      
      console.log('CORS check status:', corsResponse.status);
      
      if (corsResponse.ok) {
        const corsData = await corsResponse.json();
        console.log('CORS check response:', corsData);
        console.log('✅ CORS check passed');
      } else {
        console.error('❌ CORS check failed:', corsResponse.statusText);
      }
    } catch (error) {
      console.error('❌ CORS check exception:', error);
    }
    
    console.log('\n=== TEST SUMMARY ===');
    console.log('Check the console for detailed results');
    
  } catch (error) {
    console.error('❌ Overall test failed with exception:', error);
  }
}

// Export a global function that can be called from the browser console
(window as any).testSupabaseConnection = testSupabaseConnection;
