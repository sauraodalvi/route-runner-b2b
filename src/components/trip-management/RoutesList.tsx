
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MoreHorizontal, Calendar, User, Eye, Edit, Trash2, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RoutesListProps {
  status: "active" | "upcoming" | "completed" | "all";
  searchQuery?: string;
  dateRange?: DateRange;
}

export function RoutesList({ status, searchQuery = "", dateRange }: RoutesListProps) {
  // Mock data
  const allRoutes = [
    {
      id: "TR-004-1234-12",
      routeNo: "Route 2",
      date: "2025-04-17",
      timeStart: "09:10 - 11:30",
      timeEnd: "11:15 - 01:30",
      status: "active",
      assignedTeam: "Transport Team 1",
      stopCount: 5,
      samplesCollected: 10,
      pendingSamples: 3,
      rejectedSamples: 1,
    },
    {
      id: "TR-004-1234-13",
      routeNo: "Route 3",
      date: "2025-04-18",
      timeStart: "10:15 - 12:45",
      timeEnd: "12:30 - 02:45",
      status: "upcoming",
      assignedTeam: "Transport Team 2",
      stopCount: 4,
      samplesCollected: 8,
      pendingSamples: 0,
      rejectedSamples: 0,
    },
    {
      id: "TR-004-1234-14",
      routeNo: "Route 4",
      date: "2025-04-15",
      timeStart: "11:25 - 01:55",
      timeEnd: "13:40 - 03:10",
      status: "completed",
      assignedTeam: "Transport Team 1",
      stopCount: 6,
      samplesCollected: 12,
      pendingSamples: 0,
      rejectedSamples: 2,
    },
    {
      id: "TR-004-1234-15",
      routeNo: "Route 5",
      date: "2025-04-21",
      timeStart: "13:30 - 03:45",
      timeEnd: "15:45 - 05:30",
      status: "active",
      assignedTeam: "Transport Team 3",
      stopCount: 3,
      samplesCollected: 6,
      pendingSamples: 2,
      rejectedSamples: 0,
    },
  ];

  const [routes, setRoutes] = useState(allRoutes);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);

  // Filter based on status, search query, and date range
  useEffect(() => {
    let filteredRoutes = allRoutes;
    
    // Filter by status
    if (status !== "all") {
      filteredRoutes = filteredRoutes.filter(route => route.status === status);
    }
    
    // Filter by search query
    if (searchQuery) {
      filteredRoutes = filteredRoutes.filter(route => 
        route.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.routeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.assignedTeam.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by date range
    if (dateRange?.from && dateRange?.to) {
      filteredRoutes = filteredRoutes.filter(route => {
        const routeDate = parseISO(route.date);
        return isWithinInterval(routeDate, {
          start: dateRange.from,
          end: dateRange.to,
        });
      });
    }
    
    setRoutes(filteredRoutes);
  }, [status, searchQuery, dateRange]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "upcoming":
        return "warning";
      case "completed":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleViewRoute = (routeId: string) => {
    toast({
      title: "View Route",
      description: `Viewing details for route ${routeId}`,
    });
  };

  const handleEditRoute = (routeId: string) => {
    toast({
      title: "Edit Route",
      description: `Editing route ${routeId}`,
    });
  };

  const confirmDeleteRoute = (routeId: string) => {
    setRouteToDelete(routeId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteRoute = () => {
    if (routeToDelete) {
      setRoutes(routes.filter(route => route.id !== routeToDelete));
      toast({
        title: "Route Deleted",
        description: `Route ${routeToDelete} has been deleted`,
      });
      setShowDeleteConfirm(false);
      setRouteToDelete(null);
    }
  };

  const handleChangeTeam = (routeId: string) => {
    toast({
      title: "Change Team",
      description: `Changing team for route ${routeId}`,
    });
  };

  const handleCancelTrip = (routeId: string) => {
    toast({
      title: "Trip Cancelled",
      description: `Trip ${routeId} has been cancelled`,
    });
    // In a real app, we would update the status of the route
  };

  const handleMarkCompleted = (routeId: string) => {
    setRoutes(routes.map(route => 
      route.id === routeId ? { ...route, status: "completed" } : route
    ));
    toast({
      title: "Trip Completed",
      description: `Trip ${routeId} has been marked as completed`,
    });
  };

  if (routes.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No {status} routes found.</p>
      </div>
    );
  }

  const formatDateDisplay = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric', 
        month: 'short', 
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString; // Return the original string if parsing fails
    }
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Trip ID</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time Start</TableHead>
            <TableHead>Time End</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Team</TableHead>
            <TableHead>Stop Count</TableHead>
            <TableHead>Samples Collected</TableHead>
            <TableHead>Pending Samples</TableHead>
            <TableHead>Rejected Samples</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.id} className="hover:bg-gray-50/50">
              <TableCell className="font-medium">{route.id}</TableCell>
              <TableCell>{route.routeNo}</TableCell>
              <TableCell>{formatDateDisplay(route.date)}</TableCell>
              <TableCell>{route.timeStart}</TableCell>
              <TableCell>{route.timeEnd}</TableCell>
              <TableCell>
                <Badge 
                  variant={getStatusBadgeVariant(route.status) as any} 
                  className={`
                    ${route.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                    ${route.status === "upcoming" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : ""}
                    ${route.status === "completed" ? "bg-gray-100 text-gray-800 hover:bg-gray-200" : ""}
                  `}
                >
                  {getStatusDisplayName(route.status)}
                </Badge>
              </TableCell>
              <TableCell>{route.assignedTeam}</TableCell>
              <TableCell className="text-center">{route.stopCount}</TableCell>
              <TableCell className="text-center">{route.samplesCollected}</TableCell>
              <TableCell className="text-center">{route.pendingSamples}</TableCell>
              <TableCell className="text-center">{route.rejectedSamples}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleViewRoute(route.id)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditRoute(route.id)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewRoute(route.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditRoute(route.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Trip
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangeTeam(route.id)}>
                        <User className="h-4 w-4 mr-2" />
                        Change Team
                      </DropdownMenuItem>
                      {route.status !== "completed" && (
                        <>
                          <DropdownMenuItem onClick={() => handleMarkCompleted(route.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleCancelTrip(route.id)}
                          >
                            Cancel Trip
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => confirmDeleteRoute(route.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Route
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Route</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this route? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRoute}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
