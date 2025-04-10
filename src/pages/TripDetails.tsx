
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Edit, Eye, FileText, PaperclipIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatISO, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface Stop {
  id: number;
  name: string;
  address: string;
  distanceFromPrevious: string;
  timeSpent: string;
  reachedAt: string;
  registeredSamples: number;
  unregisteredSamples: number;
  attachments: string[];
  status: "completed" | "pending" | "inprogress";
}

interface Sample {
  id: string;
  accessionNumber: string;
  organizationName: string;
  patientName: string;
  tests: string[];
  sampleType: string;
}

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState<any>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [showViewAttachment, setShowViewAttachment] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [showSamplesDialog, setShowSamplesDialog] = useState(false);
  const [selectedStopSamples, setSelectedStopSamples] = useState<Sample[]>([]);
  const [selectedStopName, setSelectedStopName] = useState("");

  // Simulate fetching trip data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setTripData({
        id: id || "TR-004-1234",
        routeName: "Test Route",
        status: "inprogress",
        assignedPartner: "Pickup Partner 1",
        partnerContact: "1231231231",
        date: formatISO(new Date(), { representation: 'date' }),
      });
      
      // Create dummy stops data
      const dummyStops: Stop[] = [
        {
          id: 1,
          name: "Baner Biz Bay",
          address: "Address lorem ipsum dolor sit amet",
          distanceFromPrevious: "4 Kms",
          timeSpent: "25 mins",
          reachedAt: "9:00 AM",
          registeredSamples: 0,
          unregisteredSamples: 0,
          attachments: ["location_photo.jpg"],
          status: "completed"
        },
        {
          id: 2,
          name: "Org 1",
          address: "Address lorem ipsum dolor sit amet",
          distanceFromPrevious: "10 Kms",
          timeSpent: "25 mins",
          reachedAt: "10:00 AM",
          registeredSamples: 10,
          unregisteredSamples: 20,
          attachments: ["samples_list.pdf", "signature.jpg"],
          status: "completed"
        },
        {
          id: 3,
          name: "Org 2",
          address: "Address lorem ipsum dolor sit amet",
          distanceFromPrevious: "4 Kms",
          timeSpent: "30 mins",
          reachedAt: "1:00 PM",
          registeredSamples: 2,
          unregisteredSamples: 1,
          attachments: ["receipt.pdf"],
          status: "completed"
        },
        {
          id: 4,
          name: "Org 3",
          address: "Address lorem ipsum dolor sit amet",
          distanceFromPrevious: "4 Kms",
          timeSpent: "25 mins",
          reachedAt: "4:00 PM",
          registeredSamples: 0,
          unregisteredSamples: 0,
          attachments: [],
          status: "completed"
        },
        {
          id: 5,
          name: "Org 4",
          address: "Address lorem ipsum dolor sit amet",
          distanceFromPrevious: "4 Kms",
          timeSpent: "25 mins",
          reachedAt: "6:00 PM",
          registeredSamples: 0,
          unregisteredSamples: 0,
          attachments: [],
          status: "inprogress"
        },
        {
          id: 6,
          name: "End Location",
          address: "Address lorem ipsum dolor sit amet",
          distanceFromPrevious: "4 Kms",
          timeSpent: "",
          reachedAt: "8:00 PM",
          registeredSamples: 0,
          unregisteredSamples: 0,
          attachments: [],
          status: "pending"
        }
      ];
      
      setStops(dummyStops);
    }, 500);
  }, [id]);

  const viewAttachment = (attachmentName: string) => {
    setSelectedAttachment(attachmentName);
    setShowViewAttachment(true);
  };

  const viewSamples = (stopId: number, stopName: string) => {
    // In a real app, this would be an API call to get samples for this stop
    const dummySamples: Sample[] = [];
    
    // Create random number of samples (between 1 and 20)
    const sampleCount = stopId === 2 ? 10 : (stopId === 3 ? 3 : Math.floor(Math.random() * 5) + 1);
    
    const sampleTypes = ["Blood", "Urine", "Tissue", "Saliva", "CSF"];
    const testNames = ["CBC", "Lipid Panel", "Metabolic Panel", "Thyroid Panel", "Vitamin D", "Iron", "A1C"];
    
    for (let i = 1; i <= sampleCount; i++) {
      const randomTests = [];
      const testCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < testCount; j++) {
        const randomTest = testNames[Math.floor(Math.random() * testNames.length)];
        if (!randomTests.includes(randomTest)) {
          randomTests.push(randomTest);
        }
      }
      
      dummySamples.push({
        id: `S-${stopId}-${i}`,
        accessionNumber: `ACC-${new Date().getFullYear()}-${10000 + i + (stopId * 100)}`,
        organizationName: `Organization ${stopId}`,
        patientName: `Patient ${i}`,
        tests: randomTests,
        sampleType: sampleTypes[Math.floor(Math.random() * sampleTypes.length)]
      });
    }
    
    setSelectedStopSamples(dummySamples);
    setSelectedStopName(stopName);
    setShowSamplesDialog(true);
  };

  const handleEditTrip = () => {
    // Navigate back to trip management with edit mode
    navigate(`/trip-management?edit=${id}`);
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Exporting trip details to Excel...",
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Trip details have been exported successfully",
      });
    }, 1500);
  };

  if (!tripData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading trip details...</p>
        </div>
      </MainLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "inprogress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-red-100 text-red-800">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/trip-management">Route Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Trip {id}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/trip-management')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold">Trip Details</h1>
            {tripData.status && (
              <Badge className={`
                ${tripData.status === "inprogress" ? "bg-yellow-100 text-yellow-800" : ""}
                ${tripData.status === "completed" ? "bg-green-100 text-green-800" : ""}
                ${tripData.status === "pending" ? "bg-red-100 text-red-800" : ""}
              `}>
                {tripData.status === "inprogress" ? "In Progress" : 
                  tripData.status.charAt(0).toUpperCase() + tripData.status.slice(1)}
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={handleEditTrip}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Trip Info Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Trip Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Trip ID</h3>
                <p className="mt-1">{tripData.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Route Name</h3>
                <p className="mt-1">{tripData.routeName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned Pickup Partner</h3>
                <p className="mt-1">{tripData.assignedPartner}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned Pickup Contact</h3>
                <p className="mt-1">{tripData.partnerContact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trip Overview */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Trip Overview</h2>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Distance from Previous Location</TableHead>
                  <TableHead>Time Spent</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Reach at</TableHead>
                  <TableHead>Registered Samples</TableHead>
                  <TableHead>Unregistered Samples</TableHead>
                  <TableHead>Attachment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stops.map((stop) => (
                  <TableRow key={stop.id}>
                    <TableCell className="font-medium">{stop.name}</TableCell>
                    <TableCell>{stop.distanceFromPrevious}</TableCell>
                    <TableCell>{stop.timeSpent}</TableCell>
                    <TableCell>{stop.address}</TableCell>
                    <TableCell>{stop.reachedAt}</TableCell>
                    <TableCell>{stop.registeredSamples}</TableCell>
                    <TableCell>{stop.unregisteredSamples}</TableCell>
                    <TableCell>{stop.attachments.length}</TableCell>
                    <TableCell>{getStatusBadge(stop.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => viewSamples(stop.id, stop.name)}
                        >
                          View Samples
                        </Button>
                        {stop.attachments.length > 0 && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => viewAttachment(stop.attachments[0])}
                          >
                            Attachment
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* View Attachment Dialog */}
        <Dialog open={showViewAttachment} onOpenChange={setShowViewAttachment}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Attachment: {selectedAttachment}</DialogTitle>
            </DialogHeader>
            <div className="min-h-[60vh] flex items-center justify-center bg-gray-100 rounded-md">
              {selectedAttachment && selectedAttachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img 
                    src={`/placeholder.svg`} 
                    alt={selectedAttachment} 
                    className="max-w-full max-h-[50vh] object-contain" 
                  />
                </div>
              ) : selectedAttachment && selectedAttachment.match(/\.(pdf)$/i) ? (
                <div className="text-center w-full">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">PDF Preview</p>
                  <div className="mt-4 bg-white p-4 rounded border max-h-[50vh] overflow-y-auto mx-auto max-w-lg">
                    <div className="h-96 border-b mb-4 flex items-center justify-center bg-gray-50">
                      <p className="text-gray-400">Page 1</p>
                    </div>
                    <div className="h-96 mb-4 flex items-center justify-center bg-gray-50">
                      <p className="text-gray-400">Page 2</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Preview not available for {selectedAttachment}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => {
                toast({
                  title: "Download Started",
                  description: `Downloading ${selectedAttachment}`,
                });
                setShowViewAttachment(false);
              }}>
                Download File
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Samples Dialog */}
        <Dialog open={showSamplesDialog} onOpenChange={setShowSamplesDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Samples from {selectedStopName}</DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Accession Number</TableHead>
                    <TableHead>Organization Name</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Sample Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedStopSamples.map((sample) => (
                    <TableRow key={sample.id}>
                      <TableCell>{sample.accessionNumber}</TableCell>
                      <TableCell>{sample.organizationName}</TableCell>
                      <TableCell>{sample.patientName}</TableCell>
                      <TableCell>{sample.tests.join(", ")}</TableCell>
                      <TableCell>{sample.sampleType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Download Started",
                  description: "Downloading sample list as Excel file",
                });
                setShowSamplesDialog(false);
              }}>
                <Download className="mr-2 h-4 w-4" />
                Download List
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default TripDetails;
