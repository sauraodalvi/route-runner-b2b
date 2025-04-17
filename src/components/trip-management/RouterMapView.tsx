import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { MapPin, Building, User, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface RouterMapViewProps {
  status: "active" | "upcoming" | "completed" | "all";
  searchQuery: string;
  dateRange?: DateRange;
}

// Mock data structure for trips with stops
const mockTrips = [
  {
    id: "route1",
    name: "Downtown Medical Collection",
    date: "2024-04-15",
    status: "active",
    stops: [
      { id: 1, name: "Central Hospital", address: "123 Main St, New York, NY 10001", lat: 40.7128, lng: -74.0060, inSystem: true, type: "pickup", organization: "Hospital Corp" },
      { id: 2, name: "City Lab", address: "456 Park Ave, New York, NY 10002", lat: 40.7282, lng: -73.9962, inSystem: true, type: "pickup", organization: "LabWorks Inc" },
      { id: 3, name: "Checkout Point", address: "789 Broadway, New York, NY 10003", lat: 40.7352, lng: -73.9911, inSystem: false, type: "checkout" }
    ]
  },
  {
    id: "route2",
    name: "Uptown Sample Collection",
    date: "2024-04-16",
    status: "upcoming",
    stops: [
      { id: 4, name: "North Medical Center", address: "321 5th Ave, New York, NY 10004", lat: 40.7489, lng: -73.9851, inSystem: true, type: "pickup", organization: "MedCenter Group" },
      { id: 5, name: "Research Lab", address: "654 Madison Ave, New York, NY 10005", lat: 40.7615, lng: -73.9732, inSystem: false, type: "pickup", organization: "BioResearch LLC" },
      { id: 6, name: "Final Checkpoint", address: "987 Lexington Ave, New York, NY 10006", lat: 40.7739, lng: -73.9652, inSystem: true, type: "checkout" }
    ]
  }
];

// Mock data for pickup partners
const mockPickupPartners = [
  { id: "p1", name: "Central Hospital", organization: "Hospital Corp", address: "123 Main St, New York, NY 10001", lat: 40.7128, lng: -74.0060, inSystem: true, activeRoutes: 2, upcomingRoutes: 1 },
  { id: "p2", name: "City Lab", organization: "LabWorks Inc", address: "456 Park Ave, New York, NY 10002", lat: 40.7282, lng: -73.9962, inSystem: true, activeRoutes: 1, upcomingRoutes: 2 },
  { id: "p3", name: "North Medical Center", organization: "MedCenter Group", address: "321 5th Ave, New York, NY 10004", lat: 40.7489, lng: -73.9851, inSystem: true, activeRoutes: 1, upcomingRoutes: 0 },
  { id: "p4", name: "Research Lab", organization: "BioResearch LLC", address: "654 Madison Ave, New York, NY 10005", lat: 40.7615, lng: -73.9732, inSystem: false, activeRoutes: 0, upcomingRoutes: 1 },
  { id: "p5", name: "Downtown Clinic", organization: "Health Services", address: "555 Water St, New York, NY 10007", lat: 40.7033, lng: -74.0170, inSystem: true, activeRoutes: 0, upcomingRoutes: 0 },
  { id: "p6", name: "Eastside Medical", organization: "Medical Associates", address: "222 E 42nd St, New York, NY 10017", lat: 40.7500, lng: -73.9700, inSystem: false, activeRoutes: 0, upcomingRoutes: 0 }
];

export function RouterMapView({ status, searchQuery, dateRange }: RouterMapViewProps) {
  const [trips, setTrips] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'trips' | 'partners'>('partners');
  const [filterOptions, setFilterOptions] = useState({
    showInSystem: true,
    showNotInSystem: true,
    showWithActiveRoutes: true,
    showWithNoRoutes: true
  });

  // Simulate fetching routes based on filters
  useEffect(() => {
    setLoading(true);

    // In a real app, this would fetch trips from the API based on filters
    setTimeout(() => {
      const filteredTrips = mockTrips.filter(trip => {
        if (status !== "all" && trip.status !== status) return false;
        if (searchQuery && !trip.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        // Additional date range filtering would happen here
        if (dateRange && dateRange.from && dateRange.to) {
          const tripDate = new Date(trip.date);
          const fromDate = new Date(dateRange.from);
          const toDate = new Date(dateRange.to);
          if (tripDate < fromDate || tripDate > toDate) return false;
        }
        return true;
      });

      // Filter partners based on search query and date range
      const filteredPartners = mockPickupPartners.filter(partner => {
        if (searchQuery &&
            !partner.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !partner.organization.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        // Apply filter options
        if (!filterOptions.showInSystem && partner.inSystem) return false;
        if (!filterOptions.showNotInSystem && !partner.inSystem) return false;
        if (!filterOptions.showWithActiveRoutes && partner.activeRoutes > 0) return false;
        if (!filterOptions.showWithNoRoutes && partner.activeRoutes === 0 && partner.upcomingRoutes === 0) return false;

        return true;
      });

      setTrips(filteredTrips);
      setPartners(filteredPartners);
      setLoading(false);
    }, 800);
  }, [status, searchQuery, dateRange, filterOptions]);

  // Simulate map loading
  useEffect(() => {
    // This would initialize the actual map in a real implementation
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleFilterOption = (option: keyof typeof filterOptions) => {
    setFilterOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  if (loading || !mapLoaded) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">{loading ? "Loading routes..." : "Initializing map..."}</p>
      </div>
    );
  }

  if (viewMode === 'trips' && trips.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No trips found</h3>
        <p className="text-muted-foreground max-w-md">
          No trips match your current filters. Try adjusting your search or date range.
        </p>
      </div>
    );
  }

  if (viewMode === 'partners' && partners.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center">
        <Building className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No pickup partners found</h3>
        <p className="text-muted-foreground max-w-md">
          No pickup partners match your current filters. Try adjusting your search or filter options.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {/* Controls for view mode and filters */}
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <div className="bg-white rounded-md shadow-sm">
          <div className="flex rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'partners' ? "default" : "outline"}
              className="rounded-none rounded-l-md py-1 h-8 text-xs"
              onClick={() => setViewMode('partners')}
            >
              <Building className="h-3 w-3 mr-1" />
              Partners
            </Button>
            <Button
              variant={viewMode === 'trips' ? "default" : "outline"}
              className="rounded-none rounded-r-md py-1 h-8 text-xs"
              onClick={() => setViewMode('trips')}
            >
              <MapPin className="h-3 w-3 mr-1" />
              Trips
            </Button>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="py-1 h-8 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuCheckboxItem
              checked={filterOptions.showInSystem}
              onCheckedChange={() => toggleFilterOption('showInSystem')}
            >
              In System Partners
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterOptions.showNotInSystem}
              onCheckedChange={() => toggleFilterOption('showNotInSystem')}
            >
              Not In System Partners
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterOptions.showWithActiveRoutes}
              onCheckedChange={() => toggleFilterOption('showWithActiveRoutes')}
            >
              With Active Trips
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterOptions.showWithNoRoutes}
              onCheckedChange={() => toggleFilterOption('showWithNoRoutes')}
            >
              With No Trips
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* This would be replaced with an actual map component in a real implementation */}
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-6xl p-4">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-base font-medium mb-1">{viewMode === 'partners' ? 'Pickup Partners Map' : 'Trips Map'}</h3>
            <p className="text-xs text-muted-foreground mb-2">
              {viewMode === 'partners'
                ? 'This map shows all your pickup partners. Click on a pin to see details.'
                : 'This map shows all trips based on your filters. Click on a trip to see details.'}
            </p>

            {/* Map placeholder */}
            <div className="bg-gray-200 h-[300px] rounded-md flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-50 opacity-30"></div>
              <div className="absolute inset-0">
                <div className="w-full h-full bg-blue-50">
                  {/* Simple grid pattern */}
                  <div className="w-full h-full" style={{
                    backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
                    backgroundSize: `40px 40px`
                  }}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100,100 Q400,50 700,100 T800,200 T700,300 T400,350 T100,300 T0,200 T100,100" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    <path d="M200,150 Q400,100 600,150 T700,200 T600,250 T400,300 T200,250 T100,200 T200,150" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Partner pins on the map - Fixed positioning */}
              {viewMode === 'partners' && partners.map((partner, index) => {
                // Calculate position based on index to ensure they're visible
                const row = Math.floor(index / 3);
                const col = index % 3;
                const left = 20 + (col * 30); // 20% + column * 30%
                const top = 20 + (row * 20);  // 20% + row * 20%

                return (
                  <div
                    key={partner.id}
                    className="absolute"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div
                      className={`h-8 w-8 rounded-full ${partner.inSystem ? 'bg-green-500' : 'bg-orange-500'}
                        text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform
                        ${partner.activeRoutes > 0 ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                      title={`${partner.name} (${partner.organization})`}
                    >
                      <Building className="h-4 w-4" />
                    </div>
                  </div>
                );
              })}

              {/* Trip pins on the map - Fixed positioning */}
              {viewMode === 'trips' && trips.flatMap((trip, tripIndex) =>
                trip.stops.map((stop: any, stopIndex: number) => {
                  // Calculate position based on indices to ensure they're visible
                  const totalIndex = tripIndex * 3 + stopIndex;
                  const row = Math.floor(totalIndex / 3);
                  const col = totalIndex % 3;
                  const left = 20 + (col * 30); // 20% + column * 30%
                  const top = 20 + (row * 20);  // 20% + row * 20%

                  return (
                    <div
                      key={`${trip.id}-${stop.id}`}
                      className="absolute"
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div
                        className={`h-8 w-8 rounded-full ${stop.type === 'pickup' ? (stop.inSystem ? 'bg-green-500' : 'bg-orange-500') : 'bg-blue-500'}
                          text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}
                        title={`${stop.name} (${trip.name})`}
                      >
                        {stop.type === 'pickup' ? <Building className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                      </div>
                    </div>
                  );
                })
              )}

              <div className="absolute bottom-2 right-2 bg-white p-2 rounded-md shadow-md text-[10px] border border-gray-200">
                <h4 className="font-medium text-xs mb-1 text-gray-700">Legend</h4>
                <div className="flex items-center mb-1">
                  <div className="h-4 w-4 rounded-full bg-green-500 mr-1 flex items-center justify-center">
                    <Building className="h-2 w-2 text-white" />
                  </div>
                  <span>In System</span>
                </div>
                <div className="flex items-center mb-1">
                  <div className="h-4 w-4 rounded-full bg-orange-500 mr-1 flex items-center justify-center">
                    <Building className="h-2 w-2 text-white" />
                  </div>
                  <span>Not In System</span>
                </div>
                {viewMode === 'trips' && (
                  <div className="flex items-center mb-1">
                    <div className="h-4 w-4 rounded-full bg-blue-500 mr-1 flex items-center justify-center">
                      <MapPin className="h-2 w-2 text-white" />
                    </div>
                    <span>Checkout</span>
                  </div>
                )}
                {viewMode === 'partners' && (
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-green-500 ring-1 ring-blue-500 ring-offset-1 mr-1 flex items-center justify-center">
                      <Building className="h-2 w-2 text-white" />
                    </div>
                    <span>Active Trips</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* List view below the map */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            {viewMode === 'partners' ? (
              partners.map(partner => (
                <div key={partner.id} className="bg-white p-2 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <div className={`h-6 w-6 rounded-full ${partner.inSystem ? 'bg-green-500' : 'bg-orange-500'}
                        text-white flex items-center justify-center
                        ${partner.activeRoutes > 0 ? 'ring-1 ring-blue-500 ring-offset-1' : ''}`}>
                        <Building className="h-3 w-3" />
                      </div>
                      <div>
                        <h4 className="font-medium text-xs">{partner.name}</h4>
                        <p className="text-xs text-muted-foreground">{partner.organization}</p>
                      </div>
                    </div>
                    <Badge
                      className={partner.inSystem ? "bg-green-500 text-[9px] px-1 py-0" : "bg-orange-500 text-[9px] px-1 py-0"}
                      variant="secondary"
                    >
                      {partner.inSystem ? "In System" : "Not In System"}
                    </Badge>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1 flex items-center truncate">
                    <MapPin className="h-2 w-2 mr-1 inline flex-shrink-0" />
                    <span className="truncate">{partner.address}</span>
                  </p>

                  <div className="flex mt-1 space-x-2">
                    <div className="bg-blue-50 px-1 py-0.5 rounded text-[9px] flex items-center">
                      <span className="font-medium mr-1">{partner.activeRoutes}</span> Active Trips
                    </div>
                    <div className="bg-gray-50 px-1 py-0.5 rounded text-[9px] flex items-center">
                      <span className="font-medium mr-1">{partner.upcomingRoutes}</span> Upcoming Trips
                    </div>
                  </div>
                </div>
              ))
            ) : (
              trips.map(trip => (
                <div key={trip.id} className="bg-white p-2 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-xs">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <MapPin className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="font-medium text-xs">{trip.name}</h4>
                      <p className="text-[9px] text-muted-foreground">Date: {trip.date}</p>
                    </div>
                  </div>

                  <div className="space-y-1 mt-1">
                    <h5 className="text-[10px] font-medium text-gray-700 mb-1">Pickup Stops</h5>
                    {trip.stops.filter((stop: any) => stop.type === 'pickup').map((stop: any, index: number) => (
                      <div key={stop.id} className="flex items-center p-1 bg-muted/40 rounded border border-gray-100">
                        <div className={`h-4 w-4 rounded-full ${stop.inSystem ? 'bg-green-500' : 'bg-orange-500'} text-white flex items-center justify-center text-[9px] mr-1`}>
                          <Building className="h-2 w-2" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-medium truncate">{stop.name}</div>
                          <div className="text-[9px] text-muted-foreground truncate">{stop.organization}</div>
                        </div>
                        <Badge
                          className={`ml-auto ${stop.inSystem ? "bg-green-500" : "bg-orange-500"} text-[8px] px-1 py-0 h-3 min-w-0`}
                          variant="secondary"
                        >
                          {stop.inSystem ? "In" : "Out"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
