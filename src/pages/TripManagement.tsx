
import React, { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileSpreadsheet, MapPin } from "lucide-react";
import { CreateRouteForm } from "@/components/trip-management/CreateRouteForm";
import { RoutesList } from "@/components/trip-management/RoutesList";

const TripManagement = () => {
  const [showCreateRoute, setShowCreateRoute] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Trip Management</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
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
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Create New Route</CardTitle>
                  <CardDescription>Fill in the details to create a new collection route</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateRoute(false)}>
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
              <RoutesList status="active" />
            </TabsContent>
            <TabsContent value="upcoming" className="pt-4">
              <RoutesList status="upcoming" />
            </TabsContent>
            <TabsContent value="completed" className="pt-4">
              <RoutesList status="completed" />
            </TabsContent>
            <TabsContent value="routes" className="pt-4">
              <RoutesList status="all" />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default TripManagement;
