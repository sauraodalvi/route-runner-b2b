import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Map, ArrowUp, ArrowDown, Check, RefreshCw, X, Edit, Trash2, RotateCw, Undo2, Building, Sparkles, Info, ChevronDown } from "lucide-react";
import { StopsList } from "./StopsList";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddStopForm } from "./AddStopForm";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface CreateRouteFormProps {
  onCancel: () => void;
  initialData?: any;
}

export interface Stop {
  id: number;
  name: string;
  address: string;
  type: "checkpoint" | "pickup";
  time?: string;
  organization?: string;
  contactName?: string;
  contactPhone?: string;
  inSystem?: boolean;
}

export function CreateRouteForm({ onCancel, initialData }: CreateRouteFormProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [frequencyType, setFrequencyType] = useState("one-time");
  const [stops, setStops] = useState<Stop[]>([]);
  const [originalStops, setOriginalStops] = useState<Stop[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [showAddStopDialog, setShowAddStopDialog] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [endAfter, setEndAfter] = useState("");
  const [endAfterUnit, setEndAfterUnit] = useState("trips");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [pickupPartner, setPickupPartner] = useState("");
  // Removed bulk upload related state variables
  const [stopToEdit, setStopToEdit] = useState<Stop | null>(null);
  const [editMode, setEditMode] = useState("this");
  // Removed modal state variables

  const dummyPartners = [
    { id: 1, name: "FastTrack Logistics" },
    { id: 2, name: "MedExpress Pickup" },
    { id: 3, name: "LabConnect Services" },
  ];

  useEffect(() => {
    if (initialData) {
      // If this is a copy operation (isCopy flag is set), don't set the name and date
      if (!initialData.isCopy) {
        setRouteName(initialData.routeNo || "");
        if (initialData.date) {
          try {
            setDate(parseISO(initialData.date));
          } catch (error) {
            console.error("Error parsing date:", error);
          }
        }
      } else {
        // For copy operations, clear the name and date
        setRouteName("");
        setDate(undefined);
        // Show a toast message to remind the user to set a new name and date
        toast({
          title: "Copy Route",
          description: "Please provide a new name and start date for this route copy.",
        });
      }

      if (initialData.stopCount > 0) {
        const dummyStops: Stop[] = [];
        for (let i = 1; i <= initialData.stopCount; i++) {
          dummyStops.push({
            id: i,
            name: `Stop ${i}`,
            address: `${100 + i} Main St, City`,
            type: i % 3 === 0 ? "checkpoint" : "pickup",
            time: `${String(8 + Math.floor(i / 2)).padStart(2, '0')}:${String((i * 10) % 60).padStart(2, '0')}`,
            organization: i % 3 === 0 ? undefined : `Organization ${i}`,
            contactName: `Contact Person ${i}`,
            contactPhone: `555-${String(1000 + i).padStart(4, '0')}`,
            inSystem: true,
          });
        }
        setStops(dummyStops);
      }

      // For copy operations, don't set the pickup partner
      if (!initialData.isCopy) {
        setPickupPartner(initialData.assignedTeam ? "1" : "");
      } else {
        setPickupPartner("");
      }
    }
  }, [initialData]);

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddStop = (stop: Stop) => {
    if (stopToEdit) {
      setStops(stops.map(s => s.id === stopToEdit.id ? stop : s));
      setStopToEdit(null);
      toast({
        title: "Stop updated successfully",
        description: `${stop.name} has been updated`,
      });
    } else {
      setStops([...stops, { ...stop, id: Date.now() }]);
      toast({
        title: "Stop added successfully",
        description: `${stop.name} has been added to the route`,
      });
    }
    setShowAddStopDialog(false);
  };

  const handleDeleteStop = (stopId: number) => {
    setStops(stops.filter(stop => stop.id !== stopId));
    toast({
      title: "Stop removed",
      description: "The stop has been removed from the route",
    });
  };

  const handleEditStop = (stop: Stop) => {
    setStopToEdit(stop);
    setShowAddStopDialog(true);
  };

  const handleMoveStop = (stopId: number, direction: 'up' | 'down') => {
    const stopIndex = stops.findIndex(stop => stop.id === stopId);
    if (
      (direction === 'up' && stopIndex === 0) ||
      (direction === 'down' && stopIndex === stops.length - 1)
    ) {
      return;
    }

    const newStops = [...stops];
    const targetIndex = direction === 'up' ? stopIndex - 1 : stopIndex + 1;
    const temp = newStops[targetIndex];
    newStops[targetIndex] = newStops[stopIndex];
    newStops[stopIndex] = temp;

    setStops(newStops);
    toast({
      title: "Stop reordered",
      description: `${newStops[targetIndex].name} moved ${direction}`,
    });
  };

  const handleCreateRoute = () => {
    if (!routeName) {
      toast({
        title: "Missing information",
        description: "Please enter a route name",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Missing information",
        description: "Please select a start date",
        variant: "destructive",
      });
      return;
    }

    if (stops.length === 0) {
      toast({
        title: "Missing information",
        description: "Please add at least one stop to the route",
        variant: "destructive",
      });
      return;
    }

    // For new routes, just create and return
    if (!initialData) {
      toast({
        title: "Route created successfully",
        description: `${routeName} has been created with ${stops.length} stops`,
      });
      onCancel();
    }
    // For existing routes, the inline buttons handle the actions
  };

  const handleSaveEdit = () => {
    toast({
      title: initialData ? `${editMode === "this" ? "Trip" : "All Linked Trips"} Updated` : "Route Created",
      description: initialData
        ? `${routeName} has been updated with ${stops.length} stops`
        : `${routeName} has been created with ${stops.length} stops`,
    });
    // No longer using modal
    onCancel();
  };

  const handleCancelTrip = (mode: 'this' | 'all') => {
    toast({
      title: `Trip${mode === 'all' ? 's' : ''} Cancelled`,
      description: mode === 'this'
        ? `${initialData?.id || 'Trip'} has been cancelled`
        : `All trips in route ${routeName} have been cancelled`,
    });
    // No longer using modal
    onCancel();
  };

  // Removed handleDownloadTemplate and handleFileUpload functions

  const handleOptimizeRoute = () => {
    if (!isOptimized) {
      setOriginalStops([...stops]);
    }

    toast({
      title: "Route Optimization",
      description: "Checking Google Maps for optimal route...",
    });

    // Simulate Google Maps API call for route optimization
    setTimeout(() => {
      // In a real implementation, this would use the Google Maps Directions API
      // to calculate the optimal order of stops based on travel time/distance

      // For now, we'll simulate a more sophisticated optimization than just alphabetical
      // We'll use a greedy algorithm to find the nearest neighbor for each stop

      const optimizedStops: Stop[] = [];
      const remainingStops = [...stops];

      // Always start with the first stop (could be a depot or starting point)
      if (remainingStops.length > 0) {
        optimizedStops.push(remainingStops.shift()!);
      }

      // For each remaining stop, find the closest one to the last added stop
      while (remainingStops.length > 0) {
        const lastStop = optimizedStops[optimizedStops.length - 1];

        // Find the "closest" stop (in a real implementation, this would use actual distances)
        // Here we're using a random distance metric for simulation
        let closestIndex = 0;
        let closestDistance = Number.MAX_VALUE;

        remainingStops.forEach((stop, index) => {
          // Generate a random "distance" between stops
          // In reality, this would be calculated using Google Maps Distance Matrix API
          const distance = Math.random() * 100;

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        // Add the closest stop to our optimized route
        optimizedStops.push(remainingStops.splice(closestIndex, 1)[0]);
      }

      setStops(optimizedStops);
      setIsOptimized(true);

      toast({
        title: "Optimization Complete",
        description: "Your route has been optimized to save approximately 25% travel distance.",
      });
    }, 2000);
  };

  const handleRevertToOriginal = () => {
    setStops([...originalStops]);
    setIsOptimized(false);

    toast({
      title: "Route Reverted",
      description: "Your route has been reverted to the original order.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Route Details</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="routeName">Route Name</Label>
          <Input
            id="routeName"
            placeholder="Enter route name"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => setDate(newDate)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Frequency</Label>
          <RadioGroup
            defaultValue="one-time"
            className="pt-2"
            onValueChange={setFrequencyType}
            value={frequencyType}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one-time" id="one-time" />
              <Label htmlFor="one-time" className="font-normal">One-time trip</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="font-normal">Daily</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="font-normal">Weekly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="font-normal">Monthly</Label>
            </div>
          </RadioGroup>
        </div>

        {frequencyType !== "one-time" && (
          <div>
            <Label htmlFor="endAfter">End After</Label>
            <div className="flex space-x-2">
              <Input
                id="endAfter"
                type="number"
                className="w-1/3"
                placeholder="10"
                value={endAfter}
                onChange={(e) => setEndAfter(e.target.value)}
              />
              <Select value={endAfterUnit} onValueChange={setEndAfterUnit}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trips">Trips</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {frequencyType === "weekly" && (
          <div>
            <Label className="mb-2 block">Repeat on days</Label>
            <div className="flex flex-wrap gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={selectedDays.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <Label htmlFor={`day-${day}`} className="font-normal">{day}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="pickupPartner">Assign Pickup Partner</Label>
          <Select value={pickupPartner} onValueChange={setPickupPartner}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select partner" />
            </SelectTrigger>
            <SelectContent>
              {dummyPartners.map((partner) => (
                <SelectItem key={partner.id} value={partner.id.toString()}>
                  {partner.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Add Stops to Route</Label>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Stops ({stops.length})</span>
            <div className="flex space-x-2">
              {stops.length >= 2 && (
                <>
                  {isOptimized ? (
                    <Button size="sm" variant="outline" onClick={handleRevertToOriginal}>
                      <Undo2 className="mr-2 h-4 w-4" />
                      Revert to Original Order
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={handleOptimizeRoute}>
                      <RotateCw className="mr-2 h-4 w-4" />
                      Optimize Route
                    </Button>
                  )}
                </>
              )}
              <Button size="sm" variant="outline" onClick={() => {
                setStopToEdit(null);
                setShowAddStopDialog(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Stop
              </Button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[300px] border rounded-md">
            {stops.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No stops added yet. Click "Add Stop" to get started.
              </div>
            ) : (
              <ul className="divide-y">
                {stops.map((stop, index) => (
                  <li key={stop.id} className="p-3 hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full mr-3 text-sm">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{stop.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {stop.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => handleMoveStop(stop.id, 'up')}
                        className="h-8 w-8"
                      >
                        <ArrowUp className="h-4 w-4" />
                        <span className="sr-only">Move Up</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={index === stops.length - 1}
                        onClick={() => handleMoveStop(stop.id, 'down')}
                        className="h-8 w-8"
                      >
                        <ArrowDown className="h-4 w-4" />
                        <span className="sr-only">Move Down</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditStop(stop)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteStop(stop.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
        {/* Map view removed */}
        <div className="mt-4 text-center">
          {stops.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {stops.length} {stops.length === 1 ? 'stop' : 'stops'} added
            </span>
          )}
        </div>
      </div>

      {initialData ? (
        <div className="border-t pt-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <div className="flex gap-2">
              <Button
                size="lg"
                className="font-medium"
                onClick={() => {
                  setEditMode("this");
                  handleSaveEdit();
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                Apply to Current Trip
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditMode("all");
                      handleSaveEdit();
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Apply to All Trips
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="font-medium text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleCancelTrip('this')}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Current Trip
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleCancelTrip('all')}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel All Trips
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleCreateRoute}>
            Create Route
          </Button>
        </div>
      )}

      <Dialog
        open={showAddStopDialog}
        onOpenChange={(open) => {
          if (!open) {
            setStopToEdit(null);
          }
          setShowAddStopDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{stopToEdit ? 'Edit Stop' : 'Add Stop to Route'}</DialogTitle>
            <div className="text-sm text-muted-foreground mt-1">
              <p className="flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                Edited address won't be saved against the organization
              </p>
            </div>
          </DialogHeader>
          <AddStopForm
            initialData={stopToEdit}
            onSubmit={handleAddStop}
            onCancel={() => {
              setStopToEdit(null);
              setShowAddStopDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Simplified Route Flow Dialog removed */}
    </div>
  );
}
