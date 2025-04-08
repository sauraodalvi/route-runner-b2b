
import React, { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileSpreadsheet, Filter, Download, Calendar } from "lucide-react";
import { CreateRouteForm } from "@/components/trip-management/CreateRouteForm";
import { RoutesList } from "@/components/trip-management/RoutesList";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const TripManagement = () => {
  const [showCreateRoute, setShowCreateRoute] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being exported to Excel",
    });
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
                className="pr-8"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            {!showCreateRoute && (
              <Button size="sm" onClick={() => setShowCreateRoute(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Route
              </Button>
            )}
          </div>
        </div>

        {showCreateRoute ? (
          <Card>
            <CardContent className="pt-6">
              <CreateRouteForm onCancel={() => setShowCreateRoute(false)} />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Trips</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
              <TabsTrigger value="completed">Completed Trips</TabsTrigger>
              <TabsTrigger value="routes">All Routes</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="pt-4">
              <Card>
                <CardContent className="p-0">
                  <RoutesList status="active" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="upcoming" className="pt-4">
              <Card>
                <CardContent className="p-0">
                  <RoutesList status="upcoming" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="completed" className="pt-4">
              <Card>
                <CardContent className="p-0">
                  <RoutesList status="completed" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="routes" className="pt-4">
              <Card>
                <CardContent className="p-0">
                  <RoutesList status="all" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default TripManagement;
