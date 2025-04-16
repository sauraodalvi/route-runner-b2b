import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
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
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
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
  Info
} from "lucide-react";

interface TripDetailsModalProps {
  tripId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditTrip: (trip: any) => void;
}

export function TripDetailsModal({ tripId, open, onOpenChange, onEditTrip }: TripDetailsModalProps) {
  const [tripData, setTripData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSampleDetails, setShowSampleDetails] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [showAttachment, setShowAttachment] = useState<string | null>(null);

  useEffect(() => {
    if (open && tripId) {
      setLoading(true);
      // Simulate fetching trip data
      setTimeout(() => {
        // This would be a real API call in production
        const mockTripData = {
          id: tripId,
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
              samplesCollected: 8,
              samplesRegistered: 8,
              samplesUnregistered: 0,
              status: "on-time", // "on-time", "delayed", "critical"
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
              samplesCollected: 15,
              samplesRegistered: 12,
              samplesUnregistered: 3,
              status: "delayed", // "on-time", "delayed", "critical"
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
              name: "Checkout Point", 
              address: "789 Delivery St, New York, NY 10003",
              type: "checkout",
              status: "on-time", // "on-time", "delayed", "critical"
              notes: "Final delivery checkpoint",
              contactName: "Logistics Manager",
              contactPhone: "+1 555-789-1234"
              // No samples or attachments for checkout points
            }
          ]
        };
        setTripData(mockTripData);
        setLoading(false);
      }, 1000);
    }
  }, [open, tripId]);

  const handleCancelTrip = () => {
    if (!tripData) return;
    
    // In a real app, this would call an API to cancel the trip
    toast({
      title: "Trip Cancelled",
      description: `Trip ${tripData.routeNo} has been cancelled.`,
    });
    
    // Update trip status locally
    setTripData({
      ...tripData,
      status: 'cancelled'
    });
    
    setShowCancelDialog(false);
  };

  const handleConfirmCollection = () => {
    if (!tripData) return;
    
    // In a real app, this would call an API to confirm collection
    toast({
      title: "Collection Confirmed",
      description: `Trip ${tripData.routeNo} has been marked as completed.`,
    });
    
    // Update trip status locally
    setTripData({
      ...tripData,
      status: 'completed'
    });
  };

  const handleDownloadSummary = () => {
    if (!tripData) return;
    
    // In a real app, this would generate and download a trip summary
    toast({
      title: "Generating Summary",
      description: "Your trip summary is being generated...",
    });
    
    setTimeout(() => {
      toast({
        title: "Download Ready",
        description: "Your trip summary has been downloaded.",
      });
    }, 1500);
  };

  const handleEditTrip = () => {
    if (!tripData) return;
    onEditTrip(tripData);
    onOpenChange(false);
  };

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

  const handleOpenSampleDetails = (sampleId: string) => {
    setSelectedSample(sampleId);
    setShowSampleDetails(true);
  };

  const handleCloseSampleDetails = () => {
    setSelectedSample(null);
    setShowSampleDetails(false);
  };

  const isTripCancellable = () => {
    return tripData?.status !== 'completed' && tripData?.status !== 'cancelled';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-time':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'delayed':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-time':
        return "On Time";
      case 'delayed':
        return "Minor Delay";
      case 'critical':
        return "Critical Delay";
      default:
        return "On Time";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time':
        return "bg-green-500";
      case 'delayed':
        return "bg-yellow-500";
      case 'critical':
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  const renderSamples = (samples: any[]) => {
    const registeredSamples = samples.filter(s => s.id);
    const unregisteredSamples = samples.filter(s => !s.id);
    
    return (
      <div className="space-y-4">
        {registeredSamples.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Registered Samples</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registeredSamples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.id}</TableCell>
                    <TableCell>{sample.type}</TableCell>
                    <TableCell>{sample.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {unregisteredSamples.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Unregistered Samples</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unregisteredSamples.map((sample, index) => (
                  <TableRow key={`unregistered-${index}`}>
                    <TableCell>{sample.type}</TableCell>
                    <TableCell>{sample.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!tripData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium">Trip Not Found</h3>
            <p className="text-muted-foreground mt-2">
              The requested trip could not be found or has been deleted.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto px-2 sm:px-6 py-4">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center">
              <DialogTitle className="text-xl mr-2">{tripData.routeName}</DialogTitle>
              <Badge variant={getBadgeVariant(tripData.status)}>{tripData.status}</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              {tripData.date}
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p><span className="font-medium">Trip ID:</span> {tripData.routeNo}</p>
                      <p><span className="font-medium">Partner:</span> {tripData.partnerName}</p>
                      <p><span className="font-medium">Contact:</span> {tripData.partnerContact}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </DialogHeader>
                
        <Tabs defaultValue="info" className="pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="info">Trip Info</TabsTrigger>
            <TabsTrigger value="stops">Collection Stops</TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>
                    
          <TabsContent value="info" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Truck className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned Team</p>
                    <p className="font-medium">{tripData.assignedTeam}</p>
                  </div>
                </div>
              </div>
                        
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Stops</p>
                    <p className="font-medium">{tripData.stops}</p>
                  </div>
                </div>
              </div>
                        
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FileText className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Samples</p>
                    <p className="font-medium">
                      Total: {tripData.samplesCollected}
                      <span className="text-sm ml-2">
                        (Registered: {tripData.samplesRegistered} / 
                        Unregistered: {tripData.samplesUnregistered})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
                    
          <TabsContent value="stops" className="pt-4">
            {tripData.stopsList.map((stop) => (
              <Accordion key={stop.id} type="single" collapsible className="bg-white border rounded-md overflow-hidden">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="px-4 py-2 hover:bg-muted/20 [&[data-state=open]>svg]:rotate-180">
                    <div className="flex flex-1 items-center">
                      <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-3">
                        {stop.id}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{stop.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {stop.address}
                        </div>
                      </div>
                      {stop.type !== 'checkout' && (
                        <div className="flex items-center space-x-4 mr-6">
                          <Badge className={getStatusColor(stop.status)}>
                            <div className="flex items-center">
                              {getStatusIcon(stop.status)}
                              <span className="ml-1">{getStatusText(stop.status)}</span>
                            </div>
                          </Badge>
                          <div className="text-sm">
                            Samples: <span className="font-medium">{stop.samplesCollected || 0}</span>
                          </div>
                        </div>
                      )}
                      {stop.type === 'checkout' && (
                        <Badge variant="outline" className="mr-6">Checkout Point</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-1 pb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                        {stop.contactName && (
                          <p className="text-sm flex items-center mb-1">
                            <User className="h-3 w-3 mr-2" />
                            {stop.contactName}
                          </p>
                        )}
                        {stop.contactPhone && (
                          <p className="text-sm flex items-center">
                            <Phone className="h-3 w-3 mr-2" />
                            {stop.contactPhone}
                          </p>
                        )}
                      </div>
                      
                      {stop.notes && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Notes</h4>
                          <p className="text-sm">{stop.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    {stop.type !== 'checkout' && (
                      <div className="mt-4">
                        <Tabs defaultValue="samples" className="w-full">
                          <TabsList className="w-full mb-2">
                            <TabsTrigger value="samples">Samples ({stop.samples?.length || 0})</TabsTrigger>
                            <TabsTrigger value="attachments">Attachments ({stop.attachments?.length || 0})</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="samples" className="pt-2">
                            {stop.samples && stop.samples.length > 0 ? (
                              <div className="border rounded-md overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Sample ID</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>Time</TableHead>
                                      <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {stop.samples.map((sample: any) => (
                                      <TableRow key={sample.id}>
                                        <TableCell className="font-medium">{sample.id}</TableCell>
                                        <TableCell>{sample.type}</TableCell>
                                        <TableCell>{sample.time}</TableCell>
                                        <TableCell className="text-right">
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => handleOpenSampleDetails(sample.id)}
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground py-2">No samples collected at this stop.</p>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="attachments" className="pt-2">
                            {stop.attachments && stop.attachments.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {stop.attachments.map((attachment: any) => (
                                  <div key={attachment.id} className="flex items-center justify-between p-2 border rounded-md">
                                    <div className="flex items-center">
                                      {attachment.type === "pdf" && <FileText className="h-5 w-5 text-red-500 mr-2" />}
                                      {attachment.type === "xlsx" && <FileText className="h-5 w-5 text-green-500 mr-2" />}
                                      {attachment.type === "image" && <FileImage className="h-5 w-5 text-blue-500 mr-2" />}
                                      <div>
                                        <p className="text-sm font-medium">{attachment.name}</p>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Badge variant="outline" className="text-xs">{attachment.type.toUpperCase()}</Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>{getFileTypeDescription(attachment.type)}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>
                                    </div>
                                    <div className="flex space-x-1">
                                      <Button variant="ghost" size="icon" onClick={() => handleViewAttachment(attachment)}>
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => handleDownloadAttachment(attachment.id)}>
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground py-2">No attachments for this stop.</p>
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </TabsContent>
                    
          <TabsContent value="samples" className="pt-4">
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tripData.stopsList
                    .filter((stop: any) => stop.samples)
                    .flatMap((stop: any) => 
                      stop.samples.map((sample: any) => ({
                        ...sample,
                        location: stop.name
                      }))
                    )
                    .map((sample: any) => (
                      <TableRow key={sample.id}>
                        <TableCell className="font-medium">{sample.id}</TableCell>
                        <TableCell>{sample.type}</TableCell>
                        <TableCell>{sample.location}</TableCell>
                        <TableCell>{sample.time}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenSampleDetails(sample.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
                    
          <TabsContent value="attachments" className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {tripData.stopsList
                .filter((stop: any) => stop.attachments)
                .flatMap((stop: any) => 
                  stop.attachments.map((attachment: any) => ({
                    ...attachment,
                    location: stop.name
                  }))
                )
                .map((attachment: any) => (
                  <div key={attachment.id} className="flex flex-col p-3 border rounded-md">
                    <div className="flex items-center mb-2">
                      {attachment.type === "pdf" && <FileText className="h-6 w-6 text-red-500 mr-2" />}
                      {attachment.type === "xlsx" && <FileText className="h-6 w-6 text-green-500 mr-2" />}
                      {attachment.type === "image" && <FileImage className="h-6 w-6 text-blue-500 mr-2" />}
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <Badge variant="outline" className="text-xs">{attachment.type.toUpperCase()}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Location: {attachment.location}
                    </p>
                    <div className="flex mt-auto space-x-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewAttachment(attachment)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownloadAttachment(attachment.id)}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            
            {tripData.stopsList.every((stop: any) => !stop.attachments || stop.attachments.length === 0) && (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No attachments available for this trip</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
                
        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 mt-4 border-t">
          <div className="flex flex-1 gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleDownloadSummary}>
              <Download className="mr-2 h-4 w-4" />
              Download Summary
            </Button>
          </div>
          <div className="flex gap-2">
            {isTripCancellable() && (
              <Button variant="destructive" size="sm" onClick={() => setShowCancelDialog(true)}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Trip
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleEditTrip}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Trip
            </Button>
            {tripData.status === 'active' && (
              <Button size="sm" onClick={handleConfirmCollection}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Collection
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
            
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
            
    <AlertDialog open={showSampleDetails} onOpenChange={setShowSampleDetails}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Sample Details</AlertDialogTitle>
        </AlertDialogHeader>
        {selectedSample && (() => {
          for (const stop of tripData.stopsList) {
            if (!stop.samples) continue;
            const sample = stop.samples.find((s: any) => s.id === selectedSample);
            if (sample) {
              return (
                <div className="space-y-3 py-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sample ID:</span>
                    <span className="font-medium">{sample.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="font-medium">{sample.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Collected By:</span>
                    <span className="font-medium">{sample.collectedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Collection Time:</span>
                    <span className="font-medium">{sample.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="font-medium">{stop.name}</span>
                  </div>
                </div>
              );
            }
          }
          return null;
        })()}
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleCloseSampleDetails}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
            
    <Dialog open={showAttachment !== null} onOpenChange={(open) => {
      if (!open) setShowAttachment(null);
    }}>
      <DialogContent className="sm:max-w-[75%] lg:max-w-[50%]">
        <DialogHeader>
          <DialogTitle>Attachment Preview</DialogTitle>
        </DialogHeader>
        {showAttachment && (
          <div className="overflow-hidden rounded-md">
            <img src={`/images/${showAttachment}`} alt="Attachment Preview" className="w-full object-contain max-h-[60vh]" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

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

const getFileTypeDescription = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'Adobe PDF Document';
    case 'xlsx':
      return 'Microsoft Excel Spreadsheet';
    case 'image':
      return 'Image File';
    default:
      return 'Document';
  }
};
