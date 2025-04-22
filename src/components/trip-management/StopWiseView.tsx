import React, { useState, useMemo } from "react";
import { Route, Stop } from "@/types";
import { format, isWithinInterval, parseISO } from "date-fns";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { MapPin, Clock, Building, Phone, User, Eye, MoreHorizontal, Filter, Download, FileText, FileImage, CheckCircle, XCircle, AlertCircle } from "lucide-react";
// Removed accordion imports as we're using an always-expanded view

interface StopWiseViewProps {
  routes: Route[];
  status: string;
  searchQuery: string;
  dateRange?: DateRange;
  onViewTripDetails: (routeId: string) => void;
  onEditRoute?: (route: Route) => void;
  onCopyRoute?: (route: Route) => void;
  showPickupPoints: boolean;
  showCheckpoints: boolean;
}

export const StopWiseView = ({
  routes,
  status,
  searchQuery,
  dateRange,
  onViewTripDetails,
  onEditRoute,
  onCopyRoute,
  showPickupPoints,
  showCheckpoints,
}: StopWiseViewProps) => {
  // State for modals
  const [selectedStop, setSelectedStop] = useState<any>(null);
  const [showSamplesModal, setShowSamplesModal] = useState(false);
  const [showUnregisteredSamplesModal, setShowUnregisteredSamplesModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  // Notes are now displayed directly in the table

  // Handle viewing attachment
  const handleViewAttachment = (attachment: any) => {
    // In a real app, this would update the selected attachment
    toast({
      title: "Attachment Selected",
      description: `Viewing ${attachment.name}`,
    });
  };

  // Handle downloading attachment
  const handleDownloadAttachment = (attachmentId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading attachment...`,
    });
  };

  // Add sample data for modals
  const addSampleDataToStop = (stop: any) => {
    if (!stop) return stop;

    // Add sample registered samples
    if (stop.samplesRegistered && !stop.samples) {
      stop.samples = Array.from({ length: stop.samplesRegistered }, (_, i) => ({
        id: `S-${stop.id}-${i + 1}`,
        type: i % 2 === 0 ? 'Blood' : 'Urine',
        status: 'Registered'
      }));
    }

    // Add sample unregistered samples
    if (stop.samplesUnregistered && !stop.unregisteredSamples) {
      // Calculate quantities ensuring no zeros
      const bloodQty = Math.max(1, Math.ceil(stop.samplesUnregistered * 0.6));
      const urineQty = Math.max(1, stop.samplesUnregistered - bloodQty);

      // Only add sample types with quantity > 0
      stop.unregisteredSamples = [];

      if (bloodQty > 0) {
        stop.unregisteredSamples.push({ type: 'Blood', quantity: bloodQty });
      }

      if (urineQty > 0) {
        stop.unregisteredSamples.push({ type: 'Urine', quantity: urineQty });
      }

      // If we somehow ended up with no samples but should have some
      if (stop.unregisteredSamples.length === 0 && stop.samplesUnregistered > 0) {
        stop.unregisteredSamples.push({ type: 'Blood', quantity: stop.samplesUnregistered });
      }
    }

    // Add sample attachments
    if (stop.attachments && !Array.isArray(stop.attachments)) {
      stop.attachments = [
        { id: `att-${stop.id}-1`, name: 'Lab Report.pdf', type: 'pdf', size: '1.2 MB', date: new Date().toISOString() },
        { id: `att-${stop.id}-2`, name: 'Sample Image.jpg', type: 'image', size: '3.4 MB', date: new Date().toISOString() },
        { id: `att-${stop.id}-3`, name: 'Test Results.xlsx', type: 'xlsx', size: '0.8 MB', date: new Date().toISOString() }
      ];
    }

    // Add sample notes if not present
    if (!stop.notes) {
      // Generate different notes based on stop type and ID to have variety
      if (stop.type === 'pickup') {
        const noteOptions = [
          "Regular pickup location. Staff is familiar with the collection process.",
          "High-priority samples. Ensure proper temperature control during transport.",
          "Contact person may be on break during scheduled pickup time. Call ahead.",
          "Facility has restricted access. Check in at security desk upon arrival.",
          "Multiple departments may have samples ready. Check with reception."
        ];
        stop.notes = noteOptions[stop.id % noteOptions.length];
      } else {
        const noteOptions = [
          "Verification at drop-off point. Ensure all documentation is complete.",
          "Temperature check required for all samples at this location.",
          "Brief stop for sample integrity verification only.",
          "Log all samples in the digital system at this drop-off point.",
          "Quality control at drop-off point. Random samples may be selected for testing."
        ];
        stop.notes = noteOptions[stop.id % noteOptions.length];
      }
    }

    return stop;
  };
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  // Group stops by date
  const stopsByDate = useMemo(() => {
    const result: Record<string, { date: string; stops: Array<Stop & { routeId: string; routeName: string; status: string }> }> = {};

    // Filter routes based on search query, status, and date range
    const filteredRoutes = routes.filter((route) => {
      // Search functionality - case insensitive search for route name or trip ID
      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
        // First try exact match for trip ID (case insensitive)
        if (route.tripId && route.tripId.toLowerCase() === searchQuery.toLowerCase()) {
          return true;
        }

        // Then try partial matches with individual terms
        const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
        matchesSearch = searchTerms.some(term => {
          return (
            (route.tripId && route.tripId.toLowerCase().includes(term)) ||
            (route.name && route.name.toLowerCase().includes(term))
          );
        });
      }

      // Date range filtering
      let matchesDateRange = true;
      if (dateRange?.from && dateRange?.to) {
        const routeDate = parseISO(route.date);
        matchesDateRange = isWithinInterval(routeDate, {
          start: dateRange.from,
          end: dateRange.to,
        });
      }

      return matchesSearch && matchesDateRange;
    });

    // Group stops by date
    filteredRoutes.forEach((route) => {
      if (!route.stops || route.stops.length === 0) return;

      const dateKey = route.date;
      if (!result[dateKey]) {
        result[dateKey] = {
          date: dateKey,
          stops: [],
        };
      }

      // Add route information to each stop
      route.stops.forEach((stop) => {
        // Apply stop type filters
        if (
          (stop.type === "pickup" && !showPickupPoints) ||
          (stop.type === "checkpoint" && !showCheckpoints)
        ) {
          return; // Skip this stop if it doesn't match the filter
        }

        // For cancelled tab, only show stops with cancelled status
        if (status === "cancelled" && stop.status !== "cancelled") {
          return; // Skip non-cancelled stops when on cancelled tab
        }

        // For other status tabs, filter accordingly
        if (status !== "all" && status !== "cancelled") {
          if (status === "active" && stop.status !== "in-progress") {
            return; // Skip non-active stops when on active tab
          }
          if (status === "upcoming" && (stop.status !== "pending" && stop.status !== "upcoming")) {
            return; // Skip non-upcoming stops when on upcoming tab
          }
          if (status === "completed" && stop.status !== "completed") {
            return; // Skip non-completed stops when on completed tab
          }
        }

        result[dateKey].stops.push({
          ...stop,
          routeId: route.id,
          routeName: route.name,
          tripId: route.tripId,
          routeStatus: route.status, // Keep the route status separately
          // Add reference to the full route object for editing
          route: route,
        });
      });
    });

    // Sort dates in descending order (newest first)
    return Object.values(result).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [routes, searchQuery, dateRange, status, showPickupPoints, showCheckpoints]);

  const toggleDateExpansion = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  if (stopsByDate.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No stops found for the selected criteria.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Trip ID</TableHead>
              <TableHead>Stop Name</TableHead>
              <TableHead>Stop Type</TableHead>
              <TableHead>Time Reached</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Team</TableHead>
              <TableHead>Registered Samples</TableHead>
              <TableHead>Unregistered Samples</TableHead>
              <TableHead>Attachments</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {stopsByDate.length > 0 ? (
            stopsByDate.map((dateGroup) => (
              <React.Fragment key={dateGroup.date}>
                {/* Date Header Row */}
                <TableRow className="bg-gray-50/50">
                  <TableCell colSpan={11} className="py-2">
                    <div className="font-medium text-gray-700">
                      {format(new Date(dateGroup.date), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                </TableRow>
                {/* Stops for this date */}
                {dateGroup.stops.map((stop, index) => (
                  <TableRow
                    key={`${stop.routeId}-${stop.id}`}
                    className="hover:bg-gray-50/50"
                  >
                    <TableCell>{stop.tripId}</TableCell>
                    <TableCell className="font-medium">
                      {stop.name}
                    </TableCell>
                    <TableCell>
                      {stop.type && (
                        <Badge variant={stop.type === "pickup" ? "default" : "secondary"}>
                          {stop.type === "pickup" ? "Pickup" : "Drop-off Point"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {stop.time && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-sm">{stop.time}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {stop.status === "completed" && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" /> Completed
                        </Badge>
                      )}
                      {stop.status === "in-progress" && (
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                          <Clock className="h-3 w-3 mr-1" /> Active
                        </Badge>
                      )}
                      {stop.status === "pending" && (
                        <Badge className="bg-purple-500 hover:bg-purple-600">
                          <AlertCircle className="h-3 w-3 mr-1" /> Pending
                        </Badge>
                      )}
                      {(stop.status === "upcoming" || !stop.status) && (
                        <Badge className="bg-amber-500 hover:bg-amber-600">
                          <AlertCircle className="h-3 w-3 mr-1" /> Upcoming
                        </Badge>
                      )}
                      {stop.status === "cancelled" && (
                        <Badge className="bg-red-500 hover:bg-red-600">
                          <XCircle className="h-3 w-3 mr-1" /> Cancelled
                        </Badge>
                      )}
                      {stop.status === "active" && (
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                          <Clock className="h-3 w-3 mr-1" /> Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{stop.route.assignedTeam}</TableCell>
                    <TableCell>
                      {stop.samplesRegistered ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-primary hover:underline flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStop(addSampleDataToStop({...stop}));
                            setShowSamplesModal(true);
                          }}
                        >
                          <span>{stop.samplesRegistered} samples</span>
                          <Eye className="h-3.5 w-3.5 text-primary" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {stop.samplesUnregistered && stop.samplesUnregistered > 0 ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStop(addSampleDataToStop({...stop}));
                            setShowUnregisteredSamplesModal(true);
                          }}
                        >
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <span>{stop.samplesUnregistered} unregistered</span>
                            <Eye className="h-3.5 w-3.5" />
                          </Badge>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {stop.attachments ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-primary hover:underline flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStop(addSampleDataToStop({...stop}));
                            setShowAttachmentsModal(true);
                          }}
                        >
                          <span>View</span>
                          <FileImage className="h-3.5 w-3.5 text-primary" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {stop.notes ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="max-w-[200px] truncate text-sm h-5 cursor-default overflow-hidden">
                                {stop.notes}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm p-2 bg-white border shadow-lg rounded-md">
                              <div className="text-sm">
                                <p className="text-muted-foreground">{stop.notes}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-muted-foreground text-sm h-5">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onViewTripDetails(stop.routeId);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          {onEditRoute && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onEditRoute(stop.route);
                            }}>
                              Edit Route
                            </DropdownMenuItem>
                          )}
                          {onCopyRoute && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onCopyRoute(stop.route);
                            }}>
                              Copy Route
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-6 text-muted-foreground">
                No stops found for the selected criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>

      {/* Registered Samples Modal */}
      <Dialog open={showSamplesModal} onOpenChange={setShowSamplesModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registered Samples</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedStop?.name} • {selectedStop?.samplesRegistered} samples
            </p>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample ID</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedStop?.samples?.map((sample: any) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.id}</TableCell>
                    <TableCell>{sample.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* No footer with close button */}
        </DialogContent>
      </Dialog>

      {/* Unregistered Samples Modal */}
      <Dialog open={showUnregisteredSamplesModal} onOpenChange={setShowUnregisteredSamplesModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Unregistered Samples</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedStop?.name} • {selectedStop?.samplesUnregistered} samples
            </p>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedStop?.unregisteredSamples
                  ?.filter((sample: any) => sample.quantity > 0)
                  .map((sample: any, index: number) => (
                    <TableRow key={`unregistered-${index}`}>
                      <TableCell className="font-medium">{sample.type}</TableCell>
                      <TableCell className="text-right">{sample.quantity}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {/* No footer with close button */}
        </DialogContent>
      </Dialog>

      {/* Notes Modal removed - notes are now displayed directly in the table */}

      {/* Attachments Modal */}
      <Dialog open={showAttachmentsModal} onOpenChange={setShowAttachmentsModal}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[80vh] p-0 overflow-hidden">
          <div className="flex h-[80vh]">
            {/* Left sidebar with attachment list */}
            <div className="w-64 border-r bg-gray-50 overflow-y-auto">
              <div className="p-4 border-b bg-white sticky top-0 z-10">
                <h3 className="font-medium">Attachments</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedStop?.attachments?.length || 0} items
                </p>
              </div>
              <div className="divide-y">
                {selectedStop?.attachments?.map((attachment: any, index: number) => (
                  <div
                    key={attachment.id}
                    className={`p-3 cursor-pointer hover:bg-gray-100 ${index === 0 ? 'bg-gray-100' : ''}`}
                    onClick={() => handleViewAttachment(attachment)}
                  >
                    <div className="flex items-center space-x-2">
                      {attachment.type === "pdf" && <FileText className="h-5 w-5 text-red-500" />}
                      {attachment.type === "xlsx" && <FileText className="h-5 w-5 text-green-500" />}
                      {attachment.type === "image" && <FileImage className="h-5 w-5 text-blue-500" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{attachment.name}</p>
                        <Badge variant="outline" className="mt-1 text-xs">{attachment.type.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-lg font-semibold">{selectedStop?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedStop?.attachments?.[0]?.name} • {selectedStop?.attachments?.[0]?.type.toUpperCase()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadAttachment(selectedStop?.attachments?.[0]?.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAttachmentsModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* Preview area */}
              <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-gray-50">
                {selectedStop?.attachments?.[0]?.type === "image" ? (
                  <div className="max-h-full max-w-full overflow-hidden rounded-md shadow-lg">
                    <img
                      src={`/images/sample-image.jpg`}
                      alt={selectedStop?.attachments?.[0]?.name}
                      className="max-h-[60vh] max-w-full object-contain"
                    />
                  </div>
                ) : selectedStop?.attachments?.[0]?.type === "pdf" ? (
                  <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-3xl">
                    <div className="flex items-center justify-center h-[50vh] border-2 border-dashed border-gray-300 rounded-md">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">{selectedStop?.attachments?.[0]?.name}</h3>
                        <p className="text-muted-foreground mb-4">PDF Preview not available</p>
                        <Button
                          variant="outline"
                          onClick={() => handleDownloadAttachment(selectedStop?.attachments?.[0]?.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download to View
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-3xl">
                    <div className="flex items-center justify-center h-[50vh] border-2 border-dashed border-gray-300 rounded-md">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">{selectedStop?.attachments?.[0]?.name}</h3>
                        <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
                        <Button
                          variant="outline"
                          onClick={() => handleDownloadAttachment(selectedStop?.attachments?.[0]?.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download to View
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
