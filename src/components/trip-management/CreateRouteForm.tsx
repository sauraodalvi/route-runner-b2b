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
import { CalendarIcon, Plus, Upload, Map, FileSpreadsheet, ArrowUp, ArrowDown, Check, RefreshCw, X, Edit, Trash2, RotateCw, Undo2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StopsList } from "./StopsList";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [activeTab, setActiveTab] = useState("manual");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stopToEdit, setStopToEdit] = useState<Stop | null>(null);
  const [editMode, setEditMode] = useState("this");
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showCancelOptions, setShowCancelOptions] = useState(false);
  
  const dummyPartners = [
    { id: 1, name: "FastTrack Logistics" },
    { id: 2, name: "MedExpress Pickup" },
    { id: 3, name: "LabConnect Services" },
  ];

  useEffect(() => {
    if (initialData) {
      setRouteName(initialData.routeNo || "");
      if (initialData.date) {
        try {
          setDate(parseISO(initialData.date));
        } catch (error) {
          console.error("Error parsing date:", error);
        }
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
      
      setPickupPartner(initialData.assignedTeam ? "1" : "");
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

    if (initialData) {
      setShowEditOptions(true);
    } else {
      toast({
        title: "Route created successfully",
        description: `${routeName} has been created with ${stops.length} stops`,
      });
      onCancel();
    }
  };

  const handleSaveEdit = () => {
    toast({
      title: initialData ? `${editMode === "this" ? "Trip" : "All Linked Trips"} Updated` : "Route Created",
      description: initialData 
        ? `${routeName} has been updated with ${stops.length} stops` 
        : `${routeName} has been created with ${stops.length} stops`,
    });
    setShowEditOptions(false);
    onCancel();
  };
  
  const handleCancelTrip = (mode: 'this' | 'all') => {
    toast({
      title: `Trip${mode === 'all' ? 's' : ''} Cancelled`,
      description: mode === 'this' 
        ? `${initialData?.id || 'Trip'} has been cancelled` 
        : `All trips in route ${routeName} have been cancelled`,
    });
    setShowCancelOptions(false);
    onCancel();
  };

  const handleDownloadTemplate = () => {
    const csvContent = "Stop Name,Address,Type,Time,Organization,Contact Name,Contact Phone\nExample Hospital,123 Main St,pickup,09:00 AM,1,John Doe,555-123-4567\nCheckpoint 1,456 Park Ave,checkpoint,10:00 AM,,Jane Smith,555-987-6543";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'route_stops_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template downloaded",
      description: "CSV template has been downloaded to your device",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    const mockStopsFromCsv = [
      {
        id: Date.now() + 1,
        name: "Hospital A",
        address: "123 Health St",
        type: "pickup" as const,
        time: "09:00 AM",
        organization: "1",
        contactName: "Dr. Smith",
        contactPhone: "555-123-4567"
      },
      {
        id: Date.now() + 2,
        name: "Checkpoint B",
        address: "456 Safety Rd",
        type: "checkpoint" as const,
        time: "10:30 AM",
        contactName: "Security Team",
        contactPhone: "555-987-6543"
      }
    ];

    setStops([...stops, ...mockStopsFromCsv]);
    
    toast({
      title: "Stops imported successfully",
      description: `${mockStopsFromCsv.length} stops have been added from the file`,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOptimizeRoute = () => {
    if (!isOptimized) {
      setOriginalStops([...stops]);
    }
    
    toast({
      title: "Route Optimization",
      description: "Reordering stops based on shortest distance...",
    });
    
    setTimeout(() => {
      const optimizedStops = [...stops].sort((a, b) => a.name.localeCompare(b.name));
      setStops(optimizedStops);
      setIsOptimized(true);
      
      toast({
        title: "Optimization Complete",
        description: "Your route has been optimized for efficient travel.",
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
          <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Add Manually</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="manual" className="pt-4">
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
            </TabsContent>
            <TabsContent value="bulk" className="pt-4">
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".csv"
                  className="hidden" 
                  onChange={handleFileUpload}
                />
                <Upload 
                  className="h-8 w-8 mx-auto mb-2 text-muted-foreground cursor-pointer" 
                  onClick={() => fileInputRef.current?.click()}
                />
                <p className="text-sm font-medium cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  Drop CSV file here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Download template and fill with stop details
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={handleDownloadTemplate}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
              {stops.length >= 2 && (
                <div className="mt-4 mb-4 flex justify-end">
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
                </div>
              )}
              {stops.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Stops ({stops.length})</span>
                  </div>
                  <div className="overflow-y-auto max-h-[300px] border rounded-md">
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
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <div className="h-56 bg-muted rounded-lg flex items-center justify-center mt-4">
          <div className="text-center">
            <Map className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Map view will display stops here</p>
            {stops.length > 0 && (
              <span className="text-xs block mt-1">
                {stops.length} {stops.length === 1 ? 'stop' : 'stops'} added
              </span>
            )}
          </div>
        </div>
      </div>

      {initialData ? (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="w-full" 
              onClick={() => setShowEditOptions(true)}
            >
              <Check className="mr-2 h-4 w-4" />
              Apply Changes
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setShowCancelOptions(true)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Trip
            </Button>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={onCancel}>
              Back to Trip Management
            </Button>
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

      <AlertDialog open={showEditOptions} onOpenChange={setShowEditOptions}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to apply these changes only to this trip or to all linked trips in this route?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setShowEditOptions(false)}>
              Cancel
            </AlertDialogCancel>
            <Button 
              variant="outline" 
              onClick={() => {
                setEditMode("this");
                handleSaveEdit();
              }}
              className="flex items-center"
            >
              <Check className="mr-2 h-4 w-4" />
              Edit Only This Trip
            </Button>
            <Button 
              onClick={() => {
                setEditMode("all");
                handleSaveEdit();
              }}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Edit All Linked Trips
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <Button 
              variant="outline" 
              onClick={() => handleCancelTrip('this')}
              className="flex items-center"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel This Trip Only
            </Button>
            <Button 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center"
              onClick={() => handleCancelTrip('all')}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel All Linked Trips
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
