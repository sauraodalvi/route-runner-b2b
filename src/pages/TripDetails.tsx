
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Truck, 
  User, 
  Phone, 
  FileText, 
  FileImage, 
  Eye, 
  Download, 
  CheckCircle, 
  XCircle, 
  Edit, 
  AlertTriangle, 
  Building 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
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
        routeName: "Downtown Medical Collection",
        date: "2024-07-15",
        status: "active",
        assignedTeam: "FastTrack Logistics",
        partnerName: "MedLogistics Inc.",
        partnerContact: "+1 555-123-4567",
        driver: "John Doe",
        vehicle: "Truck ABC-123",
        stops: 5,
        samplesCollected: 23,
        samplesRegistered: 20,
        samplesUnregistered: 3,
        createdBy: "Admin User",
        attachments: [
          { id: 1, name: "Delivery Manifest", type: "pdf" },
          { id: 2, name: "Temperature Log", type: "xlsx" },
          { id: 3, name: "Photo of Package", type: "image" },
        ],
        notes: "All samples collected successfully. Minor delay due to traffic.",
        stopsList: [
          { 
            id: 1, 
            name: "Central Hospital", 
            address: "123 Main St, Suite 400, New York, NY 10001",
            samplesCollected: 8,
            samplesRegistered: 8,
            samplesUnregistered: 0,
            notes: "All samples collected on time",
            contactName: "Dr. Sarah Johnson",
            contactPhone: "+1 555-987-6543"
          },
          { 
            id: 2, 
            name: "City Lab", 
            address: "456 Park Ave, New York, NY 10002",
            samplesCollected: 15,
            samplesRegistered: 12,
            samplesUnregistered: 3,
            notes: "Delayed collection due to lab processing",
            contactName: "Lab Manager Mike",
            contactPhone: "+1 555-456-7890"
          },
        ],
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
      <div className="space-y-6 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2">
            <Link to="/trip-management" className="flex items-center text-muted-foreground hover:text-foreground w-fit">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Trip Management
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold mr-2">{tripData?.routeName}</h1>
              <Badge variant={getBadgeVariant(tripData?.status)}>{tripData?.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Trip ID: {tripData?.routeNo}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trip Information Card */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Trip Information</CardTitle>
              <CardDescription>Essential details about this trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">{tripData?.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Created By</p>
                      <p className="text-muted-foreground">{tripData?.createdBy}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Assigned Team</p>
                      <p className="text-muted-foreground">{tripData?.assignedTeam}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Partner</p>
                      <p className="text-muted-foreground">{tripData?.partnerName}</p>
                      {tripData?.partnerContact && (
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {tripData.partnerContact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Stops</p>
                      <p className="text-muted-foreground">{tripData?.stops}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Samples Collected</p>
                      <p className="text-muted-foreground">
                        Total: {tripData?.samplesCollected} 
                        {tripData?.samplesRegistered !== undefined && (
                          <span className="text-sm ml-2">
                            (Registered: {tripData.samplesRegistered} / 
                            Unregistered: {tripData.samplesUnregistered})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stops List */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Stops</CardTitle>
              <CardDescription>Collection points for this trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tripData?.stopsList?.map((stop: any, index: number) => (
                  <Card key={stop.id} className="overflow-hidden">
                    <div className="border-l-4 border-primary p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
                              {index + 1}
                            </div>
                            <h3 className="font-medium">{stop.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="break-words">{stop.address}</span>
                          </p>
                          {stop.contactName && (
                            <p className="text-sm text-muted-foreground mt-1 flex items-center">
                              <User className="h-3 w-3 mr-1 flex-shrink-0" />
                              {stop.contactName}
                              {stop.contactPhone && (
                                <span className="ml-2 flex items-center">
                                  <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                                  {stop.contactPhone}
                                </span>
                              )}
                            </p>
                          )}
                        </div>

                        <div className="mt-2 md:mt-0">
                          <Badge variant="outline" className="mb-1">
                            Samples: {stop.samplesCollected}
                            {stop.samplesRegistered !== undefined && (
                              <span className="ml-1">
                                ({stop.samplesRegistered}/{stop.samplesUnregistered})
                              </span>
                            )}
                          </Badge>
                          {stop.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              <span className="font-medium">Notes:</span> {stop.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="samples" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="samples">Samples</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="samples" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Samples Collected</CardTitle>
                <CardDescription>List of samples collected during this trip</CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                <div className="rounded-md border">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="attachments" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>Documents and images related to this trip</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tripData?.attachments.map((attachment: any) => (
                    <div key={attachment.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-2">
                        {attachment.type === "pdf" && <FileText className="h-5 w-5 text-red-500" />}
                        {attachment.type === "xlsx" && <FileText className="h-5 w-5 text-green-500" />}
                        {attachment.type === "image" && <FileImage className="h-5 w-5 text-blue-500" />}
                        <p className="font-medium">{attachment.name}</p>
                        <Badge variant="outline" className="text-xs">{attachment.type.toUpperCase()}</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewAttachment(attachment)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadAttachment(attachment.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                <p>{tripData?.notes || "No notes available for this trip."}</p>
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
            <DialogDescription>
              Make changes to this trip's information and stops
            </DialogDescription>
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
            <DialogDescription>
              Preview of the selected attachment
            </DialogDescription>
          </DialogHeader>
          {showAttachment && (
            <div className="overflow-hidden rounded-md">
              <img src={`/images/${showAttachment}`} alt="Attachment Preview" className="w-full object-contain max-h-[60vh]" />
            </div>
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
