
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MoreHorizontal, Calendar, User, Eye, Edit, Trash2 } from "lucide-react";
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
      id: "TR-004-1234-12",
      routeNo: "Route 2",
      date: "17 Apr 2023",
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
      date: "17 Apr 2023",
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
      date: "17 Apr 2023",
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
      date: "17 Apr 2023",
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

  const filteredRoutes = status === "all" ? routes : routes.filter(route => route.status === status);

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

  if (filteredRoutes.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No {status} routes found.</p>
      </div>
    );
  }

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
          {filteredRoutes.map((route) => (
            <TableRow key={route.id} className="hover:bg-gray-50/50">
              <TableCell className="font-medium">{route.id}</TableCell>
              <TableCell>{route.routeNo}</TableCell>
              <TableCell>{route.date}</TableCell>
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
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="ghost" size="icon">
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Trip</DropdownMenuItem>
                      <DropdownMenuItem>Change Team</DropdownMenuItem>
                      {route.status !== "completed" && (
                        <DropdownMenuItem>Cancel Trip</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
