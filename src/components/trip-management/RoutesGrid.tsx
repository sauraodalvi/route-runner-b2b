import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./RoutesGrid.css";
import { Route, Stop } from "@/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, ChevronDown, ChevronUp, Download, FileText, Phone, User, MapPin, Clock, Building, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RoutesGridProps {
  routes: Route[];
  status: string;
  searchQuery: string;
  dateRange: { from?: Date; to?: Date } | undefined;
  onEditRoute: (route: any) => void;
  onViewDetails: (routeId: string) => void;
}

// Custom cell renderer for status badges
const StatusCellRenderer = (params: any) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(params.value)}`}>
      {params.value}
    </span>
  );
};

// Custom cell renderer for samples collected with progress bar
const SamplesCollectedRenderer = (params: any) => {
  const max = 30; // Assuming a reasonable max value
  const percentage = Math.min(100, (params.value / max) * 100);

  return (
    <div className="flex flex-col items-center">
      <span className="mb-1">{params.value}</span>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
          aria-valuenow={params.value}
          aria-valuemin={0}
          aria-valuemax={max}
          role="progressbar"
        ></div>
      </div>
    </div>
  );
};

// Custom cell renderer for unregistered samples
const UnregisteredSamplesRenderer = (params: any) => {
  const value = params.value || 0;
  const getColor = (val: number) => {
    if (val === 0) return 'bg-green-100 text-green-800';
    if (val <= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="flex justify-center">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getColor(value)}`}>
        {value}
      </span>
    </div>
  );
};

// Custom cell renderer for attachments
const AttachmentsRenderer = (params: any) => {
  if (!params.value) return <span className="text-muted-foreground text-sm">-</span>;

  return (
    <span
      className="text-primary flex items-center cursor-pointer hover:underline"
      onClick={() => alert(`Opening attachments: ${params.value}`)}
      tabIndex={0}
      role="button"
      aria-label={`View ${params.value}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          alert(`Opening attachments: ${params.value}`);
        }
      }}
    >
      <Paperclip className="h-4 w-4 mr-1" />
      {params.value}
    </span>
  );
};

// Custom cell renderer for actions
const ActionsCellRenderer = (params: any) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => params.context.onViewDetails(params.data.id)}
        aria-label="View details"
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">View</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => params.context.onEditRoute(params.data)}
        aria-label="Edit route"
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alert("More options")}
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>More options</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

// Detail cell renderer for stops
const StopDetailCellRenderer = (params: any) => {
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);

  const handleViewNotes = (notes: string) => {
    setSelectedNotes(notes);
    setShowNotesDialog(true);
  };

  return (
    <div className="p-4 bg-gray-50/30">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-center font-medium">#</th>
              <th className="p-2 text-left font-medium">Name</th>
              <th className="p-2 text-left font-medium">Address</th>
              <th className="p-2 text-left font-medium">Type</th>
              <th className="p-2 text-left font-medium">Time</th>
              <th className="p-2 text-left font-medium">Samples</th>
              <th className="p-2 text-left font-medium">Attachments</th>
              <th className="p-2 text-left font-medium">Contact</th>
              <th className="p-2 text-left font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {params.data.stops?.map((stop: Stop) => (
              <tr key={stop.id} className="border-b hover:bg-gray-100">
                <td className="p-2 text-center">
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mx-auto">
                    {stop.id}
                  </div>
                </td>
                <td className="p-2 font-medium">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{stop.name}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p><strong>Organization:</strong> {stop.organization || 'N/A'}</p>
                          <p><strong>In System:</strong> {stop.inSystem ? 'Yes' : 'No'}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-sm">{stop.address}</span>
                  </div>
                </td>
                <td className="p-2">
                  {stop.type === "checkpoint" ? (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                      <Building className="h-3 w-3 mr-1" /> Checkpoint
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground">
                      <Building className="h-3 w-3 mr-1" /> Pickup
                    </span>
                  )}
                </td>
                <td className="p-2">
                  {stop.time && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-sm">{stop.time}</span>
                    </div>
                  )}
                </td>
                <td className="p-2">
                  {stop.samplesCollected ? (
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <span>Registered:</span>
                        <span className="font-medium">{stop.samplesRegistered || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Unregistered:</span>
                        <span className={`font-medium ${stop.samplesUnregistered ? 'text-red-600' : ''}`}>
                          {stop.samplesUnregistered || 0}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </td>
                <td className="p-2">
                  {stop.attachments ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7"
                      onClick={() => alert(`View attachments: ${stop.attachments}`)}
                    >
                      <Paperclip className="h-3 w-3 mr-1" />
                      View Files
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">No attachments</span>
                  )}
                </td>
                <td className="p-2">
                  {stop.contactName ? (
                    <div className="text-sm">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1 text-muted-foreground" />
                        {stop.contactName}
                      </div>
                      {stop.contactPhone && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {stop.contactPhone}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </td>
                <td className="p-2">
                  {stop.notes ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7"
                      onClick={() => handleViewNotes(stop.notes || '')}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      View Notes
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">No notes</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Stop Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{selectedNotes}</p>
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Custom header component with legend for status badges
const StatusHeaderComponent = (props: any) => {
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="flex items-center">
      <div>{props.displayName}</div>
      <Button
        variant="ghost"
        size="sm"
        className="ml-1 h-5 w-5 p-0"
        onClick={() => setShowLegend(!showLegend)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </Button>

      {showLegend && (
        <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-md p-2 border top-full right-0">
          <div className="text-xs font-medium mb-1">Status Legend:</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center">
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 mr-1">active</span>
              <span className="text-xs">In progress</span>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 mr-1">upcoming</span>
              <span className="text-xs">Scheduled</span>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 mr-1">completed</span>
              <span className="text-xs">Finished</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const RoutesGrid = ({
  routes = [],
  status,
  searchQuery,
  dateRange,
  onEditRoute,
  onViewDetails,
}: RoutesGridProps) => {
  const gridRef = useRef<any>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '600px' }), []);

  // Filter routes based on search query and date range
  const filteredRoutes = useMemo(() => {
    console.log('Routes received:', routes);

    if (!routes || routes.length === 0) {
      console.log('No routes available');
      return [];
    }

    return routes.filter((route) => {
      const searchRegex = new RegExp(searchQuery, "i");
      const matchesSearch =
        searchRegex.test(route.tripId) || searchRegex.test(route.name);

      const routeDate = new Date(route.date);
      const startDate = dateRange?.from;
      const endDate = dateRange?.to;

      const matchesDateRange =
        (!startDate || routeDate >= startDate) &&
        (!endDate || routeDate <= endDate);

      return matchesSearch && matchesDateRange;
    });
  }, [routes, searchQuery, dateRange]);

  // Column definitions
  const columnDefs = useMemo(() => [
    {
      field: 'expand',
      headerName: '',
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => params.api.getRowNode(params.rowIndex).setExpanded(!params.node.expanded)}
          >
            {params.node.expanded ?
              <ChevronUp className="h-4 w-4" /> :
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
        );
      },
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    {
      field: 'tripId',
      headerName: 'Trip ID',
      width: 130,
      filter: true,
      headerClass: 'bold-header',
      cellStyle: { fontWeight: 'bold' }
    },
    {
      field: 'name',
      headerName: 'Route',
      width: 200,
      filter: true,
      headerClass: 'bold-header'
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      filter: true,
      valueFormatter: (params: any) => format(new Date(params.value), 'MMM dd, yyyy'),
      headerClass: 'bold-header'
    },
    {
      field: 'startTime',
      headerName: 'Time Start',
      width: 120,
      headerClass: 'bold-header'
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      filter: true,
      cellRenderer: StatusCellRenderer,
      headerComponent: StatusHeaderComponent,
      headerClass: 'bold-header'
    },
    {
      field: 'assignedTeam',
      headerName: 'Assigned Team',
      width: 150,
      filter: true,
      headerClass: 'bold-header'
    },
    {
      field: 'stopCount',
      headerName: 'Stop Count',
      width: 120,
      type: 'numericColumn',
      headerClass: 'bold-header',
      cellStyle: { textAlign: 'center' }
    },
    {
      field: 'samplesCollected',
      headerName: 'Samples Collected',
      width: 160,
      type: 'numericColumn',
      cellRenderer: SamplesCollectedRenderer,
      headerClass: 'bold-header'
    },
    {
      field: 'unregisteredSamples',
      headerName: 'Unregistered Samples',
      width: 180,
      type: 'numericColumn',
      cellRenderer: UnregisteredSamplesRenderer,
      headerClass: 'bold-header'
    },
    {
      field: 'attachments',
      headerName: 'Attachments',
      width: 150,
      cellRenderer: AttachmentsRenderer,
      headerClass: 'bold-header'
    },
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: ActionsCellRenderer,
      headerClass: 'bold-header',
      cellStyle: { padding: '0' }
    }
  ], []);

  // Default column definitions
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    cellStyle: {
      fontSize: '14px',
      color: '#000000',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center'
    }
  }), []);

  // Master detail configuration
  const masterDetail = useMemo(() => {
    return {
      detailCellRenderer: StopDetailCellRenderer,
      detailRowHeight: 300,
    };
  }, []);

  // Row style alternating colors
  const getRowStyle = useCallback((params: any) => {
    return { background: params.node.rowIndex % 2 === 0 ? '#FFFFFF' : '#f9f9f9' };
  }, []);

  // On grid ready
  const onGridReady = useCallback((params: any) => {
    console.log('Grid ready, API available:', params.api);
    console.log('Current row data:', filteredRoutes);
    params.api.sizeColumnsToFit();
  }, [filteredRoutes]);

  // Context for cell renderers
  const context = useMemo(() => ({
    onViewDetails,
    onEditRoute
  }), [onViewDetails, onEditRoute]);

  // Add custom CSS for the grid
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .bold-header {
        font-weight: bold !important;
      }
      .ag-row-hover {
        background-color: rgba(0, 0, 0, 0.05) !important;
      }
      .ag-header-cell-text {
        font-weight: bold;
      }
      @media (max-width: 768px) {
        .ag-header-cell[col-id="attachments"],
        .ag-cell[col-id="attachments"] {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full h-full ag-theme-alpine">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-sm font-medium mr-4">Status Legend:</div>
          <div className="flex space-x-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">active</span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">upcoming</span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800">completed</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const filterModel = {
                status: {
                  type: 'set',
                  values: ['active']
                }
              };
              gridRef.current.api.setFilterModel(filterModel);
            }}
          >
            Filter Active
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => gridRef.current.api.setFilterModel(null)}
          >
            Clear Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              gridRef.current.api.exportDataAsCsv({
                fileName: `routes-export-${new Date().toISOString().split('T')[0]}.csv`
              });
            }}
          >
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      <div style={containerStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={filteredRoutes}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          masterDetail={true}
          detailCellRenderer={StopDetailCellRenderer}
          detailRowHeight={300}
          rowHeight={48}
          headerHeight={48}
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
          context={context}
          getRowStyle={getRowStyle}
          onGridReady={onGridReady}
          domLayout="autoHeight"
        />
      </div>

      {filteredRoutes.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No routes found. Try adjusting your search criteria.
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded-md border">
        <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
        <div className="flex space-x-2">
          <select
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
            onChange={(e) => {
              if (e.target.value) {
                alert(`Action: ${e.target.value}`);
                e.target.value = '';
              }
            }}
          >
            <option value="">Select action...</option>
            <option value="duplicate">Duplicate Selected Route</option>
            <option value="assign">Assign Team</option>
            <option value="export">Export Selected</option>
            <option value="archive">Archive Selected</option>
          </select>
          <Button variant="outline" size="sm">
            Apply to Selected
          </Button>
        </div>
      </div>
    </div>
  );
};
