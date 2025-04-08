
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Upload, Map, FileSpreadsheet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StopsList } from "./StopsList";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { AddStopForm } from "./AddStopForm";
import { toast } from "@/hooks/use-toast";

interface CreateRouteFormProps {
  onCancel: () => void;
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
}

export function CreateRouteForm({ onCancel }: CreateRouteFormProps) {
  const [date, setDate] = useState<Date>();
  const [frequencyType, setFrequencyType] = useState("one-time");
  const [stops, setStops] = useState<Stop[]>([]);
  const [showAddStopSheet, setShowAddStopSheet] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [endAfter, setEndAfter] = useState("");
  const [endAfterUnit, setEndAfterUnit] = useState("trips");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [pickupPartner, setPickupPartner] = useState("");
  
  const dummyPartners = [
    { id: 1, name: "FastTrack Logistics" },
    { id: 2, name: "MedExpress Pickup" },
    { id: 3, name: "LabConnect Services" },
  ];

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddStop = (stop: Stop) => {
    setStops([...stops, { ...stop, id: stops.length + 1 }]);
    setShowAddStopSheet(false);
    toast({
      title: "Stop added successfully",
      description: `${stop.name} has been added to the route`,
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

    toast({
      title: "Route created successfully",
      description: `${routeName} has been created with ${stops.length} stops`,
    });

    onCancel();
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Template downloaded",
      description: "CSV template has been downloaded to your device",
    });
  };

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  onSelect={setDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
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
                  <SelectTrigger>
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
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Add Stops to Route</Label>
            <Tabs defaultValue="manual">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Add Manually</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">Stops ({stops.length})</span>
                  <Button size="sm" variant="outline" onClick={() => setShowAddStopSheet(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stop
                  </Button>
                </div>
                <StopsList stops={stops} />
              </TabsContent>
              <TabsContent value="bulk" className="pt-4">
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Drop CSV file here or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Download template and fill with stop details
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={handleDownloadTemplate}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="h-56 bg-muted rounded-lg flex items-center justify-center mt-4">
            <div className="text-center">
              <Map className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Map view will display stops here</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleCreateRoute}>Create Route</Button>
      </div>

      <Sheet open={showAddStopSheet} onOpenChange={setShowAddStopSheet}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Stop to Route</SheetTitle>
            <SheetDescription>
              Add stop details to include in your route
            </SheetDescription>
          </SheetHeader>
          <AddStopForm onSubmit={handleAddStop} onCancel={() => setShowAddStopSheet(false)} />
        </SheetContent>
      </Sheet>
    </form>
  );
}
