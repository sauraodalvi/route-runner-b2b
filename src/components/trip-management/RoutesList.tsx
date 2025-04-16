
import React from "react";
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
import { Eye, Edit, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
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
              <TableRow key={route.id} className="hover:bg-gray-50/50">
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={status === 'active' ? 11 : 12} className="text-center py-6 text-muted-foreground">
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
