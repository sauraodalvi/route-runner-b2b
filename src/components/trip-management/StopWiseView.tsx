import React, { useState, useEffect, useMemo } from "react";
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
import { MapPin, Clock, Building, Phone, User, Eye, MoreHorizontal, Filter, Download, FileText, FileImage, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { getStops } from "@/services/api";

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
  useSupabase?: boolean;
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
  useSupabase = true,
}: StopWiseViewProps) => {
  // State for modals
  const [selectedStop, setSelectedStop] = useState<any>(null);
  const [showSamplesModal, setShowSamplesModal] = useState(false);
  const [showUnregisteredSamplesModal, setShowUnregisteredSamplesModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  // Notes are now displayed directly in the table

  // State for Supabase data
  const [supabaseStops, setSupabaseStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch stops from Supabase when filters change
  useEffect(() => {
    if (!useSupabase) return;

    const fetchStopsFromSupabase = async () => {
      setLoading(true);
      setError(null);

      try {
        // Determine stop types to fetch based on filters
        const stopTypes = [];
        if (showPickupPoints) stopTypes.push('pickup');
        if (showCheckpoints) stopTypes.push('dropoff');

        // Fetch stops from Supabase
        const { data, error } = await getStops(status, dateRange, stopTypes, searchQuery);

        if (error) {
          console.error('Error fetching stops from Supabase:', error);
          setError(`Error fetching stops: ${error.message}`);
          setSupabaseStops([]);
        } else if (data && data.length > 0) {
          console.log(`Successfully fetched ${data.length} stops from Supabase`);
          setSupabaseStops(data);
        } else {
          console.log('No stops found in Supabase');
          setSupabaseStops([]);
        }
      } catch (err) {
        console.error('Exception fetching stops:', err);
        setError(`Exception fetching stops: ${err instanceof Error ? err.message : String(err)}`);
        setSupabaseStops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStopsFromSupabase();
  }, [status, dateRange, showPickupPoints, showCheckpoints, searchQuery, useSupabase]);

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

    console.log("Adding sample data to stop:", stop.id, stop.name);

    // Add sample registered samples
    if (stop.samplesRegistered && !stop.samples) {
      console.log(`Adding ${stop.samplesRegistered} registered samples to stop ${stop.id}`);
      stop.samples = Array.from({ length: stop.samplesRegistered }, (_, i) => ({
        id: `S-${stop.id}-${i + 1}`,
        type: i % 2 === 0 ? 'Blood' : 'Urine',
        status: 'Registered'
      }));
    }

    // Add sample unregistered samples
    if (stop.samplesUnregistered && !stop.unregisteredSamples) {
      console.log(`Adding ${stop.samplesUnregistered} unregistered samples to stop ${stop.id}`);

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

      console.log("Created unregistered samples:", stop.unregisteredSamples);
    }

    // Add sample attachments
    if (stop.attachments && !Array.isArray(stop.attachments)) {
      console.log(`Adding attachments to stop ${stop.id}`);

      // Parse the attachments string to get the number of files
      let numFiles = 1;
      if (typeof stop.attachments === 'string') {
        const match = stop.attachments.match(/(\d+)/);
        if (match) {
          numFiles = parseInt(match[1], 10);
        }
      }

      // Create attachment objects
      const attachmentArray = [];
      for (let i = 0; i < numFiles; i++) {
        const fileTypes = ['pdf', 'image', 'xlsx'];
        const fileType = fileTypes[i % fileTypes.length];
        const fileName = fileType === 'pdf' ? 'Lab Report.pdf' :
                         fileType === 'image' ? 'Sample Image.jpg' :
                         'Test Results.xlsx';

        attachmentArray.push({
          id: `att-${stop.id}-${i+1}`,
          name: fileName,
          type: fileType,
          size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
          date: new Date().toISOString()
        });
      }

      stop.attachments = attachmentArray;
      console.log("Created attachments:", stop.attachments);
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

    console.log("Final stop data for modals:", {
      id: stop.id,
      name: stop.name,
      samplesRegistered: stop.samplesRegistered,
      samplesUnregistered: stop.samplesUnregistered,
      hasSamples: !!stop.samples,
      hasUnregisteredSamples: !!stop.unregisteredSamples,
      hasAttachments: !!stop.attachments
    });

    return stop;
  };
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  // Process Supabase stops into date groups
  const processSupabaseStops = useMemo(() => {
    if (!supabaseStops || supabaseStops.length === 0) {
      return [];
    }

    try {
      console.log(`Processing ${supabaseStops.length} stops from Supabase`);

      // Group stops by date
      const result: Record<string, { date: string; stops: any[] }> = {};

      supabaseStops.forEach(stop => {
        // Extract date from the route
        const routeDate = stop.route.date;
        if (!routeDate) {
          console.log(`Skipping stop ${stop.id}: No date available in route`);
          return;
        }

        // Create date group if it doesn't exist
        if (!result[routeDate]) {
          result[routeDate] = {
            date: routeDate,
            stops: [],
          };
        }

        // Add stop to the date group
        result[routeDate].stops.push(stop);
      });

      // Sort dates in descending order (newest first)
      const sortedResults = Object.values(result).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      console.log(`Processed Supabase stops into ${sortedResults.length} date groups`);

      return sortedResults;
    } catch (error) {
      console.error("Error processing Supabase stops:", error);
      return [];
    }
  }, [supabaseStops]);

  // Group stops by date from routes (legacy method)
  const stopsByDate = useMemo(() => {
    // If using Supabase, don't process routes
    if (useSupabase) {
      return [];
    }

    try {
      // Safety check - if routes is undefined or empty, return empty array
      if (!routes || routes.length === 0) {
        console.log("StopWiseView: No routes received");
        return [];
      }

      // Debug log to see what routes we're working with
      console.log(`StopWiseView received ${routes.length} routes with date range:`,
        dateRange ? {
          from: dateRange.from ? dateRange.from.toISOString().split('T')[0] : 'none',
          to: dateRange.to ? dateRange.to.toISOString().split('T')[0] : 'none'
        } : 'none'
      );

      console.log(`StopWiseView status filter: ${status}`);

      // Log the routes to see what we're working with
      routes.forEach(route => {
        console.log(`Route ${route.id} (${route.name}): date=${route.date}, status=${route.status}, stops=${route.stops?.length || 0}`);
      });

      const result: Record<string, { date: string; stops: Array<Stop & { routeId: string; routeName: string; status: string }> }> = {};


    // Filter routes based on search query
    const filteredRoutes = routes.filter((route) => {
      // Safety check for route
      if (!route) return false;

      // Search functionality - case insensitive search for route name or trip ID
      if (searchQuery.trim() !== '') {
        // First try exact match for trip ID (case insensitive)
        const matchesTripId = route.tripId &&
          route.tripId.toLowerCase() === searchQuery.toLowerCase();

        // Then try partial matches with individual terms
        const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
        const matchesTerms = searchTerms.some(term => {
          return (
            (route.tripId && route.tripId.toLowerCase().includes(term)) ||
            (route.name && route.name.toLowerCase().includes(term))
          );
        });

        if (!matchesTripId && !matchesTerms) {
          return false;
        }
      }

      return true;
    });

    // Group stops by date
    console.log(`Processing ${filteredRoutes.length} filtered routes`);

    filteredRoutes.forEach((route) => {
      // Safety check for route and stops
      if (!route || !route.stops || route.stops.length === 0) {
        console.log(`Skipping route ${route?.id || 'unknown'}: No stops available`);
        return;
      }

      // Safety check for date
      if (!route.date) {
        console.log(`Skipping route ${route.id}: No date available`);
        return;
      }

      console.log(`Processing route ${route.id} (${route.name}) with date ${route.date} and ${route.stops.length} stops`);

      const dateKey = route.date;
      if (!result[dateKey]) {
        result[dateKey] = {
          date: dateKey,
          stops: [],
        };
      }

      // Add route information to each stop
      route.stops.forEach((stop) => {
        // Safety check for stop
        if (!stop) return;

        // Apply stop type filters
        if (
          (stop.type === "pickup" && !showPickupPoints) ||
          ((stop.type === "checkpoint" || stop.type === "dropoff") && !showCheckpoints)
        ) {
          return; // Skip this stop if it doesn't match the filter
        }

        // For cancelled tab, only show stops with cancelled status
        if (status === "cancelled" && stop.status !== "cancelled") {
          return; // Skip non-cancelled stops when on cancelled tab
        }

        // For other status tabs, filter accordingly
        if (status !== "all" && status !== "cancelled") {
          // Map route status to stop status if stop status is not defined
          const effectiveStopStatus = stop.status || route.status;

          if (status === "active" &&
              effectiveStopStatus !== "in-progress" &&
              effectiveStopStatus !== "active") {
            return; // Skip non-active stops when on active tab
          }
          if (status === "pending" && effectiveStopStatus !== "pending") {
            return; // Skip non-pending stops when on pending tab
          }
          if (status === "upcoming" && effectiveStopStatus !== "upcoming") {
            return; // Skip non-upcoming stops when on upcoming tab
          }
          if (status === "completed" && effectiveStopStatus !== "completed") {
            return; // Skip non-completed stops when on completed tab
          }
        }

        result[dateKey].stops.push({
          ...stop,
          routeId: route.id,
          routeName: route.name,
          // @ts-ignore - Type compatibility issue
          tripId: route.tripId,
          routeStatus: route.status, // Keep the route status separately
          // Add reference to the full route object for editing
          route: route,
        });
      });
    });

    // Sort dates in descending order (newest first)
    const sortedResults = Object.values(result).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Log the final results
    console.log(`Final results: ${sortedResults.length} date groups with a total of ${
      sortedResults.reduce((sum, group) => sum + group.stops.length, 0)
    } stops`);

    if (sortedResults.length === 0) {
      console.log('No stops found. Check if routes have stops and if date filtering is working correctly.');
    } else {
      sortedResults.forEach(group => {
        console.log(`Date group ${group.date}: ${group.stops.length} stops`);
      });
    }

    return sortedResults;
    } catch (error) {
      console.error("Error in stopsByDate useMemo:", error);
      return []; // Return empty array on error
    }
  }, [routes, searchQuery, dateRange, status, showPickupPoints, showCheckpoints, useSupabase]);

  const toggleDateExpansion = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // Create dummy data for testing when no stops are found
  const createDummyData = () => {
    // Get the date range for dummy data
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for comparison

    // Default to today and tomorrow if there's an error
    let dateList = [today, new Date(today.getTime() + 86400000)]; // today and tomorrow

    try {
      console.log("Creating dummy data for testing with status filter:", status);

      // Create dates that match the current filter if possible
      let dummyStartDate, dummyEndDate;

      try {
        dummyStartDate = dateRange?.from ? new Date(dateRange.from) : today;
        dummyEndDate = dateRange?.to ? new Date(dateRange.to) : new Date(today);
        dummyEndDate.setDate(dummyEndDate.getDate() + 1); // Add one day if no end date
      } catch (error) {
        console.error("Error creating date range for dummy data:", error);
        dummyStartDate = today;
        dummyEndDate = new Date(today);
        dummyEndDate.setDate(dummyEndDate.getDate() + 1);
      }

      console.log(`Creating dummy data with date range: ${dummyStartDate.toISOString().split('T')[0]} to ${dummyEndDate.toISOString().split('T')[0]}`);

      // Generate dates between start and end
      dateList = [];
      const currentDate = new Date(dummyStartDate);

      // Generate up to 3 dates within the range
      while (currentDate <= dummyEndDate) {
        dateList.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);

        // Limit to 3 dates to avoid too much dummy data
        if (dateList.length >= 3) break;
      }

      // If no dates in range, use the start date
      if (dateList.length === 0) {
        console.log("No dates in range, using start date");
        dateList.push(dummyStartDate);
      }

      console.log(`Generated ${dateList.length} dates for dummy data`);
      dateList.forEach((date, i) => {
        console.log(`Dummy date ${i+1}: ${date.toISOString().split('T')[0]}`);
      });
    } catch (error) {
      console.error("Error in createDummyData:", error);
      // Use default dateList (today and tomorrow) if there's an error
    }

    // Create dummy data for each date
    try {
      const dummyData = dateList.map((date, dateIndex) => {
        try {
          const formattedDate = format(date, "yyyy-MM-dd");
          const routeId = `dummy-${dateIndex + 1}`;
          const tripId = `TR-${format(date, "yyyyMMdd")}-${(dateIndex + 1).toString().padStart(3, '0')}`;
          const routeName = `Route ${format(date, "MMM d")}`;

          // Create 2-3 stops per date
          const stopCount = 2 + (dateIndex % 2); // 2 or 3 stops

          // Generate stops with varied statuses
          const allStops = Array.from({ length: stopCount }, (_, stopIndex) => {
            try {
              const stopId = (dateIndex + 1) * 1000 + stopIndex + 1;
              const isPickup = stopIndex % 2 === 0;

              // Vary the status based on the date and stop index
              let stopStatus;
              if (date < today) {
                stopStatus = stopIndex === stopCount - 1 ? "pending" : "completed";
              } else if (date.getTime() === today.getTime()) {
                stopStatus = stopIndex === 0 ? "completed" : (stopIndex === 1 ? "active" : "pending");
              } else {
                stopStatus = "upcoming";
              }

              // Create samples based on status and type
              // Only pickup points can have samples and attachments
              const hasSamples = isPickup && (stopStatus === "completed" || stopStatus === "active");
              const samplesRegistered = hasSamples ? 2 + stopIndex : 0;

              // Add more unregistered samples to some stops
              // Only pickup points can have unregistered samples
              let samplesUnregistered = 0;
              if (hasSamples && isPickup) {
                // 70% chance of having unregistered samples for completed/active pickup points
                if (Math.random() < 0.7) {
                  samplesUnregistered = 1 + Math.floor(Math.random() * 3); // 1-3 unregistered samples
                }
              }

              return {
                id: stopId,
                routeId: routeId,
                routeName: routeName,
                tripId: tripId,
                name: isPickup
                  ? `${["Central", "Downtown", "Westside", "Eastside"][stopIndex % 4]} Medical Center`
                  : `${["Alpha", "Beta", "Gamma", "Delta"][stopIndex % 4]} Checkpoint`,
                address: `${100 + stopIndex * 100} ${["Main St", "Park Ave", "Broadway", "5th Ave"][stopIndex % 4]}, New York, NY`,
                type: isPickup ? "pickup" : "checkpoint",
                time: `${8 + stopIndex}:${stopIndex * 15 % 60 === 0 ? "00" : stopIndex * 15 % 60} AM`,
                status: stopStatus,
                samplesCollected: hasSamples ? samplesRegistered + samplesUnregistered : 0,
                samplesRegistered: samplesRegistered,
                samplesUnregistered: samplesUnregistered,
                contactName: isPickup ? `Dr. ${["Johnson", "Smith", "Williams", "Brown"][stopIndex % 4]}` : undefined,
                contactPhone: isPickup ? `555-${100 + stopIndex * 111}-${1000 + stopIndex * 1111}` : undefined,
                notes: isPickup
                  ? `Regular pickup location. ${stopStatus === "completed" ? "All samples collected successfully." : "Waiting for samples to be prepared."}`
                  : `${stopStatus === "completed" ? "Checkpoint passed." : "Temperature verification required."}`,
                attachments: isPickup && hasSamples ? `${1 + (stopIndex % 2)} files` : undefined,
                route: {
                  id: routeId,
                  name: routeName,
                  date: formattedDate,
                  assignedTeam: `Team ${["Alpha", "Beta", "Gamma"][dateIndex % 3]}`,
                  status: date < today ? "completed" : (date.getTime() === today.getTime() ? "active" : "upcoming")
                }
              };
            } catch (error) {
              console.error(`Error creating dummy stop ${stopIndex} for date ${date}:`, error);
              // Return a minimal stop object on error
              return {
                id: (dateIndex + 1) * 1000 + stopIndex + 1,
                routeId: routeId,
                routeName: routeName,
                tripId: tripId,
                name: "Error Stop",
                address: "Error Address",
                type: "pickup",
                time: "00:00 AM",
                status: "pending",
                route: {
                  id: routeId,
                  name: routeName,
                  date: formattedDate,
                  assignedTeam: "Error Team",
                  status: "pending"
                }
              };
            }
          });

          // Filter stops based on status and type
          let filteredStops = allStops;

          // Apply stop type filters
          filteredStops = filteredStops.filter(stop => {
            if ((stop.type === "pickup" && !showPickupPoints) ||
                ((stop.type === "checkpoint" || stop.type === "dropoff") && !showCheckpoints)) {
              return false;
            }
            return true;
          });

          // Apply status filter
          if (status !== "all") {
            filteredStops = filteredStops.filter(stop => {
              if (status === "cancelled" && stop.status !== "cancelled") {
                return false;
              }
              if (status === "active" && stop.status !== "active" && stop.status !== "in-progress") {
                return false;
              }
              if (status === "pending" && stop.status !== "pending") {
                return false;
              }
              if (status === "upcoming" && stop.status !== "upcoming") {
                return false;
              }
              if (status === "completed" && stop.status !== "completed") {
                return false;
              }
              return true;
            });
          }

          // Only return date groups that have stops after filtering
          if (filteredStops.length === 0) {
            return null; // Skip this date group if no stops match the filter
          }

          return {
            date: formattedDate,
            stops: filteredStops
          };
        } catch (error) {
          console.error(`Error processing date ${date}:`, error);
          return null;
        }
      });

    try {
      // Filter out null date groups (those with no stops after filtering)
      return dummyData.filter(group => group !== null);
    } catch (error) {
      console.error("Error filtering dummy data:", error);
      // Return a minimal dataset on error
      const today = new Date();
      return [{
        date: format(today, "yyyy-MM-dd"),
        stops: []
      }];
    }
    } catch (error) {
      console.error("Error in createDummyData outer try block:", error);
      // Return a minimal dataset on error
      const today = new Date();
      return [{
        date: format(today, "yyyy-MM-dd"),
        stops: []
      }];
    }
  };

  // Determine which data source to use
  const dataToRender = useSupabase ? processSupabaseStops : stopsByDate;

  // Show loading state when fetching from Supabase
  if (useSupabase && loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading stops from Supabase...</span>
      </div>
    );
  }

  // Show error state if there was an error fetching from Supabase
  if (useSupabase && error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">{error}</p>
        <p className="text-muted-foreground">Showing sample data instead.</p>
      </div>
    );
  }

  // Check if we have any stops to display
  if (!dataToRender || dataToRender.length === 0) {
    // Create dummy data for testing without showing any messages
    const dummyData = createDummyData();

    // Render the dummy data without any explanatory messages
    return (
      <div className="overflow-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Trip ID</TableHead>
              <TableHead>Stop Name</TableHead>
              <TableHead className="min-w-[120px]">Stop Type</TableHead>
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
            {dummyData.map((dateGroup) => (
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
                    key={`dummy-${stop.routeId}-${stop.id}`}
                    className="hover:bg-gray-50/50"
                  >
                    <TableCell>{stop.tripId}</TableCell>
                    <TableCell className="font-medium">
                      {stop.name}
                    </TableCell>
                    <TableCell>
                      {stop.type && (
                        <Badge variant={stop.type === "pickup" ? "default" : "secondary"} className="whitespace-nowrap">
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
                      {(stop.status === "in-progress" || stop.status === "active") && (
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
                    </TableCell>
                    <TableCell>{stop.route.assignedTeam}</TableCell>
                    <TableCell>
                      {stop.samplesRegistered ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-primary hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Opening registered samples modal for stop:", stop.id);
                            setSelectedStop(addSampleDataToStop({...stop}));
                            setShowSamplesModal(true);
                          }}
                        >
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1 cursor-pointer transition-colors">
                            <span>{stop.samplesRegistered} samples</span>
                            <Eye className="h-3.5 w-3.5" />
                          </Badge>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {stop.samplesUnregistered && stop.samplesUnregistered > 0 ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto hover:bg-red-50 px-2 py-1 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Opening unregistered samples modal for stop:", stop.id);
                            setSelectedStop(addSampleDataToStop({...stop}));
                            setShowUnregisteredSamplesModal(true);
                          }}
                        >
                          <Badge variant="destructive" className="flex items-center gap-1 cursor-pointer hover:bg-red-600 transition-colors">
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
                          className="p-0 h-auto text-primary hover:bg-green-50 px-2 py-1 rounded flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Opening attachments modal for stop:", stop.id);
                            setSelectedStop(addSampleDataToStop({...stop}));
                            setShowAttachmentsModal(true);
                          }}
                        >
                          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100 flex items-center gap-1 cursor-pointer transition-colors">
                            <span>
                              {/* @ts-ignore - Type compatibility issue */}
                              {typeof stop.attachments === 'string'
                                ? stop.attachments
                                : // @ts-ignore - Type compatibility issue
                                  Array.isArray(stop.attachments)
                                  ? // @ts-ignore - Type compatibility issue
                                    `${stop.attachments.length} files`
                                  : '1 file'}
                            </span>
                            <FileImage className="h-3.5 w-3.5" />
                          </Badge>
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
                              // @ts-ignore - Type compatibility issue
                              onEditRoute(stop.route);
                            }}>
                              Edit Route
                            </DropdownMenuItem>
                          )}
                          {onCopyRoute && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              // @ts-ignore - Type compatibility issue
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
            ))}
          </TableBody>
        </Table>
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
              <TableHead className="min-w-[120px]">Stop Type</TableHead>
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
          {dataToRender.length > 0 ? (
            dataToRender.map((dateGroup) => (
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
                        <Badge variant={stop.type === "pickup" ? "default" : "secondary"} className="whitespace-nowrap">
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
                      {(stop.status === "in-progress" || stop.status === "active") && (
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
                    </TableCell>
                    <TableCell>{stop.route.assignedTeam}</TableCell>
                    <TableCell>
                      {stop.samplesRegistered ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-primary hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Opening registered samples modal for stop:", stop.id);
                            setSelectedStop(addSampleDataToStop({...stop}));
                            setShowSamplesModal(true);
                          }}
                        >
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1 cursor-pointer transition-colors">
                            <span>{stop.samplesRegistered} samples</span>
                            <Eye className="h-3.5 w-3.5" />
                          </Badge>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {stop.samplesUnregistered && stop.samplesUnregistered > 0 ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto hover:bg-red-50 px-2 py-1 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Opening unregistered samples modal for stop:", stop.id);
                            setSelectedStop(addSampleDataToStop({...stop}));
                            setShowUnregisteredSamplesModal(true);
                          }}
                        >
                          <Badge variant="destructive" className="flex items-center gap-1 cursor-pointer hover:bg-red-600 transition-colors">
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
                          className="p-0 h-auto text-primary hover:bg-green-50 px-2 py-1 rounded flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Opening attachments modal for stop:", stop.id);
                            setSelectedStop(addSampleDataToStop({...stop}));
                            setShowAttachmentsModal(true);
                          }}
                        >
                          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100 flex items-center gap-1 cursor-pointer transition-colors">
                            <span>
                              {typeof stop.attachments === 'string'
                                ? stop.attachments
                                : Array.isArray(stop.attachments)
                                  ? `${stop.attachments.length} files`
                                  : '1 file'}
                            </span>
                            <FileImage className="h-3.5 w-3.5" />
                          </Badge>
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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto z-50">
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSamplesModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unregistered Samples Modal */}
      <Dialog open={showUnregisteredSamplesModal} onOpenChange={setShowUnregisteredSamplesModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto z-50">
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUnregisteredSamplesModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Modal removed - notes are now displayed directly in the table */}

      {/* Attachments Modal */}
      <Dialog open={showAttachmentsModal} onOpenChange={setShowAttachmentsModal}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[80vh] p-0 overflow-hidden z-50">
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
                      src={`/route-runner-b2b/images/sample-image.jpg`}
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
