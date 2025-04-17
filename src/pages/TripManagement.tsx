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
      },
      {
        id: 6,
        name: "Checkpoint Beta",
        address: "303 Midtown Blvd, New York, NY 10006",
        type: "checkpoint",
        time: "12:45 PM",
        status: "on-time",
        notes: "Final verification point"
      }
    ]
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
    attachments: "1 file",
    stops: [
      {
        id: 1,
        name: "Uptown Medical Lab",
        address: "987 North St, New York, NY 10025",
        type: "pickup",
        time: "09:30 AM",
        status: "on-time",
        samplesCollected: 10,
        samplesRegistered: 9,
        samplesUnregistered: 1,
        contactName: "Lab Director Smith",
        contactPhone: "555-444-3333",
        organization: "3",
        inSystem: true
      },
      {
        id: 2,
        name: "University Hospital",
        address: "222 College Ave, New York, NY 10027",
        type: "pickup",
        time: "11:00 AM",
        status: "on-time",
        samplesCollected: 8,
        samplesRegistered: 7,
        samplesUnregistered: 1,
        contactName: "Dr. Thompson",
        contactPhone: "555-222-1111",
        organization: "4",
        inSystem: false,
        notes: "New client, first pickup"
      },
      {
        id: 3,
        name: "Northside Clinic",
        address: "333 North End, New York, NY 10028",
        type: "pickup",
        time: "12:30 PM",
        status: "on-time",
        samplesCollected: 6,
        samplesRegistered: 6,
        samplesUnregistered: 0,
        contactName: "Clinic Director",
        contactPhone: "555-666-7777",
        organization: "2",
        inSystem: true
      },
      {
        id: 4,
        name: "Checkpoint Gamma",
        address: "444 Uptown Ave, New York, NY 10029",
        type: "checkpoint",
        time: "01:15 PM",
        status: "on-time",
        notes: "Mid-route verification"
      }
    ]
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
    attachments: "4 files",
    stops: [
      {
        id: 1,
        name: "General Hospital",
        address: "333 Health St, New York, NY 10012",
        type: "pickup",
        time: "08:00 AM",
        status: "on-time",
        samplesCollected: 12,
        samplesRegistered: 12,
        samplesUnregistered: 0,
        contactName: "Hospital Administrator",
        contactPhone: "555-888-7777",
        organization: "1",
        inSystem: true
      },
      {
        id: 2,
        name: "Checkpoint Beta",
        address: "444 Safety Rd, New York, NY 10013",
        type: "checkpoint",
        time: "09:45 AM",
        status: "on-time"
      },
      {
        id: 3,
        name: "Eastside Clinic",
        address: "555 East St, New York, NY 10014",
        type: "pickup",
        time: "11:30 AM",
        status: "delayed",
        samplesCollected: 8,
        samplesRegistered: 8,
        samplesUnregistered: 0,
        contactName: "Clinic Manager",
        contactPhone: "555-333-2222",
        organization: "2",
        inSystem: true,
        notes: "Delayed due to clinic procedures"
      },
      {
        id: 4,
        name: "Riverside Medical",
        address: "666 West St, New York, NY 10015",
        type: "pickup",
        time: "01:30 PM",
        status: "on-time",
        samplesCollected: 5,
        samplesRegistered: 5,
        samplesUnregistered: 0,
        contactName: "Dr. Rodriguez",
        contactPhone: "555-111-0000",
        organization: "3",
        inSystem: true
      }
    ]
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
