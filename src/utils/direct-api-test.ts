/**
 * This file contains functions to test direct API access to Supabase
 * without using the Supabase client library.
 */

const SUPABASE_URL = 'https://wnvonjgjusywqewejeho.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indudm9uamdqdXN5d3Fld2VqZWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTU3NzIsImV4cCI6MjA2MDQ3MTc3Mn0.8jNkNE3XKs11e_EIfkeoRtZd53GVNDIja0_X-uxOQ6g';

/**
 * Test direct API access to Supabase using fetch
 */
export async function testDirectApiAccess() {
  console.log('Testing direct API access to Supabase...');
  
  try {
    // Test 1: Health check
    console.log('\n--- Test 1: Health Check ---');
    const healthResponse = await fetch(`${SUPABASE_URL}/health`);
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health check response:', healthData);
    } else {
      console.error('Health check failed:', healthResponse.statusText);
    }
    
    // Test 2: REST API access
    console.log('\n--- Test 2: REST API Access ---');
    const apiResponse = await fetch(`${SUPABASE_URL}/rest/v1/routes?select=id,name,trip_id&limit=5`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API response status:', apiResponse.status);
    
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log('API response data:', apiData);
    } else {
      console.error('API request failed:', apiResponse.statusText);
      
      // Try to get more details about the error
      try {
        const errorText = await apiResponse.text();
        console.error('Error details:', errorText);
      } catch (e) {
        console.error('Could not read error details');
      }
    }
    
  } catch (error) {
    console.error('Exception during direct API test:', error);
  }
}

// Make the function available globally for testing in the console
(window as any).testDirectApiAccess = testDirectApiAccess;
