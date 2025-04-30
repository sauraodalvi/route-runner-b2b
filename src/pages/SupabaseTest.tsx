import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { testDirectApiAccess } from '@/utils/direct-api-test';

export default function SupabaseTest() {
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'error'>('unknown');
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setTestResults(null);

    try {
      console.log('Testing Supabase connection...');
      console.log('Supabase URL:', supabase.supabaseUrl);

      // Test direct API access first
      console.log('Testing direct API access...');
      await testDirectApiAccess();

      // Test 1: Simple query
      console.log('Running test query...');
      const { data, error } = await supabase
        .from('pg_tables')
        .select('tablename')
        .limit(5);

      if (error) {
        console.error('Query failed:', error);
        setConnectionStatus('error');
        setError(`Connection failed: ${error.message}`);
        setTestResults({ error });

        // Try a direct query to routes table
        console.log('Trying direct query to routes table...');
        const { data: routesData, error: routesError } = await supabase
          .from('routes')
          .select('id,name,trip_id')
          .limit(3);

        if (routesError) {
          console.error('Routes query failed:', routesError);
        } else {
          console.log('Routes query succeeded:', routesData);
          setConnectionStatus('success');
          setTestResults({ data: routesData });
        }
      } else {
        console.log('Query succeeded:', data);
        setConnectionStatus('success');
        setTestResults({ data });

        // If the first test succeeded, try to list tables
        const { data: tables, error: tablesError } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public');

        if (tablesError) {
          console.error('Failed to list tables:', tablesError);
        } else {
          console.log('Tables in public schema:', tables);
          setTestResults(prev => ({ ...prev, tables }));

          // Try to query the routes table
          const { data: routesData, error: routesError } = await supabase
            .from('routes')
            .select('id,name,trip_id')
            .limit(3);

          if (routesError) {
            console.error('Routes query failed:', routesError);
          } else {
            console.log('Routes query succeeded:', routesData);
            setTestResults(prev => ({ ...prev, routes: routesData }));
          }
        }
      }
    } catch (err) {
      console.error('Exception during test:', err);
      setConnectionStatus('error');
      setError(`Exception: ${err instanceof Error ? err.message : String(err)}`);
      setTestResults({ exception: err });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Supabase Connection Test</h1>
            <p className="text-muted-foreground">
              This page tests the connection to your Supabase project.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>
                Testing connection to: {supabase.supabaseUrl}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Testing connection...</span>
                </div>
              ) : connectionStatus === 'success' ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Connection successful!</span>
                  </div>
                </div>
              ) : connectionStatus === 'error' ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span>Connection failed: {error}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>Connection status unknown</span>
                  </div>
                </div>
              )}

              {testResults && testResults.tables && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Tables in your database:</h3>
                  <div className="bg-gray-100 p-4 rounded">
                    <ul className="list-disc pl-5">
                      {testResults.tables.map((table: any) => (
                        <li key={table.tablename}>{table.tablename}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {testResults && testResults.routes && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Routes in your database:</h3>
                  <div className="bg-gray-100 p-4 rounded">
                    <ul className="list-disc pl-5">
                      {testResults.routes.map((route: any) => (
                        <li key={route.id}>{route.name} (ID: {route.id}, Trip ID: {route.trip_id})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {testResults && testResults.error && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Error details:</h3>
                  <div className="bg-gray-100 p-4 rounded">
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(testResults.error, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={testConnection} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection Again'
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
              <CardDescription>
                Common issues and solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">CORS Issues</h3>
                  <p className="text-muted-foreground">
                    If you're seeing CORS errors, make sure your Supabase project has the correct CORS configuration.
                    Go to your Supabase project settings and add <code>http://localhost:8081</code> to the allowed origins.
                  </p>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open('https://supabase.com/dashboard/project/wnvonjgjusywqewejeho/api?page=cors', '_blank')}
                    >
                      Open CORS Settings
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Authentication Issues</h3>
                  <p className="text-muted-foreground">
                    Make sure you're using the correct API key. For client-side access, you should use the anon/public key.
                  </p>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open('https://supabase.com/dashboard/project/wnvonjgjusywqewejeho/settings/api', '_blank')}
                    >
                      Check API Keys
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Network Issues</h3>
                  <p className="text-muted-foreground">
                    Check if you can access your Supabase project URL directly in the browser.
                    Try visiting <a href={`${supabase.supabaseUrl}/health`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{supabase.supabaseUrl}/health</a>.
                  </p>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open(`${supabase.supabaseUrl}/health`, '_blank')}
                    >
                      Check Health Endpoint
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">RLS (Row Level Security) Issues</h3>
                  <p className="text-muted-foreground">
                    Your tables might have RLS enabled but no policies that allow the anon user to access data.
                    Check your RLS policies or temporarily disable RLS for development.
                  </p>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open('https://supabase.com/dashboard/project/wnvonjgjusywqewejeho/editor/routes', '_blank')}
                    >
                      Check Routes Table
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
