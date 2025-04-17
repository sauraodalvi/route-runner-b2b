import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Map, Truck, FileSpreadsheet, Download } from "lucide-react";

const B2BCollection = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">B2B Collection</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Trip Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Active trips today</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/trip-management">
                  <Map className="mr-2 h-4 w-4" />
                  Manage Trips
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Collection Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">152</div>
              <p className="text-xs text-muted-foreground">Total collections this month</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/collection-reports">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  View Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Export Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">Exportable records</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/b2b-collection/export">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Trip ID</th>
                      <th className="text-left p-4 font-medium">Client</th>
                      <th className="text-left p-4 font-medium">Stops</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4">2023-07-12</td>
                      <td className="p-4">TR-1001</td>
                      <td className="p-4">Acme Corp</td>
                      <td className="p-4">5</td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="p-4">
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/trip-management/details/1001">
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4">2023-07-11</td>
                      <td className="p-4">TR-1000</td>
                      <td className="p-4">TechSolutions Inc</td>
                      <td className="p-4">3</td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="p-4">
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/trip-management/details/1000">
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4">2023-07-10</td>
                      <td className="p-4">TR-999</td>
                      <td className="p-4">Global Health Ltd</td>
                      <td className="p-4">7</td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="p-4">
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/trip-management/details/999">
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default B2BCollection;
