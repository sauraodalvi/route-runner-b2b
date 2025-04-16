
import React, { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Download, Calendar as CalendarIcon, Filter, Map, LayoutGrid } from "lucide-react";
import { CreateRouteForm } from "@/components/trip-management/CreateRouteForm";
import { RoutesList } from "@/components/trip-management/RoutesList";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { RouterMapView } from "@/components/trip-management/RouterMapView";
import { Route } from "@/types";

// Mock data for routes
const mockRoutes: Route[] = [
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
    attachments: "2 files"
  },
  {
    id: "2",
    tripId: "TR-002-5678",
    name: "Uptown Labs Pickup",
    date: "2025-04-19",
    startTime: "09:15 AM",
    endTime: "02:45 PM",
    status: "upcoming",
    assignedTeam: "Team Beta",
    stopCount: 8,
    samplesCollected: 18,
    unregisteredSamples: 2,
    attachments: "1 file"
  },
  {
    id: "3",
    tripId: "TR-003-9012",
    name: "Hospital Circuit",
    date: "2025-04-15",
    startTime: "07:30 AM",
    endTime: "03:15 PM",
    status: "completed",
    assignedTeam: "Team Gamma",
    stopCount: 12,
    samplesCollected: 25,
    unregisteredSamples: 0,
    attachments: "4 files"
  }
];

const TripManagement = () => {
  const navigate = useNavigate();
  const [showCreateRouteDialog, setShowCreateRouteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<any | null>(null);
  const [showMapView, setShowMapView] = useState(false);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  
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
      description: `Your data is being exported to Excel as routes-${currentDate}.xlsx`,
    });
    
    setTimeout(() => {
      toast({
        title: "Export Completed",
        description: "Your data has been exported successfully",
      });
    }, 2000);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      toast({
        title: "Date Range Applied",
        description: `Showing trips from ${format(range.from, "PPP")} to ${format(range.to, "PPP")}`,
      });
    }
  };

  const openEditRouteDialog = (route: any) => {
    setRouteToEdit(route);
    setShowCreateRouteDialog(true);
  };

  const viewTripDetails = (routeId: string) => {
    navigate(`/trip-management/details/${routeId}`);
  };

  const toggleView = () => {
    setShowMapView(!showMapView);
  };

  // Filter routes based on active tab
  const getRoutesForTab = (tabStatus: string) => {
    if (tabStatus === 'all') {
      return routes;
    }
    return routes.filter(route => route.status === tabStatus);
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
                        {format(date.from, "LLL d")} - {format(date.to, "LLL d")}
                      </>
                    ) : (
                      format(date.from, "LLL d")
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
            
            <Button variant="outline" size="sm" onClick={toggleView}>
              {showMapView ? (
                <>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  List View
                </>
              ) : (
                <>
                  <Map className="mr-2 h-4 w-4" />
                  Map View
                </>
              )}
            </Button>
            
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

        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active Trips</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
            <TabsTrigger value="completed">Completed Trips</TabsTrigger>
            <TabsTrigger value="all">All Routes</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="pt-4">
            <Card>
              <CardContent className="p-0">
                {showMapView ? (
                  <div className="h-[600px] relative">
                    <RouterMapView status="active" searchQuery={searchQuery} dateRange={date} />
                  </div>
                ) : (
                  <RoutesList 
                    routes={getRoutesForTab('active')}
                    status="active" 
                    searchQuery={searchQuery} 
                    dateRange={date} 
                    onEditRoute={openEditRouteDialog}
                    onViewDetails={viewTripDetails}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upcoming" className="pt-4">
            <Card>
              <CardContent className="p-0">
                {showMapView ? (
                  <div className="h-[600px] relative">
                    <RouterMapView status="upcoming" searchQuery={searchQuery} dateRange={date} />
                  </div>
                ) : (
                  <RoutesList 
                    routes={getRoutesForTab('upcoming')}
                    status="upcoming" 
                    searchQuery={searchQuery} 
                    dateRange={date} 
                    onEditRoute={openEditRouteDialog}
                    onViewDetails={viewTripDetails}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed" className="pt-4">
            <Card>
              <CardContent className="p-0">
                {showMapView ? (
                  <div className="h-[600px] relative">
                    <RouterMapView status="completed" searchQuery={searchQuery} dateRange={date} />
                  </div>
                ) : (
                  <RoutesList 
                    routes={getRoutesForTab('completed')}
                    status="completed" 
                    searchQuery={searchQuery} 
                    dateRange={date} 
                    onEditRoute={openEditRouteDialog}
                    onViewDetails={viewTripDetails}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="all" className="pt-4">
            <Card>
              <CardContent className="p-0">
                {showMapView ? (
                  <div className="h-[600px] relative">
                    <RouterMapView status="all" searchQuery={searchQuery} dateRange={date} />
                  </div>
                ) : (
                  <RoutesList 
                    routes={getRoutesForTab('all')}
                    status="all" 
                    searchQuery={searchQuery} 
                    dateRange={date} 
                    onEditRoute={openEditRouteDialog}
                    onViewDetails={viewTripDetails}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showCreateRouteDialog} onOpenChange={setShowCreateRouteDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{routeToEdit ? 'Edit Route' : 'Create New Route'}</DialogTitle>
            </DialogHeader>
            <CreateRouteForm 
              onCancel={() => setShowCreateRouteDialog(false)} 
              initialData={routeToEdit}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default TripManagement;
