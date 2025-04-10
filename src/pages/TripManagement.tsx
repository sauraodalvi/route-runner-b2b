
import React, { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Download, Calendar, Filter } from "lucide-react";
import { CreateRouteForm } from "@/components/trip-management/CreateRouteForm";
import { RoutesList } from "@/components/trip-management/RoutesList";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TripManagement = () => {
  const [showCreateRouteDialog, setShowCreateRouteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<any | null>(null);
  
  // Filter routes based on search query
  const filterRoutes = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would filter the routes based on the query
    toast({
      title: "Search applied",
      description: `Showing results for "${query}"`,
    });
  };

  const handleExport = () => {
    // In a real app, this would export the routes as an Excel file
    const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');
    toast({
      title: "Export Started",
      description: `Your data is being exported to Excel as routes-${currentDate}.xlsx`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export Completed",
        description: "Your data has been exported successfully",
      });
    }, 2000);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      toast({
        title: "Date Range Applied",
        description: `Showing trips from ${format(range.from, "PPP")} to ${format(range.to, "PPP")}`,
      });
    }
  };

  const openEditRouteDialog = (route: any) => {
    setRouteToEdit(route);
    setShowCreateRouteDialog(true);
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Trip Management</h1>
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Input 
                placeholder="Search trips..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    filterRoutes(searchQuery);
                  }
                }}
                className="pr-8"
              />
              <button 
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => filterRoutes(searchQuery)}
              >
                <Filter className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <Popover open={showDateRangePicker} onOpenChange={setShowDateRangePicker}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL d")} - {format(date.to, "LLL d")}
                      </>
                    ) : (
                      format(date.from, "LLL d")
                    )
                  ) : (
                    "Date Range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => {
              setRouteToEdit(null);
              setShowCreateRouteDialog(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Route
            </Button>
          </div>
        </div>

        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active Trips</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
            <TabsTrigger value="completed">Completed Trips</TabsTrigger>
            <TabsTrigger value="routes">All Routes</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="pt-4">
            <Card>
              <CardContent className="p-0">
                <RoutesList 
                  status="active" 
                  searchQuery={searchQuery} 
                  dateRange={date} 
                  onEditRoute={openEditRouteDialog}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upcoming" className="pt-4">
            <Card>
              <CardContent className="p-0">
                <RoutesList 
                  status="upcoming" 
                  searchQuery={searchQuery} 
                  dateRange={date} 
                  onEditRoute={openEditRouteDialog}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed" className="pt-4">
            <Card>
              <CardContent className="p-0">
                <RoutesList 
                  status="completed" 
                  searchQuery={searchQuery} 
                  dateRange={date} 
                  onEditRoute={openEditRouteDialog}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="routes" className="pt-4">
            <Card>
              <CardContent className="p-0">
                <RoutesList 
                  status="all" 
                  searchQuery={searchQuery} 
                  dateRange={date} 
                  onEditRoute={openEditRouteDialog}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create/Edit Route Dialog */}
        <Dialog open={showCreateRouteDialog} onOpenChange={setShowCreateRouteDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{routeToEdit ? 'Edit Route' : 'Create New Route'}</DialogTitle>
            </DialogHeader>
            <CreateRouteForm 
              onCancel={() => setShowCreateRouteDialog(false)} 
              initialData={routeToEdit}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default TripManagement;
