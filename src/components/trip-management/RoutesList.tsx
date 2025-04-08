
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MoreHorizontal, Calendar, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RoutesListProps {
  status: "active" | "upcoming" | "completed" | "all";
}

export function RoutesList({ status }: RoutesListProps) {
  // Mock data
  const routes = [
    {
      id: 1,
      name: "Downtown Labs Collection",
      startDate: "2023-04-15",
      stops: 8,
      partner: "FastTrack Logistics",
      status: "active",
    },
    {
      id: 2,
      name: "Westside Medical Centers",
      startDate: "2023-04-16",
      stops: 5,
      partner: "MedExpress Pickup",
      status: "active",
    },
    {
      id: 3,
      name: "Northside Hospital Group",
      startDate: "2023-04-20",
      stops: 3,
      partner: "LabConnect Services",
      status: "upcoming",
    },
    {
      id: 4,
      name: "Southern Research Labs",
      startDate: "2023-04-22",
      stops: 6,
      partner: "FastTrack Logistics",
      status: "upcoming",
    },
    {
      id: 5,
      name: "Central Medical District",
      startDate: "2023-04-05",
      stops: 7,
      partner: "MedExpress Pickup",
      status: "completed",
    },
  ];

  const filteredRoutes = status === "all" ? routes : routes.filter(route => route.status === status);

  if (filteredRoutes.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No {status} routes found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Route Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Stops</TableHead>
          <TableHead>Pickup Partner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredRoutes.map((route) => (
          <TableRow key={route.id}>
            <TableCell className="font-medium">{route.name}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {route.startDate}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                {route.stops} stops
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                {route.partner}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  route.status === "active"
                    ? "default"
                    : route.status === "upcoming"
                    ? "outline"
                    : "secondary"
                }
              >
                {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Route</DropdownMenuItem>
                  <DropdownMenuItem>Change Partner</DropdownMenuItem>
                  {route.status !== "completed" && (
                    <DropdownMenuItem>Cancel Trip</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
