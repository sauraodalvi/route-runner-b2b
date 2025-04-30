import { useState, useEffect } from "react";
import { SupabaseExample } from "@/components/examples/SupabaseExample";
import { testSupabaseConnection, getSupabaseProjectInfo } from "@/utils/supabase-test";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SupabaseDemo() {
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState<{ url: string; tables: string[]; rowCounts: Record<string, number> } | null>(null);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const status = await testSupabaseConnection();
      setConnectionStatus(status);

      if (status.success) {
        const info = await getSupabaseProjectInfo();
        setProjectInfo(info);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      setConnectionStatus({ success: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Supabase Integration</h1>
          <p className="text-muted-foreground">
            This page demonstrates the integration with Supabase for the Route Runner B2B application.
          </p>
        </div>

        <div className="bg-muted/30 p-4 rounded-md border">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium mb-2">Connection Status</h2>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Testing connection to Supabase...</span>
                </div>
              ) : connectionStatus ? (
                <Alert variant={connectionStatus.success ? "default" : "destructive"}>
                  <div className="flex items-center gap-2">
                    {connectionStatus.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>{connectionStatus.success ? "Connected" : "Connection Failed"}</AlertTitle>
                  </div>
                  <AlertDescription>{connectionStatus.message}</AlertDescription>
                </Alert>
              ) : null}
            </div>
            <Button onClick={checkConnection} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>
          </div>

          {projectInfo && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-2">Project Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">URL</p>
                  <p className="font-mono text-sm">{projectInfo.url}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tables</p>
                  <p>{projectInfo.tables.length} tables found</p>
                </div>
              </div>

              {projectInfo.tables.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Table Row Counts</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(projectInfo.rowCounts).map(([table, count]) => (
                      <div key={table} className="bg-background p-2 rounded border">
                        <p className="text-xs font-medium">{table}</p>
                        <p className="text-sm">{count} rows</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-muted/30 p-4 rounded-md border">
          <h2 className="text-lg font-medium mb-2">Setup Instructions</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Create a Supabase account and project</li>
            <li>Run the SQL script in <code>supabase/simple-schema.sql</code> to create the database schema</li>
            <li>Update your <code>.env</code> file with your Supabase URL and API key</li>
            <li>Restart the application</li>
          </ol>
        </div>

        <SupabaseExample />

        <div className="bg-muted/30 p-4 rounded-md border">
          <h2 className="text-lg font-medium mb-2">Database Schema</h2>
          <p className="mb-2">
            The Supabase backend includes the following tables:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>organizations</strong> - Stores information about organizations</li>
            <li><strong>routes</strong> - Main routes with trip information</li>
            <li><strong>stops</strong> - Collection points and drop-off points within routes</li>
            <li><strong>samples</strong> - Samples collected at stops</li>
            <li><strong>attachments</strong> - Files attached to stops</li>
            <li><strong>teams</strong> - Teams assigned to routes</li>
            <li><strong>partners</strong> - Pickup partners who handle the routes</li>
          </ul>
          <p className="mt-2">
            For more details, see the <a href="https://github.com/sauraodalvi/route-runner-b2b/blob/main/supabase/README.md" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Supabase Setup Guide</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
