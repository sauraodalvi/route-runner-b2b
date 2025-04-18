import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Download, Calendar as CalendarIcon, Filter } from "lucide-react";
import { CreateRouteForm } from "@/components/trip-management/CreateRouteForm";
import { RoutesList } from "@/components/trip-management/RoutesList";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { Route } from "@/types";
import { DateRange } from "react-day-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useNavigate } from "react-router-dom"; // Not needed after removing map view
import { Calendar } from "@/components/ui/calendar";
import { sampleRoutes } from "@/data/sampleRoutes";
import { StopWiseView } from "@/components/trip-management/StopWiseView";
import { TripDetailsModal } from "@/components/trip-management/TripDetailsModal";
// Map view removed

// Use sample data from our data file
const mockRoutes: Route[] = sampleRoutes.length > 0 ? sampleRoutes : [
  {
    id: "1",
    tripId: "TR-001-1234",
    name: "Downtown Medical Collection",
    date: "2025-04-17",
    startTime: "08:00 AM",
    endTime: "12:30 PM",
    status: "active",
    assignedTeam: "Team Alpha",
    stopCount: 5,
    samplesCollected: 12,
    unregisteredSamples: 3,
    attachments: "2 files",
    stops: [
      {
        id: 1,
        name: "Central Hospital",
        address: "123 Main St, New York, NY 10001",
        type: "pickup",
        time: "08:15 AM",
        status: "on-time",
        samplesCollected: 5,
        samplesRegistered: 4,
        samplesUnregistered: 1,
        contactName: "Dr. Johnson",
        contactPhone: "555-123-4567",
        organization: "1",
        inSystem: true,
        notes: "Regular pickup location"
      },
      {
        id: 2,
        name: "City Medical Center",
        address: "456 Park Ave, New York, NY 10002",
        type: "pickup",
        time: "09:30 AM",
        status: "delayed",
        samplesCollected: 7,
        samplesRegistered: 5,
        samplesUnregistered: 2,
        contactName: "Nurse Williams",
        contactPhone: "555-987-6543",
        organization: "2",
        inSystem: true
      },
      {
        id: 3,
        name: "Checkpoint Alpha",
        address: "789 Cross St, New York, NY 10003",
        type: "checkpoint",
        time: "10:45 AM",
        status: "on-time",
        notes: "Verification point"
      },
      {
        id: 4,
        name: "Downtown Clinic",
        address: "101 First Ave, New York, NY 10004",
        type: "pickup",
        time: "11:30 AM",
        status: "critical",
        samplesCollected: 4,
        samplesRegistered: 1,
        samplesUnregistered: 3,
        contactName: "Dr. Roberts",
        contactPhone: "555-234-5678",
        organization: "3",
        inSystem: true,
        notes: "Urgent samples, high priority"
      },
      {
        id: 5,
        name: "West Side Medical",
        address: "202 West End, New York, NY 10005",
        type: "pickup",
        time: "12:15 PM",
        status: "on-time",
        samplesCollected: 3,
        samplesRegistered: 3,
        samplesUnregistered: 0,
        contactName: "Lab Technician Brown",
        contactPhone: "555-345-6789",
        organization: "1",
        inSystem: true
      }
    ]
  }
];

const TripManagement = () => {
  // Navigation removed with map view
  const [showCreateRouteDialog, setShowCreateRouteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<any | null>(null);
  // Map view removed
  const [showPickupPoints, setShowPickupPoints] = useState(true);
  const [showDropoffPoints, setShowDropoffPoints] = useState(true);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [viewMode, setViewMode] = useState("trip-wise");
  const [showTripDetailsModal, setShowTripDetailsModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Log routes when they change
  useEffect(() => {
    console.log('Routes initialized:', routes);
    console.log('Sample routes:', sampleRoutes);
  }, [routes]);

  const filterRoutes = (query: string) => {
    setSearchQuery(query);
    toast({
      title: "Search applied",
      description: `Showing results for "${query}"`,
    });
  };

  const handleExport = () => {
    const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');
    toast({
      title: "Export Started",
      description: `Your data is being exported to Excel as stops-${currentDate}.xlsx`,
    });

    // Get filtered routes based on date range
    const filteredRoutes = routes.filter(route => {
      if (!date?.from || !date?.to) return true;

      const routeDate = new Date(route.date);
      return routeDate >= date.from && routeDate <= date.to;
    });

    // Create CSV content with stop-wise data
    const headers = [
      "Trip ID",
      "Route Name",
      "Date",
      "Stop Name",
      "Stop Type",
      "Time Reached",
      "Status",
      "Assigned Team",
      "Contact Person",
      "Contact Number",
      "Registered Samples",
      "Unregistered Samples",
      "Attachments",
      "Notes"
    ];

    let csvContent = headers.join(",") + "\n";

    // Add data rows for each stop in each route
    filteredRoutes.forEach(route => {
      if (!route.stops || route.stops.length === 0) {
        // If no stops, add a single row with route info
        const row = [
          route.tripId,
          route.name,
          route.date,
          "N/A", // Stop Name
          "N/A", // Stop Type
          "N/A", // Time Reached
          route.status,
          route.assignedTeam || 'Unassigned',
          "N/A", // Contact Person
          "N/A", // Contact Number
          route.samplesCollected || 0,
          route.unregisteredSamples || 0,
          route.attachments || 0,
          "No stops available"
        ];

        // Escape any commas in the data
        const escapedRow = escapeCSVRow(row);
        csvContent += escapedRow.join(",") + "\n";
      } else {
        // Add a row for each stop
        route.stops.forEach(stop => {
          const row = [
            route.tripId,
            route.name,
            route.date,
            stop.name,
            stop.type === "pickup" ? "Pickup Point" : "Drop-off Point",
            stop.time || "N/A",
            stop.status || route.status,
            route.assignedTeam || 'Unassigned',
            stop.contactName || "N/A",
            stop.contactPhone || "N/A",
            stop.samplesRegistered || 0,
            stop.samplesUnregistered || 0,
            stop.attachments ? "Yes" : "No",
            stop.notes || ""
          ];

          // Escape any commas in the data
          const escapedRow = escapeCSVRow(row);
          csvContent += escapedRow.join(",") + "\n";
        });
      }
    });

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link and trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `stops-${currentDate}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      toast({
        title: "Export Completed",
        description: "Your stop-wise data has been exported successfully as a CSV file that can be opened in Excel",
      });
    }, 1000);
  };

  // Helper function to escape CSV values
  const escapeCSVRow = (row: any[]) => {
    return row.map(field => {
      if (field === null || field === undefined) return '';
      const fieldStr = String(field);
      // If field contains comma, quote, or newline, wrap it in quotes
      if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
        return `"${fieldStr.replace(/"/g, '""')}"`; // Escape quotes by doubling them
      }
      return fieldStr;
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      toast({
        title: "Date Range Applied",
        description: `Showing trips from ${format(range.from, "MMM d, yyyy")} to ${format(range.to, "MMM d, yyyy")}`,
      });
    }
  };

  const openEditRouteDialog = (route: any) => {
    setRouteToEdit(route);
    setShowCreateRouteDialog(true);
  };

  const openCopyRouteDialog = (route: any) => {
    // Create a copy of the route without name, start date, and assigned team
    const routeCopy = {
      ...route,
      id: `copy-${route.id}`,
      name: "", // Clear the name
      date: "", // Clear the date
      assignedTeam: "", // Clear the assigned team
      isCopy: true // Flag to indicate this is a copy operation
    };

    setRouteToEdit(routeCopy);
    setShowCreateRouteDialog(true);

    toast({
      title: "Copy Route",
      description: "Creating a copy of the route. Please provide a new name and start date.",
    });
  };

  const viewTripDetails = (routeId: string) => {
    // For trip-wise view, open the modal instead of navigating
    setSelectedTripId(routeId);
    setShowTripDetailsModal(true);
  };

  // Map view toggle removed

  // Filter routes based on active tab
  const getRoutesForTab = (tabStatus: string) => {
    if (tabStatus === 'all') {
      return routes;
    }

    // Special handling for cancelled tab - we'll show all routes but filter for cancelled stops in StopWiseView
    if (tabStatus === 'cancelled') {
      return routes;
    }

    const filteredRoutes = routes.filter(route => route.status === tabStatus);
    return filteredRoutes;
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Trip Management</h1>
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Input
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    filterRoutes(searchQuery);
                  }
                }}
                className="pr-8"
              />
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => filterRoutes(searchQuery)}
              >
                <Filter className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <Popover open={showDateRangePicker} onOpenChange={setShowDateRangePicker}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
                      </>
                    ) : (
                      format(date.from, "MMM d, yyyy")
                    )
                  ) : (
                    "Date Range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {/* Map view toggle button removed */}

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button size="sm" onClick={() => {
              setRouteToEdit(null);
              setShowCreateRouteDialog(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Route
            </Button>
          </div>
        </div>

        {/* Tab Navigation Container */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* View Mode Tabs */}
          <div>
            <Tabs defaultValue="trip-wise" value={viewMode} onValueChange={setViewMode}>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="trip-wise">Trip wise</TabsTrigger>
                <TabsTrigger value="stop-wise">Stop wise</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Trip Status Tabs */}
          <div>
            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="active">{viewMode === "stop-wise" ? "Active Stops" : "Active Trips"}</TabsTrigger>
                <TabsTrigger value="upcoming">{viewMode === "stop-wise" ? "Upcoming Stops" : "Upcoming Trips"}</TabsTrigger>
                <TabsTrigger value="completed">{viewMode === "stop-wise" ? "Completed Stops" : "Completed Trips"}</TabsTrigger>
                {viewMode === "stop-wise" && (
                  <TabsTrigger value="cancelled">Cancelled Stops</TabsTrigger>
                )}
                <TabsTrigger value="all">{viewMode === "stop-wise" ? "All Stops" : "All Trips"}</TabsTrigger>
                {viewMode === "stop-wise" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2 relative">
                        <Filter className="h-4 w-4" />
                        {(!showPickupPoints || !showDropoffPoints) && (
                          <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                            {!showPickupPoints && !showDropoffPoints ? "!" : ""}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="p-2">
                        <h4 className="mb-2 text-sm font-medium">Stop Types</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="show-pickup"
                              checked={showPickupPoints}
                              onCheckedChange={(checked) => {
                                if (typeof checked === 'boolean') {
                                  setShowPickupPoints(checked);
                                }
                              }}
                            />
                            <Label htmlFor="show-pickup" className="text-sm font-normal">
                              Pickup Points
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="show-dropoff"
                              checked={showDropoffPoints}
                              onCheckedChange={(checked) => {
                                if (typeof checked === 'boolean') {
                                  setShowDropoffPoints(checked);
                                }
                              }}
                            />
                            <Label htmlFor="show-dropoff" className="text-sm font-normal">
                              Drop-off Points
                            </Label>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* View Content */}
        <Tabs defaultValue="trip-wise" value={viewMode} className="mt-4">
          {/* Trip Wise View */}
          <TabsContent value="trip-wise" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <RoutesList
                  routes={getRoutesForTab(activeTab)}
                  status={activeTab}
                  searchQuery={searchQuery}
                  dateRange={date}
                  onEditRoute={openEditRouteDialog}
                  onViewDetails={viewTripDetails}
                  onCopyRoute={openCopyRouteDialog}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stop Wise View */}
          <TabsContent value="stop-wise" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <StopWiseView
                  routes={getRoutesForTab(activeTab)}
                  status={activeTab}
                  searchQuery={searchQuery}
                  dateRange={date}
                  onViewTripDetails={viewTripDetails}
                  onEditRoute={openEditRouteDialog}
                  onCopyRoute={openCopyRouteDialog}
                  showPickupPoints={showPickupPoints}
                  showCheckpoints={showDropoffPoints}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showCreateRouteDialog} onOpenChange={setShowCreateRouteDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {routeToEdit ?
                  (routeToEdit.isCopy ? 'Copy Route' : 'Edit Route') :
                  'Create New Route'}
              </DialogTitle>
            </DialogHeader>
            <CreateRouteForm
              onCancel={() => setShowCreateRouteDialog(false)}
              initialData={routeToEdit}
            />
          </DialogContent>
        </Dialog>

        {/* Trip Details Modal */}
        {selectedTripId && (
          <TripDetailsModal
            open={showTripDetailsModal}
            onOpenChange={setShowTripDetailsModal}
            tripId={selectedTripId}
            onEditTrip={openEditRouteDialog}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default TripManagement;
