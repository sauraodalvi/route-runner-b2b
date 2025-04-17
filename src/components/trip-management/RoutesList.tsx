
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Route } from "@/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { StopsAccordion } from "./StopsAccordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RoutesListProps {
  routes: Route[];
  status: string;
  searchQuery: string;
  dateRange: { from?: Date; to?: Date } | undefined;
  onEditRoute: (route: any) => void;
  onViewDetails: (routeId: string) => void;
}

const RoutesList = ({
  routes = [], // Provide default empty array to prevent undefined errors
  status,
  searchQuery,
  dateRange,
  onEditRoute,
  onViewDetails,
}: RoutesListProps) => {
  // Track expanded rows
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  
  // Check if routes is undefined or null and default to empty array
  const routesToFilter = routes || [];
  
  const filteredRoutes = routesToFilter.filter((route) => {
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

  const toggleRowExpansion = (routeId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Trip ID</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time Start</TableHead>
            {/* Only show Time End for non-active trips */}
            {status !== 'active' && <TableHead>Time End</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Assigned Team</TableHead>
            <TableHead className="text-center">Stop Count</TableHead>
            <TableHead className="text-center">Samples Collected</TableHead>
            <TableHead className="text-center">Unregistered Samples</TableHead>
            <TableHead>Attachments</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route) => (
              <React.Fragment key={route.id}>
                <TableRow className="hover:bg-gray-50/50">
                  <TableCell className="px-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => toggleRowExpansion(route.id)}
                    >
                      {expandedRows[route.id] ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{route.tripId}</TableCell>
                  <TableCell>{route.name}</TableCell>
                  <TableCell>{format(new Date(route.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{route.startTime}</TableCell>
                  {status !== 'active' && <TableCell>{route.endTime}</TableCell>}
                  <TableCell>
                    <Badge>{route.status}</Badge>
                  </TableCell>
                  <TableCell>{route.assignedTeam}</TableCell>
                  <TableCell className="text-center">{route.stopCount}</TableCell>
                  <TableCell className="text-center">{route.samplesCollected}</TableCell>
                  <TableCell className="text-center">{route.unregisteredSamples}</TableCell>
                  <TableCell>
                    {route.attachments ? (
                      <span className="text-primary">{route.attachments}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(route.id)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditRoute(route)}
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
                          <DropdownMenuItem onClick={() => onViewDetails(route.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditRoute(route)}>
                            Edit Route
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
                
                {expandedRows[route.id] && (
                  <TableRow className="bg-gray-50/30 hover:bg-gray-50/30">
                    <TableCell colSpan={status === 'active' ? 12 : 13} className="px-0 py-0">
                      <div className="p-4">
                        {route.stops && route.stops.length > 0 ? (
                          <StopsAccordion stops={route.stops} />
                        ) : (
                          <div className="text-center p-2 text-muted-foreground text-sm">
                            No stop information available
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={status === 'active' ? 12 : 13} className="text-center py-6 text-muted-foreground">
                No routes found. Try adjusting your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export { RoutesList };
