import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, MapPin, ArrowRight, Check, Search, Building, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Sample organizations data
const organizations = [
  { id: "1", name: "Medlife Hospital", address: "123 Main St, Suite 400, New York, NY 10001", area: "Koramangala", inSystem: true },
  { id: "2", name: "City Medical Center", address: "456 Park Ave, New York, NY 10002", area: "HSR Layout", inSystem: true },
  { id: "3", name: "HealthFirst Clinic", address: "789 Broadway, New York, NY 10003", area: "BTM", inSystem: true },
  { id: "4", name: "CarePoint Diagnostics", address: "321 5th Ave, New York, NY 10004", area: "Indiranagar", inSystem: true },
  { id: "5", name: "New Medical Facility", address: "555 Hudson St, New York, NY 10014", area: "Koramangala", inSystem: false },
];

// Sample collection points
const collectionPoints = [
  { id: "101", name: "Central Lab - Domlur", address: "100 Lab Drive, Domlur, Bangalore", area: "Domlur" },
  { id: "102", name: "Hub 2 - Indiranagar", address: "200 Hub Street, Indiranagar, Bangalore", area: "Indiranagar" },
  { id: "103", name: "Main Processing Center", address: "300 Processing Ave, Koramangala, Bangalore", area: "Koramangala" },
];

// Sample delivery persons
const deliveryPersons = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Maria Garcia" },
  { id: "3", name: "Raj Patel" },
];

// Sample areas
const areas = ["All Areas", "Koramangala", "HSR Layout", "BTM", "Indiranagar", "Domlur"];

interface SimplifiedRouteFlowProps {
  onCancel: () => void;
  onSave: (routeData: any) => void;
}

export function SimplifiedRouteFlow({ onCancel, onSave }: SimplifiedRouteFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [routeName, setRouteName] = useState("");
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["All Areas"]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPickups, setSelectedPickups] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [reorderedStops, setReorderedStops] = useState<any[]>([]);
  const [customPickups, setCustomPickups] = useState<Array<{id: string; name: string; address: string; area: string}>>([]);
  const [showAddPickupForm, setShowAddPickupForm] = useState(false);
  const [newPickup, setNewPickup] = useState({ name: "", address: "", area: selectedAreas[0] === "All Areas" ? "" : selectedAreas[0] });

  // Filter organizations based on areas and search query
  const filteredOrganizations = organizations.filter(org =>
    (selectedAreas.includes("All Areas") || selectedAreas.includes(org.area)) &&
    (org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     org.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter collection points based on areas
  const filteredCollectionPoints = collectionPoints.filter(point =>
    selectedAreas.includes("All Areas") || selectedAreas.includes(point.area)
  );

  const handlePickupToggle = (id: string) => {
    if (selectedPickups.includes(id)) {
      setSelectedPickups(selectedPickups.filter(pickupId => pickupId !== id));
    } else {
      setSelectedPickups([...selectedPickups, id]);
    }
  };

  const handleCollectionSelect = (id: string) => {
    setSelectedCollection(id);
  };

  const handleAreaToggle = (area: string) => {
    // If "All Areas" is selected, clear other selections
    if (area === "All Areas") {
      setSelectedAreas(["All Areas"]);
      return;
    }

    // If we're adding a specific area, remove "All Areas" from the selection
    let newAreas = [...selectedAreas];
    if (newAreas.includes(area)) {
      // Remove the area if it's already selected
      newAreas = newAreas.filter(a => a !== area);
      // If no areas left, select "All Areas"
      if (newAreas.length === 0 || (newAreas.length === 1 && newAreas[0] === "All Areas")) {
        newAreas = ["All Areas"];
      }
    } else {
      // Add the area and remove "All Areas" if it's there
      newAreas = newAreas.filter(a => a !== "All Areas").concat(area);
    }

    setSelectedAreas(newAreas);

    // Update the new pickup area if it's currently empty
    if (newPickup.area === "" && newAreas.length > 0 && newAreas[0] !== "All Areas") {
      setNewPickup({ ...newPickup, area: newAreas[0] });
    }
  };

  const handleAddCustomPickup = () => {
    // Validate the new pickup
    if (!newPickup.name || !newPickup.address || !newPickup.area) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for the new pickup point",
        variant: "destructive",
      });
      return;
    }

    // Create a new custom pickup with a unique ID
    const customId = `custom-${Date.now()}`;
    const pickup = {
      id: customId,
      name: newPickup.name,
      address: newPickup.address,
      area: newPickup.area
    };

    // Add to custom pickups and select it
    setCustomPickups([...customPickups, pickup]);
    setSelectedPickups([...selectedPickups, customId]);

    // Reset the form
    setNewPickup({ name: "", address: "", area: selectedAreas[0] === "All Areas" ? "" : selectedAreas[0] });
    setShowAddPickupForm(false);

    toast({
      title: "Pickup point added",
      description: `${pickup.name} has been added to your pickup points`,
    });
  };

  const handleCustomPickupToggle = (id: string) => {
    if (selectedPickups.includes(id)) {
      setSelectedPickups(selectedPickups.filter(pickupId => pickupId !== id));
    } else {
      setSelectedPickups([...selectedPickups, id]);
    }
  };

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
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
          description: "Please select a date",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 2) {
      if (selectedPickups.length === 0) {
        toast({
          title: "Missing information",
          description: "Please select at least one pickup point",
          variant: "destructive",
        });
        return;
      }
      if (!selectedCollection) {
        toast({
          title: "Missing information",
          description: "Please select a collection point",
          variant: "destructive",
        });
        return;
      }

      // Prepare the stops for reordering
      const pickupStops = selectedPickups.map(id => {
        // Check if this is a custom pickup
        if (id.startsWith('custom-')) {
          const customPickup = customPickups.find(p => p.id === id);
          return {
            id: `pickup-${id}`,
            name: customPickup?.name || "",
            address: customPickup?.address || "",
            type: "pickup",
            time: "09:00 AM", // Default time
            organization: id,
            isCustom: true,
          };
        } else {
          // This is an organization pickup
          const org = organizations.find(o => o.id === id);
          return {
            id: `pickup-${id}`,
            name: org?.name || "",
            address: org?.address || "",
            type: "pickup",
            time: "09:00 AM", // Default time
            organization: id,
          };
        }
      });

      const collectionStop = {
        id: `collection-${selectedCollection}`,
        name: collectionPoints.find(c => c.id === selectedCollection)?.name || "",
        address: collectionPoints.find(c => c.id === selectedCollection)?.address || "",
        type: "checkpoint",
        time: "12:00 PM", // Default time
      };

      setReorderedStops([...pickupStops, collectionStop]);
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveRoute = () => {
    // Create the route data
    const routeData = {
      name: routeName,
      date: date ? format(date, "yyyy-MM-dd") : "",
      assignedTeam: deliveryPerson,
      stops: reorderedStops,
    };

    onSave(routeData);

    toast({
      title: "Route created successfully",
      description: `${routeName} has been created with ${reorderedStops.length} stops`,
    });
  };

  const moveStop = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === reorderedStops.length - 1)
    ) {
      return;
    }

    const newStops = [...reorderedStops];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newStops[targetIndex];
    newStops[targetIndex] = newStops[index];
    newStops[index] = temp;

    setReorderedStops(newStops);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {currentStep === 1 && "Route Basics"}
          {currentStep === 2 && "Select Pickup & Collection Points"}
          {currentStep === 3 && "Order Stops (Optional)"}
        </h3>
        <div className="flex items-center space-x-1">
          <Badge variant={currentStep >= 1 ? "default" : "outline"}>1</Badge>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <Badge variant={currentStep >= 2 ? "default" : "outline"}>2</Badge>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <Badge variant={currentStep >= 3 ? "default" : "outline"}>3</Badge>
        </div>
      </div>

      {/* Step 1: Route Basics */}
      {currentStep === 1 && (
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
            <Label htmlFor="deliveryPerson">Delivery Person</Label>
            <Select value={deliveryPerson} onValueChange={setDeliveryPerson}>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery person" />
              </SelectTrigger>
              <SelectContent>
                {deliveryPersons.map(person => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label htmlFor="areas">City/Area Filter</Label>
            <Select
              value="placeholder"
              onValueChange={(value) => {
                if (value !== "placeholder") {
                  handleAreaToggle(value);
                }
              }}
            >
              <SelectTrigger id="areas" className="w-full">
                <SelectValue placeholder="Select areas" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <div className="mb-2 font-medium text-sm">Selected: {selectedAreas.filter(a => a !== "All Areas").length > 0 ? selectedAreas.filter(a => a !== "All Areas").join(", ") : "None"}</div>
                  {areas.map((area) => (
                    <div key={area} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`area-${area}`}
                        checked={selectedAreas.includes(area)}
                        onCheckedChange={() => handleAreaToggle(area)}
                      />
                      <Label htmlFor={`area-${area}`} className="font-normal cursor-pointer flex-1">{area}</Label>
                    </div>
                  ))}
                </div>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedAreas.includes("All Areas") ? "All areas selected" : `${selectedAreas.length} area(s) selected`}
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Select Pickup & Collection Points */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <Badge
                  key={area}
                  variant={selectedAreas.includes(area) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleAreaToggle(area)}
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup Points */}
            <div className="border rounded-md">
              <div className="p-3 bg-muted/50 border-b flex justify-between items-center">
                <span className="font-medium">Pickup Points</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Selected: {selectedPickups.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddPickupForm(!showAddPickupForm)}
                    className="h-8"
                  >
                    {showAddPickupForm ? "Cancel" : "Add Custom Pickup"}
                  </Button>
                </div>
              </div>

              {/* Add Custom Pickup Form */}
              {showAddPickupForm && (
                <div className="p-3 border-b bg-muted/10">
                  <h4 className="font-medium mb-2">Add Custom Pickup Point</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="pickupName">Name</Label>
                      <Input
                        id="pickupName"
                        placeholder="Enter pickup point name"
                        value={newPickup.name}
                        onChange={(e) => setNewPickup({ ...newPickup, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupAddress">Address</Label>
                      <Input
                        id="pickupAddress"
                        placeholder="Enter address"
                        value={newPickup.address}
                        onChange={(e) => setNewPickup({ ...newPickup, address: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupArea">Area</Label>
                      <Select value={newPickup.area} onValueChange={(value) => setNewPickup({ ...newPickup, area: value })}>
                        <SelectTrigger id="pickupArea">
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.filter(a => a !== "All Areas").map(area => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleAddCustomPickup}>Add Pickup Point</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Pickup Points List */}
              {customPickups.length > 0 && (
                <div className="divide-y">
                  <div className="p-2 bg-blue-50 border-b">
                    <span className="text-sm font-medium text-blue-700">Custom Pickup Points</span>
                  </div>
                  {customPickups.map(pickup => (
                    <div key={pickup.id} className="p-3 hover:bg-muted/20">
                      <div className="flex items-start">
                        <Checkbox
                          id={`pickup-${pickup.id}`}
                          checked={selectedPickups.includes(pickup.id)}
                          onCheckedChange={() => handleCustomPickupToggle(pickup.id)}
                          className="mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <label
                            htmlFor={`pickup-${pickup.id}`}
                            className="font-medium cursor-pointer flex items-center"
                          >
                            {pickup.name}
                            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                              Custom
                            </Badge>
                          </label>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            {pickup.address}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                            {pickup.area}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Organization Pickup Points */}
              <div className="divide-y max-h-[400px] overflow-y-auto">
                {!showAddPickupForm && (
                  <div className="p-2 bg-gray-50 border-b">
                    <span className="text-sm font-medium text-gray-700">Organizations ({filteredOrganizations.length})</span>
                  </div>
                )}
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations.map(org => (
                    <div key={org.id} className="p-3 hover:bg-muted/20">
                      <div className="flex items-start">
                        <Checkbox
                          id={`org-${org.id}`}
                          checked={selectedPickups.includes(org.id)}
                          onCheckedChange={() => handlePickupToggle(org.id)}
                          className="mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <label
                            htmlFor={`org-${org.id}`}
                            className="font-medium cursor-pointer flex items-center"
                          >
                            {org.name}
                            <Badge
                              variant="outline"
                              className={`ml-2 ${org.inSystem ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                            >
                              {org.inSystem ? "In System" : "New"}
                            </Badge>
                          </label>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            {org.address}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                            {org.area}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No organizations found matching your criteria.
                  </div>
                )}
              </div>
            </div>

            {/* Collection Points */}
            <div className="border rounded-md">
              <div className="p-3 bg-muted/50 border-b">
                <span className="font-medium">Collection Points ({filteredCollectionPoints.length})</span>
              </div>
              <div className="divide-y max-h-[400px] overflow-y-auto">
                {filteredCollectionPoints.length > 0 ? (
                  filteredCollectionPoints.map(point => (
                    <div key={point.id} className="p-3 hover:bg-muted/20">
                      <div className="flex items-start">
                        <Checkbox
                          id={`collection-${point.id}`}
                          checked={selectedCollection === point.id}
                          onCheckedChange={() => handleCollectionSelect(point.id)}
                          className="mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <label
                            htmlFor={`collection-${point.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {point.name}
                          </label>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            {point.address}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                            {point.area}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No collection points found in the selected areas.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-md border">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-3">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm">Select at least one pickup point and one collection point to continue.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Reorder Stops */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="border rounded-md">
            <div className="p-3 bg-muted/50 border-b flex justify-between items-center">
              <span className="font-medium">Route Order ({reorderedStops.length} stops)</span>
              <Button variant="outline" size="sm">
                Auto-optimize
              </Button>
            </div>
            <div className="divide-y max-h-[400px] overflow-y-auto">
              {reorderedStops.map((stop, index) => (
                <div key={stop.id} className="p-3 hover:bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full mr-3 text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{stop.name}</p>
                        <div className="flex items-center space-x-3">
                          <Badge variant={stop.type === "pickup" ? "default" : "secondary"}>
                            {stop.type === "pickup" ? "Pickup" : "Collection"}
                          </Badge>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {stop.time}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={index === 0}
                        onClick={() => moveStop(index, 'up')}
                      >
                        <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
                        <span className="sr-only">Move Up</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={index === reorderedStops.length - 1}
                        onClick={() => moveStop(index, 'down')}
                      >
                        <ArrowRight className="h-4 w-4 rotate-90" />
                        <span className="sr-only">Move Down</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-md border">
            <div className="flex items-start">
              <div className="bg-green-100 text-green-800 rounded-full p-1 mr-3">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Route Summary</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedPickups.length} pickup points and 1 collection point
                </p>
                <p className="text-sm text-muted-foreground">
                  Estimated travel time: ~{Math.round(reorderedStops.length * 0.5)} hours
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handlePreviousStep}
        >
          {currentStep === 1 ? "Cancel" : "Back"}
        </Button>
        <Button
          onClick={currentStep === 4 ? handleSaveRoute : handleNextStep}
        >
          {currentStep === 4 ? "Save Route" : "Next"}
        </Button>
      </div>
    </div>
  );
}
