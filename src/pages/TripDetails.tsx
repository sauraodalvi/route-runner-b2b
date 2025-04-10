
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, MapPin, Clock, Truck, User, Phone, FileText, FileImage, Eye, Download, CheckCircle, XCircle, Edit, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreateRouteForm } from "@/components/trip-management/CreateRouteForm";
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

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [tripData, setTripData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAttachment, setShowAttachment] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [showSampleDetails, setShowSampleDetails] = useState(false);

  useEffect(() => {
    // Simulate fetching trip data based on ID
    const fetchData = async () => {
      setLoading(true);
      // Replace this with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockTripData = {
        id: id,
        routeNo: "RTE-2024-123",
        date: "2024-07-15",
        status: "active",
        assignedTeam: "FastTrack Logistics",
        driver: "John Doe",
        vehicle: "Truck ABC-123",
        stops: 5,
        samplesCollected: 23,
        attachments: [
          { id: 1, name: "Delivery Manifest", type: "pdf" },
          { id: 2, name: "Temperature Log", type: "xlsx" },
          { id: 3, name: "Photo of Package", type: "image" },
        ],
        notes: "All samples collected successfully. Minor delay due to traffic.",
        samples: [
          { id: "S123", type: "Blood", collectedBy: "Nurse Jane", time: "09:30 AM" },
          { id: "S124", type: "Urine", collectedBy: "Dr. Smith", time: "10:15 AM" },
        ],
      };
      setTripData(mockTripData);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleDownloadAttachment = (attachmentId: number) => {
    // Simulate downloading attachment
    toast({
      title: "Download Started",
      description: `Downloading attachment ${attachmentId}...`,
    });
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `Attachment ${attachmentId} downloaded successfully.`,
      });
    }, 1500);
  };

  const handleViewAttachment = (attachment: any) => {
    setShowAttachment(attachment.type === "image" ? attachment.name : null);
  };

  const handleCancelTrip = () => {
    // Simulate cancelling the trip
    toast({
      title: "Trip Cancelled",
      description: `Trip ${tripData?.routeNo} has been cancelled.`,
    });
  };

  const handleEditTrip = () => {
    // Simulate editing the trip
    toast({
      title: "Trip Edited",
      description: `Trip ${tripData?.routeNo} has been edited.`,
    });
  };

  const handleOpenSampleDetails = (sampleId: string) => {
    setSelectedSample(sampleId);
    setShowSampleDetails(true);
  };

  const handleCloseSampleDetails = () => {
    setSelectedSample(null);
    setShowSampleDetails(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/trip-management" className="flex items-center text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Trip Management
            </Link>
            <h1 className="text-xl font-bold">Trip Details: {tripData?.routeNo}</h1>
            <Badge variant={getBadgeVariant(tripData?.status)}>{tripData?.status}</Badge>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Trip
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setShowCancelDialog(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Trip
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Trip Information</CardTitle>
                <CardDescription>Details about this trip</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Route Number</p>
                    <p className="text-muted-foreground">{tripData?.routeNo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-muted-foreground">{tripData?.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Assigned Team</p>
                    <p className="text-muted-foreground">{tripData?.assignedTeam}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-4">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Driver</p>
                      <p className="text-muted-foreground">{tripData?.driver}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Vehicle</p>
                      <p className="text-muted-foreground">{tripData?.vehicle}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Stops</p>
                    <p className="text-muted-foreground">{tripData?.stops}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Samples Collected</p>
                    <p className="text-muted-foreground">{tripData?.samplesCollected}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="samples" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Samples Collected</CardTitle>
                <CardDescription>List of samples collected during this trip</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sample ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Collected By</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tripData?.samples.map((sample: any) => (
                      <TableRow key={sample.id}>
                        <TableCell>{sample.id}</TableCell>
                        <TableCell>{sample.type}</TableCell>
                        <TableCell>{sample.collectedBy}</TableCell>
                        <TableCell>{sample.time}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenSampleDetails(sample.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="attachments" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>Documents and images related to this trip</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {tripData?.attachments.map((attachment: any) => (
                  <div key={attachment.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {attachment.type === "pdf" && <FileText className="h-4 w-4 text-muted-foreground" />}
                      {attachment.type === "xlsx" && <FileText className="h-4 w-4 text-muted-foreground" />}
                      {attachment.type === "image" && <FileImage className="h-4 w-4 text-muted-foreground" />}
                      <p className="text-sm font-medium">{attachment.name}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleViewAttachment(attachment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDownloadAttachment(attachment.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notes" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>Additional notes and observations</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{tripData?.notes}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Trip Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Trip: {tripData?.routeNo}</DialogTitle>
          </DialogHeader>
          <CreateRouteForm 
            onCancel={() => setShowEditDialog(false)} 
            initialData={tripData}
          />
        </DialogContent>
      </Dialog>

      {/* Cancel Trip Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this trip? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelTrip}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Attachment Preview Dialog */}
      <Dialog open={showAttachment !== null} onOpenChange={(open) => {
        if (!open) setShowAttachment(null);
      }}>
        <DialogContent className="sm:max-w-[75%] lg:max-w-[50%]">
          <DialogHeader>
            <DialogTitle>Attachment Preview</DialogTitle>
          </DialogHeader>
          {showAttachment && (
            <img src={`/images/${showAttachment}`} alt="Attachment Preview" className="w-full rounded-md" />
          )}
        </DialogContent>
      </Dialog>

      {/* Sample Details Dialog */}
      <Dialog open={showSampleDetails} onOpenChange={setShowSampleDetails}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sample Details</DialogTitle>
            <DialogDescription>Information about the selected sample</DialogDescription>
          </DialogHeader>
          {selectedSample && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sampleId" className="text-right">
                  Sample ID
                </Label>
                <Input type="text" id="sampleId" value={selectedSample} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sampleType" className="text-right">
                  Type
                </Label>
                <Input type="text" id="sampleType" value={tripData?.samples.find((s: any) => s.id === selectedSample)?.type} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="collectedBy" className="text-right">
                  Collected By
                </Label>
                <Input type="text" id="collectedBy" value={tripData?.samples.find((s: any) => s.id === selectedSample)?.collectedBy} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="collectionTime" className="text-right">
                  Collection Time
                </Label>
                <Input type="text" id="collectionTime" value={tripData?.samples.find((s: any) => s.id === selectedSample)?.time} readOnly className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" onClick={handleCloseSampleDetails}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

// Helper function to determine badge variant based on status
const getBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'cancelled':
      return 'destructive';
    case 'upcoming':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default TripDetails;
