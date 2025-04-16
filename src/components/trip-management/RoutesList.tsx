import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MoreHorizontal, Calendar, User, Eye, Edit, Trash2, Check, FileText, PaperclipIcon, ArrowUpDown } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RoutesListProps {
  status: "active" | "upcoming" | "completed" | "all";
  searchQuery?: string;
  dateRange?: DateRange;
  onEditRoute?: (route: any) => void;
  onViewDetails?: (routeId: string) => void;
}

// Enhanced mock data with more dummy records
const generateMockData = () => {
  const statuses = ["active", "upcoming", "completed"];
  const teams = ["Transport Team 1", "Transport Team 2", "Transport Team 3", "Transport Team 4"];
  const routes = ["Route 1", "Route 2", "Route 3", "Route 4", "Route 5", "Route 6", "Route 7"];
  
  const allRoutes = [];
  
  // Generate 20 dummy entries
  for (let i = 1; i <= 20; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomTeam = teams[Math.floor(Math.random() * teams.length)];
    const randomRoute = routes[Math.floor(Math.random() * routes.length)];
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30) - 15); // Between -15 and +15 days
    
    allRoutes.push({
      id: `TR-004-${1234 + i}`,
      routeNo: `${randomRoute}`,
      date: randomDate.toISOString().split('T')[0],
      timeStart: `${String(8 + Math.floor(Math.random() * 4)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} - ${String(10 + Math.floor(Math.random() * 3)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      timeEnd: `${String(12 + Math.floor(Math.random() * 3)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} - ${String(14 + Math.floor(Math.random() * 3)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      status: randomStatus,
      assignedTeam: randomTeam,
      stopCount: 3 + Math.floor(Math.random() * 5),
      samplesCollected: 4 + Math.floor(Math.random() * 10),
      pendingSamples: Math.floor(Math.random() * 4),
      rejectedSamples: Math.floor(Math.random() * 3),
      notes: `This is a sample note for route ${randomRoute}. Team ${randomTeam} is assigned to this trip.`,
      pickupPoints: ["Hospital A", "Clinic B", "Lab C"].slice(0, 1 + Math.floor(Math.random() * 2)),
      attachments: Math.random() > 0.5 ? ["route_map.pdf", "sample_details.xlsx"] : []
    });
  }
  
  return allRoutes;
};

export function RoutesList({ status, searchQuery = "", dateRange, onEditRoute, onViewDetails }: RoutesListProps) {
  // Use enhanced mock data
  const allRoutes = generateMockData();
  
  const [routes, setRoutes] = useState(allRoutes);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);
  const [showCancelOptions, setShowCancelOptions] = useState(false);
  const [routeToCancel, setRouteToCancel] = useState<string | null>(null);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [routeDetails, setRouteDetails] = useState<any | null>(null);
  const [showAttachment, setShowAttachment] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

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
    if (onViewDetails) {
      onViewDetails(routeId);
    } else {
      const routeToView = routes.find(route => route.id === routeId);
      if (routeToView) {
        setRouteDetails(routeToView);
        setShowViewDetails(true);
      }
    }
  };

  const handleEditRoute = (routeId: string) => {
    const routeToEdit = routes.find(route => route.id === routeId);
    if (routeToEdit && onEditRoute) {
      onEditRoute(routeToEdit);
    } else {
      toast({
        title: "Edit Route",
        description: `Editing route ${routeId}`,
      });
    }
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

  const handleCancelTrip = () => {
    if (routeToCancel) {
      setRoutes(routes.map(route => 
        route.id === routeToCancel ? { ...route, status: "completed", notes: route.notes + " (Cancelled)" } : route
      ));
      toast({
        title: "Trip Cancelled",
        description: `Trip ${routeToCancel} has been cancelled`,
      });
      setShowCancelOptions(false);
      setRouteToCancel(null);
    }
  };

  const handleCancelAllLinkedTrips = () => {
    if (routeToCancel) {
      const cancelledRouteNo = routes.find(route => route.id === routeToCancel)?.routeNo;
      if (cancelledRouteNo) {
        setRoutes(routes.map(route => 
          route.routeNo === cancelledRouteNo ? { ...route, status: "completed", notes: route.notes + " (Cancelled)" } : route
        ));
        toast({
          title: "All Linked Trips Cancelled",
          description: `All trips linked to ${cancelledRouteNo} have been cancelled`,
        });
      }
      setShowCancelOptions(false);
      setRouteToCancel(null);
    }
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

  const handleViewAttachment = (routeId: string, fileName: string) => {
    setSelectedAttachment(fileName);
    setShowAttachment(true);
    toast({
      title: "Viewing Attachment",
      description: `Opening ${fileName} from route ${routeId}`,
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
            <TableHead>Attachments</TableHead>
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
              <TableCell>
                {route.attachments && route.attachments.length > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center"
                    onClick={() => {
                      setSelectedAttachment(route.attachments[0]);
                      setShowAttachment(true);
                    }}
                  >
                    <PaperclipIcon className="h-4 w-4 mr-1" />
                    {route.attachments.length}
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
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
                      {route.attachments && route.attachments.length > 0 && (
                        <DropdownMenuItem disabled={route.attachments.length === 0}>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center w-full">
                              <PaperclipIcon className="h-4 w-4 mr-2" />
                              View Attachments ({route.attachments.length})
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {route.attachments.map((attachment: string, index: number) => (
                                <DropdownMenuItem key={index} onClick={() => handleViewAttachment(route.id, attachment)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  {attachment}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </DropdownMenuItem>
                      )}
                      {route.status !== "completed" && (
                        <DropdownMenuItem onClick={() => handleMarkCompleted(route.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                      {route.status !== "completed" && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setRouteToCancel(route.id);
                            setShowCancelOptions(true);
                          }}
                        >
                          Cancel Trip
                        </DropdownMenuItem>
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

      {/* View Details Dialog */}
      <Dialog open={showViewDetails} onOpenChange={setShowViewDetails}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
          </DialogHeader>
          {routeDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Trip ID</h3>
                  <p>{routeDetails.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Route</h3>
                  <p>{routeDetails.routeNo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p>{formatDateDisplay(routeDetails.date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge 
                    variant={getStatusBadgeVariant(routeDetails.status) as any} 
                    className={`
                      ${routeDetails.status === "active" ? "bg-green-100 text-green-800" : ""}
                      ${routeDetails.status === "upcoming" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${routeDetails.status === "completed" ? "bg-gray-100 text-gray-800" : ""}
                    `}
                  >
                    {getStatusDisplayName(routeDetails.status)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Time Start</h3>
                  <p>{routeDetails.timeStart}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Time End</h3>
                  <p>{routeDetails.timeEnd}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Assigned Team</h3>
                  <p>{routeDetails.assignedTeam}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Stop Count</h3>
                  <p>{routeDetails.stopCount}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Samples Collected</h3>
                  <p>{routeDetails.samplesCollected}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Samples Pending</h3>
                  <p>{routeDetails.pendingSamples}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Samples Rejected</h3>
                  <p>{routeDetails.rejectedSamples}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pickup Points</h3>
                <ul className="mt-2 list-disc pl-5">
                  {routeDetails.pickupPoints.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
              
              {routeDetails.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="mt-2 text-sm text-gray-600">{routeDetails.notes}</p>
                </div>
              )}
              
              {routeDetails.attachments && routeDetails.attachments.length >
0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Attachments</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {routeDetails.attachments.map((attachment: string, index: number) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewAttachment(routeDetails.id, attachment)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {attachment}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {routeDetails.status !== "completed" && (
                <div className="flex justify-between pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setRouteToCancel(routeDetails.id);
                      setShowCancelOptions(true);
                      setShowViewDetails(false);
                    }}
                  >
                    Cancel Trip
                  </Button>
                  <Button 
                    onClick={() => {
                      handleEditRoute(routeDetails.id);
                      setShowViewDetails(false);
                    }}
                  >
                    Edit Trip
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Attachment Viewer Dialog */}
      <Dialog open={showAttachment} onOpenChange={setShowAttachment}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attachment: {selectedAttachment}</DialogTitle>
          </DialogHeader>
          <div className="min-h-[60vh] flex items-center justify-center bg-gray-100 rounded-md">
            {selectedAttachment && selectedAttachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={`/placeholder.svg`} 
                  alt={selectedAttachment} 
                  className="max-w-full max-h-[50vh] object-contain" 
                />
              </div>
            ) : selectedAttachment && selectedAttachment.match(/\.(pdf)$/i) ? (
              <div className="text-center w-full">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">PDF Preview</p>
                <div className="mt-4 bg-white p-4 rounded border max-h-[50vh] overflow-y-auto mx-auto max-w-lg">
                  <div className="h-96 border-b mb-4 flex items-center justify-center bg-gray-50">
                    <p className="text-gray-400">Page 1</p>
                  </div>
                  <div className="h-96 mb-4 flex items-center justify-center bg-gray-50">
                    <p className="text-gray-400">Page 2</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Preview not available for {selectedAttachment}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => {
              toast({
                title: "Download Started",
                description: `Downloading ${selectedAttachment}`,
              });
              setShowAttachment(false);
            }}>
              Download File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Route</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this route? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoute} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Trip Options Dialog */}
      <AlertDialog open={showCancelOptions} onOpenChange={setShowCancelOptions}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to cancel only this trip or all linked trips in this route?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setShowCancelOptions(false)}>
              Back
            </AlertDialogCancel>
            <Button variant="outline" onClick={handleCancelTrip}>
              Cancel This Trip Only
            </Button>
            <Button onClick={handleCancelAllLinkedTrips} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel All Linked Trips
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
