import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface RouterMapViewProps {
  status: "active" | "upcoming" | "completed" | "all";
  searchQuery: string;
  dateRange?: DateRange;
}

// Mock data structure for routes with stops
const mockRoutes = [
  {
    id: "route1",
    name: "Downtown Medical Collection",
    date: "2024-04-15",
    status: "active",
    stops: [
      { id: 1, name: "Central Hospital", address: "123 Main St, New York, NY 10001", lat: 40.7128, lng: -74.0060, inSystem: true },
      { id: 2, name: "City Lab", address: "456 Park Ave, New York, NY 10002", lat: 40.7282, lng: -73.9962, inSystem: true },
      { id: 3, name: "Checkout Point", address: "789 Broadway, New York, NY 10003", lat: 40.7352, lng: -73.9911, inSystem: false }
    ]
  },
  {
    id: "route2",
    name: "Uptown Sample Collection",
    date: "2024-04-16",
    status: "upcoming",
    stops: [
      { id: 4, name: "North Medical Center", address: "321 5th Ave, New York, NY 10004", lat: 40.7489, lng: -73.9851, inSystem: true },
      { id: 5, name: "Research Lab", address: "654 Madison Ave, New York, NY 10005", lat: 40.7615, lng: -73.9732, inSystem: false },
      { id: 6, name: "Final Checkpoint", address: "987 Lexington Ave, New York, NY 10006", lat: 40.7739, lng: -73.9652, inSystem: true }
    ]
  }
];

export function RouterMapView({ status, searchQuery, dateRange }: RouterMapViewProps) {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Simulate fetching routes based on filters
  useEffect(() => {
    setLoading(true);
    
    // In a real app, this would fetch routes from the API based on filters
    setTimeout(() => {
      const filteredRoutes = mockRoutes.filter(route => {
        if (status !== "all" && route.status !== status) return false;
        if (searchQuery && !route.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        // Additional date range filtering would happen here
        return true;
      });
      
      setRoutes(filteredRoutes);
      setLoading(false);
    }, 800);
  }, [status, searchQuery, dateRange]);

  // Simulate map loading
  useEffect(() => {
    // This would initialize the actual map in a real implementation
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const optimizeRoute = () => {
    toast({
      title: "Route Optimization",
      description: "Reordering stops based on shortest distance...",
    });
    
    // Simulate optimization delay
    setTimeout(() => {
      toast({
        title: "Optimization Complete",
        description: "Your route has been optimized for efficient travel.",
      });
    }, 2000);
  };

  if (loading || !mapLoaded) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">{loading ? "Loading routes..." : "Initializing map..."}</p>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No routes found</h3>
        <p className="text-muted-foreground max-w-md">
          No routes match your current filters. Try adjusting your search or date range.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {/* This would be replaced with an actual map component in a real implementation */}
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-6">Map View (Placeholder)</h3>
          <p className="text-muted-foreground mb-8">
            In a real implementation, this would show a Google Maps view with pins for each stop
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {routes.map(route => (
              <div key={route.id} className="bg-white p-4 rounded-md shadow-sm">
                <h4 className="font-medium mb-2">{route.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">Date: {route.date}</p>
                
                <div className="space-y-2">
                  {route.stops.map((stop: any, index: number) => (
                    <div key={stop.id} className="flex items-center p-2 bg-muted/40 rounded">
                      <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{stop.name}</div>
                        <div className="text-xs text-muted-foreground">{stop.address}</div>
                      </div>
                      <Badge 
                        className={`ml-auto ${stop.inSystem ? "bg-green-500" : "bg-orange-500"}`}
                        variant="secondary"
                      >
                        {stop.inSystem ? "In System" : "Not in System"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Note when no stops are added */}
      {routes.every(route => route.stops.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center max-w-md p-6">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Stops Added</h3>
            <p className="text-muted-foreground">
              Add stops to see them plotted on the map. Click pins to edit stop details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
