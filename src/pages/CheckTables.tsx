import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { checkExistingTables, checkTableExists, getTableStructure } from '@/utils/check-tables';
import { supabase } from '@/lib/supabase';

export default function CheckTables() {
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableStructure, setTableStructure] = useState<any[]>([]);
  const [structureLoading, setStructureLoading] = useState(false);

  const checkTables = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { tables, error } = await checkExistingTables();
      
      if (error) {
        throw error;
      }
      
      setTables(tables);
    } catch (err) {
      console.error('Error checking tables:', err);
      setError('Failed to check tables. Please check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };
  
  const viewTableStructure = async (tableName: string) => {
    setSelectedTable(tableName);
    setStructureLoading(true);
    
    try {
      const { columns, error } = await getTableStructure(tableName);
      
      if (error) {
        throw error;
      }
      
      setTableStructure(columns);
    } catch (err) {
      console.error(`Error getting structure of table ${tableName}:`, err);
      setTableStructure([]);
    } finally {
      setStructureLoading(false);
    }
  };
  
  useEffect(() => {
    checkTables();
  }, []);
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Supabase Tables</h1>
            <p className="text-muted-foreground">
              This page shows the tables that exist in your Supabase project.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>
                Supabase URL: {supabase.supabaseUrl}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Checking tables...</span>
                </div>
              ) : error ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                  {error}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-4">Existing Tables</h3>
                  {tables.length === 0 ? (
                    <p className="text-muted-foreground">No tables found in your Supabase project.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {tables.map(table => (
                        <Button
                          key={table}
                          variant="outline"
                          className="justify-start"
                          onClick={() => viewTableStructure(table)}
                        >
                          {table}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={checkTables} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {selectedTable && (
            <Card>
              <CardHeader>
                <CardTitle>Table Structure: {selectedTable}</CardTitle>
                <CardDescription>
                  Columns and data types for the selected table.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {structureLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading table structure...</span>
                  </div>
                ) : tableStructure.length === 0 ? (
                  <p className="text-muted-foreground">No columns found for this table.</p>
                ) : (
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-2">Column Name</th>
                          <th className="text-left p-2">Data Type</th>
                          <th className="text-left p-2">Nullable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableStructure.map((column, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{column.column_name}</td>
                            <td className="p-2">{column.data_type}</td>
                            <td className="p-2">
                              {column.is_nullable === 'YES' ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
