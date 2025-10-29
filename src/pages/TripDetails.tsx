
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
  Building,
  Calendar as CalendarIcon,
  AlertCircle,
  FileSearch,
  Folder
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
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [selectedStop, setSelectedStop] = useState<any>(null);
  const [showAttachment, setShowAttachment] = useState<string | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [allAttachments, setAllAttachments] = useState<any[]>([]);
  const [stopAttachments, setStopAttachments] = useState<{[key: string]: any[]}>({});
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [showSampleDetails, setShowSampleDetails] = useState(false);
  const [showSamplesModal, setShowSamplesModal] = useState(false);
  const [selectedStopForSamples, setSelectedStopForSamples] = useState<any>(null);

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
        status: "active", // Can be 'active', 'completed', 'cancelled'
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
        notes: "All samples collected successfully. Minor delay due to traffic.",
        stopsList: [
          {
            id: 1,
            name: "Central Hospital",
            address: "123 Main St, Suite 400, New York, NY 10001",
            type: "pickup",
            samplesCollected: 8,
            samplesRegistered: 8,
            samplesUnregistered: 0,
            notes: "All samples collected on time",
            contactName: "Dr. Sarah Johnson",
            contactPhone: "+1 555-987-6543",
            samples: [
              { id: "S101", type: "Blood", collectedBy: "Dr. Sarah", time: "09:00 AM" },
              { id: "S102", type: "Urine", collectedBy: "Nurse Mike", time: "09:15 AM" },
              { id: "S103", type: "Tissue", collectedBy: "Dr. Sarah", time: "09:30 AM" }
            ],
            attachments: [
              { id: 101, name: "Collection Receipt", type: "pdf" },
              { id: 102, name: "Temperature Log", type: "xlsx" }
            ]
          },
          {
            id: 2,
            name: "City Lab",
            address: "456 Park Ave, New York, NY 10002",
            type: "pickup",
            samplesCollected: 15,
            samplesRegistered: 12,
            samplesUnregistered: 3,
            notes: "Delayed collection due to lab processing",
            contactName: "Lab Manager Mike",
            contactPhone: "+1 555-456-7890",
            samples: [
              { id: "S201", type: "Blood", collectedBy: "Lab Tech Jim", time: "11:00 AM" },
              { id: "S202", type: "Serum", collectedBy: "Lab Tech Anna", time: "11:15 AM" },
              { id: "S203", type: "Plasma", collectedBy: "Lab Tech Jim", time: "11:30 AM" },
              { id: "S204", type: "CSF", collectedBy: "Dr. Roberts", time: "11:45 AM" }
            ],
            attachments: [
              { id: 201, name: "Lab Manifest", type: "pdf" },
              { id: 202, name: "Sample Photos", type: "image" }
            ]
          },
          {
            id: 3,
            name: "Research Center",
            address: "555 Science Blvd, New York, NY 10012",
            type: "pickup",
            samplesCollected: 5,
            samplesRegistered: 5,
            samplesUnregistered: 0,
            notes: "Specialized samples requiring temperature control",
            contactName: "Dr. Emily Chen",
            contactPhone: "+1 555-222-3333",
            samples: [
              { id: "S301", type: "Tissue", collectedBy: "Dr. Chen", time: "13:00 PM" },
              { id: "S302", type: "RNA", collectedBy: "Lab Tech David", time: "13:15 PM" }
            ],
            attachments: [
              { id: 301, name: "Research Protocol", type: "pdf" },
              { id: 302, name: "Temperature Chart", type: "image" }
            ]
          },
          {
            id: 4,
            name: "Checkout Point",
            address: "789 Delivery St, New York, NY 10003",
            type: "checkout",
            notes: "Final delivery checkpoint",
            contactName: "Logistics Manager",
            contactPhone: "+1 555-789-1234"
            // No samples or attachments for checkout points
          }
        ]
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

  const openAttachmentsModal = (stop: any) => {
    // Organize all attachments by stop
    const attachmentsByStop: {[key: string]: any[]} = {};
    let firstAttachment = null;

    tripData?.stopsList?.forEach((s: any) => {
      if (s.attachments && s.attachments.length > 0) {
        // Add stop name to each attachment
        const stopsAttachments = s.attachments.map((attachment: any) => ({
          ...attachment,
          stopName: s.name,
          stopId: s.id.toString()
        }));

        attachmentsByStop[s.id.toString()] = stopsAttachments;

        if (!firstAttachment) {
          firstAttachment = stopsAttachments[0];
        }
      }
    });

    // Set the selected stop to the one that was clicked
    const stopId = stop ? stop.id.toString() : null;

    setStopAttachments(attachmentsByStop);
    setSelectedStopId(stopId);

    // If a specific stop was clicked, show its attachments
    if (stop && stop.attachments && stop.attachments.length > 0) {
      const stopsAttachments = stop.attachments.map((attachment: any) => ({
        ...attachment,
        stopName: stop.name,
        stopId: stop.id.toString()
      }));

      setAllAttachments(stopsAttachments);
      setSelectedAttachment(stopsAttachments[0]);
    } else if (firstAttachment) {
      // Otherwise show all attachments
      const allAttachmentsFlat = Object.values(attachmentsByStop).flat();
      setAllAttachments(allAttachmentsFlat);
      setSelectedAttachment(firstAttachment);
    }

    setShowAttachmentsModal(true);
  };

  const openAllAttachmentsModal = () => {
    // Open the modal with all stops
    openAttachmentsModal(null);
  };

  const selectStopAttachments = (stopId: string) => {
    setSelectedStopId(stopId);

    if (stopAttachments[stopId] && stopAttachments[stopId].length > 0) {
      setAllAttachments(stopAttachments[stopId]);
      setSelectedAttachment(stopAttachments[stopId][0]);
    }
  };

  const handleCancelTrip = () => {
    // Simulate cancelling the trip
    toast({
      title: "Trip Cancelled",
      description: `Trip ${tripData?.routeNo} has been cancelled.`,
    });
    // Close dialog and update trip status
    setShowCancelDialog(false);
    setTripData((prev: any) => ({...prev, status: 'cancelled'}));
  };

  const handleEditTrip = () => {
    // Simulate editing the trip
    toast({
      title: "Trip Edited",
      description: `Trip ${tripData?.routeNo} has been edited.`,
    });
    setShowEditDialog(false);
  };

  const handleOpenSampleDetails = (sampleId: string) => {
    setSelectedSample(sampleId);
    setShowSampleDetails(true);
  };

  const handleCloseSampleDetails = () => {
    setSelectedSample(null);
    setShowSampleDetails(false);
  };

  const handleViewSamples = (stop: any) => {
    setSelectedStopForSamples(stop);
    setShowSamplesModal(true);
  };

  const openStopDetails = (stop: any) => {
    setSelectedStop(stop);
  };

  const isTripCancellable = () => {
    return tripData?.status !== 'completed' && tripData?.status !== 'cancelled';
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
              <h1 className="text-2xl font-bold mr-2">{tripData?.routeName}</h1>
              <Badge variant={getBadgeVariant(tripData?.status)}>{tripData?.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Trip ID: {tripData?.routeNo}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Trip
            </Button>
            {isTripCancellable() && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowCancelDialog(true)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Trip
              </Button>
            )}
          </div>
        </div>

        {/* Trip Information Card - Improved UI */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg">Trip Information</CardTitle>
            <CardDescription>Essential details about this trip</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-5">
                <div className="flex items-start space-x-4">
                  <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-medium">{tripData?.date}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground mb-1">Created By</p>
                    <p className="font-medium">{tripData?.createdBy}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start space-x-4">
                  <Truck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground mb-1">Assigned Team</p>
                    <p className="font-medium">{tripData?.assignedTeam}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Building className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground mb-1">Partner</p>
                    <p className="font-medium">{tripData?.partnerName}</p>
                    {tripData?.partnerContact && (
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <Phone className="h-3 w-3 mr-1" />
                        {tripData.partnerContact}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground mb-1">Stops</p>
                    <p className="font-medium">{tripData?.stops}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground mb-1">Samples Collected</p>
                    <p className="font-medium">
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

        {/* Stops List - Each stop with its own details section */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Collection Stops</h2>
        <div className="space-y-6">
          {tripData?.stopsList?.map((stop: any, index: number) => (
            <Card key={stop.id} className="overflow-hidden bg-white shadow-sm">
              <CardHeader className={`bg-muted/30 pb-2 ${stop.type === 'checkout' ? 'bg-gray-50' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
                      {index + 1}
                    </div>
                    <CardTitle className="text-lg">{stop.name}</CardTitle>
                  </div>
                  {stop.type !== 'checkout' && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        Samples: {stop.samplesCollected}
                        {stop.samplesRegistered !== undefined && (
                          <span className="ml-1">
                            ({stop.samplesRegistered}/{stop.samplesUnregistered})
                          </span>
                        )}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleViewSamples(stop)}
                      >
                        <FileSearch className="h-3 w-3 mr-1" />
                        View Samples
                      </Button>
                    </div>
                  )}
                  {stop.type === 'checkout' && (
                    <Badge variant="outline" className="bg-gray-100">
                      Drop-off Point
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Stop information */}
                  <div className="lg:col-span-1">
                    <h3 className="font-medium text-sm mb-2">Stop Information</h3>
                    <p className="text-sm text-muted-foreground flex items-start mb-2">
                      <MapPin className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
                      <span>{stop.address}</span>
                    </p>
                    {stop.contactName && (
                      <p className="text-sm text-muted-foreground flex items-center mb-2">
                        <User className="h-3 w-3 mr-1 flex-shrink-0" />
                        {stop.contactName}
                      </p>
                    )}
                    {stop.contactPhone && (
                      <p className="text-sm text-muted-foreground flex items-center mb-2">
                        <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                        {stop.contactPhone}
                      </p>
                    )}
                  </div>

                  {/* Stop notes */}
                  <div className="lg:col-span-2">
                    <h3 className="font-medium text-sm mb-2">Notes</h3>
                    <div className="bg-muted/20 p-3 rounded-md">
                      <p className="text-sm">{stop.notes || "No notes for this stop."}</p>
                    </div>
                  </div>
                </div>

                {/* Only show tabs for samples and attachments if this is not a checkout point */}
                {stop.type !== 'checkout' && (
                  <Tabs defaultValue="samples" className="mt-6">
                    <TabsList className="w-full sm:w-auto mb-2">
                      <TabsTrigger value="samples">Samples ({stop.samples?.length || 0})</TabsTrigger>
                      <TabsTrigger value="attachments">Attachments ({stop.attachments?.length || 0})</TabsTrigger>
                    </TabsList>

                    {/* Samples tab content */}
                    <TabsContent value="samples" className="mt-4 pt-2">
                      {stop.samples && stop.samples.length > 0 ? (
                        <div className="rounded-md border overflow-hidden">
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
                              {stop.samples.map((sample: any) => (
                                <TableRow key={sample.id}>
                                  <TableCell className="font-medium">{sample.id}</TableCell>
                                  <TableCell>{sample.type}</TableCell>
                                  <TableCell>{sample.collectedBy}</TableCell>
                                  <TableCell>{sample.time}</TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="link"
                                      className="p-0 h-auto font-medium text-primary hover:underline"
                                      onClick={() => handleOpenSampleDetails(sample.id)}
                                    >
                                      View
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No samples collected at this stop.</p>
                      )}
                    </TabsContent>

                    {/* Attachments tab content */}
                    <TabsContent value="attachments" className="mt-4 pt-2">
                      {stop.attachments && stop.attachments.length > 0 ? (
                        <div className="space-y-3">
                          {stop.attachments.map((attachment: any) => (
                            <div key={attachment.id} className="flex items-center justify-between border-b pb-3">
                              <div className="flex items-center space-x-2">
                                {attachment.type === "pdf" && <FileText className="h-5 w-5 text-red-500" />}
                                {attachment.type === "xlsx" && <FileText className="h-5 w-5 text-green-500" />}
                                {attachment.type === "image" && <FileImage className="h-5 w-5 text-blue-500" />}
                                <p className="font-medium">{attachment.name}</p>
                                <Badge variant="outline" className="text-xs">{attachment.type.toUpperCase()}</Badge>
                              </div>
                              <div className="flex space-x-4">
                                <Button
                                  variant="link"
                                  className="p-0 h-auto font-medium text-primary hover:underline"
                                  onClick={() => openAttachmentsModal(stop)}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="link"
                                  className="p-0 h-auto font-medium text-primary hover:underline"
                                  onClick={() => handleDownloadAttachment(attachment.id)}
                                >
                                  Download
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No attachments for this stop.</p>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
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

      {/* Attachments Modal with Hierarchical Navigation */}
      <Dialog open={showAttachmentsModal} onOpenChange={setShowAttachmentsModal}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[80vh] p-0 overflow-hidden">
          <div className="flex h-[80vh]">
            {/* Left sidebar with stops and attachment list */}
            <div className="w-72 border-r bg-gray-50 overflow-hidden flex flex-col">
              {/* Stops navigation */}
              <div className="p-4 border-b bg-white sticky top-0 z-10">
                <h3 className="font-medium">Trip Stops</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {Object.keys(stopAttachments).length} stops with attachments
                </p>
              </div>

              <div className="overflow-y-auto">
                <div className="divide-y">
                  {/* All attachments option */}
                  <div
                    className={`p-3 cursor-pointer hover:bg-gray-100 ${!selectedStopId ? 'bg-gray-100 border-l-4 border-primary' : ''}`}
                    onClick={() => openAttachmentsModal(null)}
                  >
                    <div className="flex items-center space-x-2">
                      <Folder className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">All Attachments</p>
                        <p className="text-xs text-muted-foreground">
                          {Object.values(stopAttachments).flat().length} total files
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* List of stops with attachments */}
                  {tripData?.stopsList?.filter((stop: any) =>
                    stop.attachments && stop.attachments.length > 0
                  ).map((stop: any) => (
                    <div
                      key={stop.id}
                      className={`p-3 cursor-pointer hover:bg-gray-100 ${selectedStopId === stop.id.toString() ? 'bg-gray-100 border-l-4 border-primary' : ''}`}
                      onClick={() => selectStopAttachments(stop.id.toString())}
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{stop.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {stop.attachments.length} attachment{stop.attachments.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachments for selected stop */}
              {allAttachments.length > 0 && (
                <div className="border-t flex-1 overflow-hidden flex flex-col">
                  <div className="p-3 bg-gray-100 border-b">
                    <h4 className="text-sm font-medium">Attachments</h4>
                    <p className="text-xs text-muted-foreground">{allAttachments.length} items</p>
                  </div>
                  <div className="overflow-y-auto flex-1 divide-y">
                    {allAttachments.map((attachment, index) => (
                      <div
                        key={attachment.id}
                        className={`p-3 cursor-pointer hover:bg-gray-100 ${selectedAttachment?.id === attachment.id ? 'bg-gray-100' : ''}`}
                        onClick={() => setSelectedAttachment(attachment)}
                      >
                        <div className="flex items-center space-x-2">
                          {attachment.type === "pdf" && <FileText className="h-5 w-5 text-red-500" />}
                          {attachment.type === "xlsx" && <FileText className="h-5 w-5 text-green-500" />}
                          {attachment.type === "image" && <FileImage className="h-5 w-5 text-blue-500" />}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{attachment.name}</p>
                            {!selectedStopId && attachment.stopName && (
                              <p className="text-xs text-muted-foreground truncate">{attachment.stopName}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedAttachment ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <div>
                      <h2 className="text-lg font-semibold">{selectedAttachment?.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedAttachment?.type.toUpperCase()} •
                        {selectedAttachment?.stopName && `From: ${selectedAttachment.stopName}`}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadAttachment(selectedAttachment?.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <DialogClose asChild>
                        <Button variant="ghost" size="sm">Close</Button>
                      </DialogClose>
                    </div>
                  </div>

                  {/* Preview area */}
                  <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-gray-50">
                    {selectedAttachment?.type === "image" ? (
                      <div className="max-h-full max-w-full overflow-hidden rounded-md shadow-lg">
                        <img
                          src={`/images/${selectedAttachment.name}`}
                          alt={selectedAttachment.name}
                          className="max-h-[60vh] max-w-full object-contain"
                        />
                      </div>
                    ) : selectedAttachment?.type === "pdf" ? (
                      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-3xl">
                        <div className="flex items-center justify-center h-[50vh] border-2 border-dashed border-gray-300 rounded-md">
                          <div className="text-center">
                            <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h3 className="font-medium text-lg mb-2">{selectedAttachment.name}</h3>
                            <p className="text-muted-foreground mb-4">PDF Preview not available</p>
                            <Button
                              variant="outline"
                              onClick={() => handleDownloadAttachment(selectedAttachment?.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download to View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-3xl">
                        <div className="flex items-center justify-center h-[50vh] border-2 border-dashed border-gray-300 rounded-md">
                          <div className="text-center">
                            <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                            <h3 className="font-medium text-lg mb-2">{selectedAttachment?.name}</h3>
                            <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
                            <Button
                              variant="outline"
                              onClick={() => handleDownloadAttachment(selectedAttachment?.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download to View
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <div className="text-center p-8">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Attachment Selected</h3>
                    <p className="text-muted-foreground max-w-md">
                      Select a stop from the sidebar to view its attachments, or choose an attachment to preview it here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
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

              {/* Find the sample across all stops */}
              {(() => {
                let sample;
                for (const stop of tripData?.stopsList || []) {
                  sample = stop.samples?.find((s: any) => s.id === selectedSample);
                  if (sample) break;
                }
                return sample ? (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sampleType" className="text-right">
                        Type
                      </Label>
                      <Input type="text" id="sampleType" value={sample.type} readOnly className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="collectedBy" className="text-right">
                        Collected By
                      </Label>
                      <Input type="text" id="collectedBy" value={sample.collectedBy} readOnly className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="collectionTime" className="text-right">
                        Collection Time
                      </Label>
                      <Input type="text" id="collectionTime" value={sample.time} readOnly className="col-span-3" />
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          )}
          <DialogFooter>
            <Button type="button" onClick={handleCloseSampleDetails}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Samples Modal */}
      <Dialog open={showSamplesModal} onOpenChange={setShowSamplesModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Samples Details</DialogTitle>
          </DialogHeader>

          {selectedStopForSamples && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{selectedStopForSamples.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStopForSamples.address}</p>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Samples Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Collected</p>
                    <p className="text-lg font-medium">{selectedStopForSamples.samplesCollected}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registered</p>
                    <p className="text-lg font-medium">{selectedStopForSamples.samplesRegistered}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unregistered</p>
                    <div className="flex items-center">
                      <p className="text-lg font-medium">{selectedStopForSamples.samplesUnregistered || 0}</p>
                      {selectedStopForSamples.samplesUnregistered > 0 && (
                        <AlertCircle className="h-4 w-4 ml-2 text-destructive" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedStopForSamples.samples && selectedStopForSamples.samples.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-medium">Sample Details</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sample ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Collected By</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedStopForSamples.samples.map((sample: any) => (
                        <TableRow key={sample.id}>
                          <TableCell className="font-medium">{sample.id}</TableCell>
                          <TableCell>{sample.type}</TableCell>
                          <TableCell>{sample.collectedBy}</TableCell>
                          <TableCell>{sample.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No detailed sample information available.</p>
              )}

              {selectedStopForSamples.samplesUnregistered > 0 && (
                <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Attention Required</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        This stop has {selectedStopForSamples.samplesUnregistered} unregistered samples that need to be processed.
                        Please register these samples as soon as possible.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
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
    case 'pending':
      return 'outline';
    default:
      return 'outline';
  }
};

export default TripDetails;
