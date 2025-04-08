
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, FileText, Truck, Users } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">152</div>
              <p className="text-xs text-muted-foreground">+2% from last month</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/registration">
                  <FileText className="mr-2 h-4 w-4" />
                  View Registrations
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">Today's appointments</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/appointments">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Appointments
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">B2B Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Active trips today</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/trip-management">
                  <Truck className="mr-2 h-4 w-4" />
                  Manage Trips
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
