
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Route, Stop } from "@/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronDown, ChevronUp, FileText, FileImage, Download, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { StopsAccordion } from "./StopsAccordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface RoutesListProps {
  routes: Route[];
  status: string;
  searchQuery: string;
  dateRange: { from?: Date; to?: Date } | undefined;
  onEditRoute: (route: any) => void;
  onViewDetails: (routeId: string) => void;
  onCopyRoute?: (route: any) => void;
}

export const RoutesList = ({
  routes = [], // Provide default empty array to prevent undefined errors
  status,
  searchQuery,
  dateRange,
  onEditRoute,
  onViewDetails,
  onCopyRoute,
}: RoutesListProps) => {
  // No longer tracking expanded rows as we're removing the accordion
  // Track attachments modal
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [allAttachments, setAllAttachments] = useState<any[]>([]);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);

  // Check if routes is undefined or null and default to empty array
  const routesToFilter = routes || [];

  const filteredRoutes = routesToFilter.filter((route) => {
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
    const routeDate = new Date(route.date);
    const startDate = dateRange?.from;
    const endDate = dateRange?.to;

    const matchesDateRange =
      (!startDate || routeDate >= startDate) &&
      (!endDate || routeDate <= endDate);

    return matchesSearch && matchesDateRange;
  });

  // Group routes by date
  const routesByDate: Record<string, Route[]> = {};

  filteredRoutes.forEach(route => {
    const dateStr = format(new Date(route.date), 'yyyy-MM-dd');
    if (!routesByDate[dateStr]) {
      routesByDate[dateStr] = [];
    }
    routesByDate[dateStr].push(route);
  });

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(routesByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // View details directly instead of expanding rows
  const viewDetails = (routeId: string) => {
    onViewDetails(routeId);
  };

  const openAttachmentsModal = (route: Route, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRoute(route);

    // Collect all attachments from all stops in the route
    const attachments: any[] = [];
    route.stops?.forEach((stop) => {
      if (stop.attachments) {
        // For demo purposes, create mock attachments
        const mockAttachments = [
          { id: `${stop.id}-1`, name: "Collection Receipt.pdf", type: "pdf", stopName: stop.name },
          { id: `${stop.id}-2`, name: "Sample Photos.jpg", type: "image", stopName: stop.name },
          { id: `${stop.id}-3`, name: "Temperature Log.xlsx", type: "xlsx", stopName: stop.name }
        ];
        attachments.push(...mockAttachments);
      }
    });

    if (attachments.length > 0) {
      setAllAttachments(attachments);
      setSelectedAttachment(attachments[0]);
      setShowAttachmentsModal(true);
    }
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Trip ID</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Time Start</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Team</TableHead>
            <TableHead className="text-center">Stop Count</TableHead>
            <TableHead className="text-center">Samples</TableHead>
            <TableHead>Attachments</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDates.length > 0 ? (
            sortedDates.map((dateStr) => (
              <React.Fragment key={dateStr}>
                {/* Date Header Row */}
                <TableRow className="bg-gray-50/50">
                  <TableCell colSpan={9} className="py-2">
                    <div className="font-medium text-gray-700">
                      {format(new Date(dateStr), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                </TableRow>

                {/* Routes for this date */}
                {routesByDate[dateStr].map((route) => (
                  <TableRow
                    key={route.id}
                    className="hover:bg-gray-50/50 cursor-pointer"
                    onClick={() => viewDetails(route.id)}
                  >
                    <TableCell className="font-medium">{route.tripId}</TableCell>
                    <TableCell>{route.name}</TableCell>
                    <TableCell>{route.startTime}</TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${route.status === 'active' ? 'bg-blue-500 hover:bg-blue-600' :
                                   route.status === 'pending' ? 'bg-purple-500 hover:bg-purple-600' :
                                   route.status === 'upcoming' ? 'bg-amber-500 hover:bg-amber-600' :
                                   route.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                                   route.status === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                      >
                        {route.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{route.assignedTeam}</TableCell>
                    <TableCell className="text-center">{route.stopCount}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{route.samplesCollected}</span>
                    </TableCell>
                    <TableCell>
                      {route.attachments ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium text-primary hover:underline"
                          onClick={(e) => openAttachmentsModal(route, e)}
                        >
                          View
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onViewDetails(route.id);
                            }}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onEditRoute(route);
                            }}>
                              Edit Route
                            </DropdownMenuItem>
                            {onCopyRoute && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                onCopyRoute(route);
                              }}>
                                Copy Route
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-6 text-muted-foreground">
                No routes found. Try adjusting your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Attachments Modal with Sidebar */}
      <Dialog open={showAttachmentsModal} onOpenChange={setShowAttachmentsModal} className="max-w-6xl">
        <DialogContent className="max-w-6xl w-[90vw] max-h-[80vh] p-0 overflow-hidden">
          <div className="flex h-[80vh]">
            {/* Left sidebar with attachment list */}
            <div className="w-64 border-r bg-gray-50 overflow-y-auto">
              <div className="p-4 border-b bg-white sticky top-0 z-10">
                <h3 className="font-medium">Attachments</h3>
                <p className="text-xs text-muted-foreground mt-1">{allAttachments.length} items</p>
              </div>
              <div className="divide-y">
                {allAttachments.map((attachment, index) => (
                  <div
                    key={attachment.id}
                    className={`p-3 cursor-pointer hover:bg-gray-100 ${selectedAttachment?.id === attachment.id ? 'bg-gray-100' : ''}`}
                    onClick={() => setSelectedAttachment(attachment)}
                  >
                    <div className="flex items-center space-x-2">
                      {attachment.type === "pdf" && <FileText className="h-5 w-5 text-red-500" />}
                      {attachment.type === "xlsx" && <FileText className="h-5 w-5 text-green-500" />}
                      {attachment.type === "image" && <FileImage className="h-5 w-5 text-blue-500" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{attachment.name}</p>
                        {attachment.stopName && (
                          <p className="text-xs text-muted-foreground truncate">{attachment.stopName}</p>
                        )}
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
                  <h2 className="text-lg font-semibold">{selectedAttachment?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedAttachment?.type.toUpperCase()} •
                    {selectedAttachment?.stopName && `From: ${selectedAttachment.stopName}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm">Close</Button>
                  </DialogClose>
                </div>
              </div>

              {/* Preview area */}
              <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-gray-50">
                {selectedAttachment?.type === "image" ? (
                  <div className="max-h-full max-w-full overflow-hidden rounded-md shadow-lg">
                    <img
                      src={`/images/sample-image.jpg`}
                      alt={selectedAttachment.name}
                      className="max-h-[60vh] max-w-full object-contain"
                    />
                  </div>
                ) : selectedAttachment?.type === "pdf" ? (
                  <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-3xl">
                    <div className="flex items-center justify-center h-[50vh] border-2 border-dashed border-gray-300 rounded-md">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">{selectedAttachment.name}</h3>
                        <p className="text-muted-foreground mb-4">PDF Preview not available</p>
                        <Button variant="outline">
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
                        <h3 className="font-medium text-lg mb-2">{selectedAttachment?.name}</h3>
                        <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
                        <Button variant="outline">
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
