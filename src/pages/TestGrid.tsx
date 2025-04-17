import React, { useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { MainLayout } from '@/components/layouts/MainLayout';

// Simple test data
const testData = [
  { id: 1, name: 'Test 1', value: 100 },
  { id: 2, name: 'Test 2', value: 200 },
  { id: 3, name: 'Test 3', value: 300 },
  { id: 4, name: 'Test 4', value: 400 },
  { id: 5, name: 'Test 5', value: 500 },
];

const TestGrid = () => {
  const gridRef = useRef<any>(null);
  
  // Column definitions
  const columnDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'value', headerName: 'Value', width: 150 },
  ], []);
  
  // Default column definitions
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
  }), []);
  
  // On grid ready
  const onGridReady = useCallback((params: any) => {
    console.log('Test grid ready');
    params.api.sizeColumnsToFit();
  }, []);
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Test AG Grid</h1>
        
        <div className="w-full h-[400px] ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={testData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default TestGrid;
