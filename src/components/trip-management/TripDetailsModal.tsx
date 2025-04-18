import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  AlertCircle,
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
  const [assignedTeam, setAssignedTeam] = useState("");

  // Available teams for dropdown
  const availableTeams = [
    "Team Alpha",
    "Team Beta",
    "Team Gamma",
    "Team Delta",
    "FastTrack Logistics",
    "MedExpress Team",
    "QuickSample Collectors"
  ];
  const [isEditingAssignedTeam, setIsEditingAssignedTeam] = useState(false);
  const [selectedStop, setSelectedStop] = useState<any>(null);
  const [showSamplesModal, setShowSamplesModal] = useState(false);
  const [showUnregisteredSamplesModal, setShowUnregisteredSamplesModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);

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
              status: "completed", // "completed", "in-progress", "pending", "cancelled"
              notes: "All samples collected successfully.",
              contactName: "Dr. Sarah Johnson",
              contactPhone: "+1 555-987-6543",
              samples: [
                { id: "S101", type: "Blood", collectedBy: "Dr. Sarah", time: "09:00 AM", accessionNumber: "ACC-2024-001" },
                { id: "S102", type: "Urine", collectedBy: "Nurse Mike", time: "09:15 AM", accessionNumber: "ACC-2024-002" },
                { id: "S103", type: "Tissue", collectedBy: "Dr. Sarah", time: "09:30 AM", accessionNumber: "ACC-2024-003" },
                { id: "S104", type: "Blood", collectedBy: "Dr. Sarah", time: "09:45 AM", accessionNumber: "ACC-2024-004" },
                { id: "S105", type: "Serum", collectedBy: "Nurse Mike", time: "10:00 AM", accessionNumber: "ACC-2024-005" },
                { id: "S106", type: "Plasma", collectedBy: "Dr. Sarah", time: "10:15 AM", accessionNumber: "ACC-2024-006" },
                { id: "S107", type: "CSF", collectedBy: "Dr. Sarah", time: "10:30 AM", accessionNumber: "ACC-2024-007" },
                { id: "S108", type: "Tissue", collectedBy: "Nurse Mike", time: "10:45 AM", accessionNumber: "ACC-2024-008" }
              ],
              unregisteredSamples: [
                { type: "Blood", quantity: 2 },
                { type: "Tissue", quantity: 1 }
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
              status: "in-progress", // "completed", "in-progress", "pending", "cancelled"
              notes: "Collection in progress. Some samples already secured.",
              contactName: "Lab Manager Mike",
              contactPhone: "+1 555-456-7890",
              samples: [
                { id: "S201", type: "Blood", collectedBy: "Lab Tech Jim", time: "11:00 AM", accessionNumber: "ACC-2024-004" },
                { id: "S202", type: "Serum", collectedBy: "Lab Tech Anna", time: "11:15 AM", accessionNumber: "ACC-2024-005" },
                { id: "S203", type: "Plasma", collectedBy: "Lab Tech Jim", time: "11:30 AM", accessionNumber: "ACC-2024-006" },
                { id: "S204", type: "CSF", collectedBy: "Dr. Roberts", time: "11:45 AM", accessionNumber: "ACC-2024-007" }
              ],
              unregisteredSamples: [
                { type: "Blood", quantity: 1 },
                { type: "Urine", quantity: 2 }
              ],
              attachments: [
                { id: 201, name: "Lab Manifest", type: "pdf" },
                { id: 202, name: "Sample Photos", type: "image" }
              ]
            },
            {
              id: 3,
              name: "Checkpoint Alpha",
              address: "789 Cross St, New York, NY 10003",
              type: "checkpoint",
              status: "cancelled", // "completed", "in-progress", "pending", "cancelled"
              notes: "Checkpoint cancelled due to route optimization.",
              contactName: "Quality Control",
              contactPhone: "+1 555-789-1234"
              // No samples or attachments for cancelled stops
            },
            {
              id: 4,
              name: "Eastside Clinic",
              address: "321 Medical Blvd, New York, NY 10004",
              type: "pickup",
              status: "pending", // "completed", "in-progress", "pending", "cancelled"
              samplesCollected: 0,
              samplesRegistered: 0,
              samplesUnregistered: 0,
              notes: "Scheduled for late afternoon pickup.",
              contactName: "Dr. Williams",
              contactPhone: "+1 555-987-6543"
              // No samples or attachments for pending stops
            },
            {
              id: 5,
              name: "North Hospital",
              address: "555 Healthcare Dr, New York, NY 10005",
              type: "pickup",
              status: "pending", // "completed", "in-progress", "pending", "cancelled"
              samplesCollected: 0,
              samplesRegistered: 0,
              samplesUnregistered: 0,
              notes: "Scheduled for afternoon pickup.",
              contactName: "Lab Manager",
              contactPhone: "+1 555-222-3333"
              // No samples or attachments for pending stops
            },
            {
              id: 6,
              name: "Checkpoint Beta",
              address: "888 Quality Blvd, New York, NY 10006",
              type: "checkpoint",
              status: "cancelled", // "completed", "in-progress", "pending", "cancelled"
              notes: "Checkpoint cancelled due to weather conditions.",
              contactName: "Safety Officer",
              contactPhone: "+1 555-444-5555"
              // No samples or attachments for cancelled stops
            }
          ]
        };
        setTripData(mockTripData);
        setAssignedTeam(mockTripData.assignedTeam);
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

  // Removed handleConfirmCollection function as it's no longer needed

  const handleDownloadSummary = () => {
    if (!tripData) return;

    toast({
      title: "Generating Summary",
      description: "Your trip summary is being generated...",
    });

    // Create CSV content
    const headers = [
      "Route Name",
      "Route ID",
      "Trip Name",
      "Trip ID",
      "Stop Name",
      "Contact Person",
      "Contact Number",
      "Registered Samples with Accession Numbers",
      "Unregistered Samples",
      "Sample Types",
      "Number of Attachments",
      "Pickup Partner"
    ];

    let csvContent = headers.join(",") + "\n";

    // Generate dummy data rows
    if (tripData.stopsList && tripData.stopsList.length > 0) {
      tripData.stopsList.forEach((stop: any) => {
        // For each stop, create a row
        const registeredSamples = stop.samples ?
          stop.samples.map((s: any) => `${s.id}:${s.accessionNumber || 'N/A'}`).join('; ') :
          'None';

        const unregisteredSamples = stop.unregisteredSamples ?
          stop.unregisteredSamples.map((s: any) => `${s.type}:${s.quantity}`).join('; ') :
          'None';

        const sampleTypes = stop.samples ?
          [...new Set(stop.samples.map((s: any) => s.type))].join('; ') :
          'None';

        const row = [
          tripData.routeName,
          tripData.routeNo,
          tripData.routeName, // Using route name as trip name for demo
          tripData.id,
          stop.name,
          stop.contactName || 'N/A',
          stop.contactPhone || 'N/A',
          registeredSamples,
          unregisteredSamples,
          sampleTypes,
          stop.attachments ? stop.attachments.length : 0,
          tripData.partnerName || 'N/A'
        ];

        // Escape any commas in the data
        const escapedRow = row.map(field => {
          // If field contains comma, quote, or newline, wrap it in quotes
          if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
            return `"${field.replace(/"/g, '""')}"`; // Escape quotes by doubling them
          }
          return field;
        });

        csvContent += escapedRow.join(",") + "\n";
      });
    } else {
      // Add a dummy row if no stops
      const dummyRow = [
        tripData.routeName,
        tripData.routeNo,
        tripData.routeName,
        tripData.id,
        'No stops available',
        'N/A',
        'N/A',
        'None',
        'None',
        'None',
        '0',
        tripData.partnerName || 'N/A'
      ];
      csvContent += dummyRow.join(",") + "\n";
    }

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link and trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `trip_summary_${tripData.routeNo}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Complete",
      description: "Your trip summary has been downloaded as a CSV file that can be opened in Excel.",
    });
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

  // This function is now used to select an attachment in the sidebar
  const handleViewAttachment = (attachment: any) => {
    // In a real app, this would update the selected attachment
    // For now, we'll just show a toast notification
    toast({
      title: "Attachment Selected",
      description: `Viewing ${attachment.name}`,
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

  const handleSaveAssignedTeam = () => {
    if (tripData) {
      // In a real app, this would call an API to update the assigned team
      setTripData({
        ...tripData,
        assignedTeam: assignedTeam
      });

      toast({
        title: "Team Updated",
        description: `Trip has been reassigned to ${assignedTeam}.`,
      });

      setIsEditingAssignedTeam(false);
    }
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto px-2 sm:px-6 py-4 overflow-x-hidden">
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

          <div className="space-y-6 pt-2">
            {/* Trip Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Truck className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Assigned Team</p>
                          {!isEditingAssignedTeam && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => setIsEditingAssignedTeam(true)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        {isEditingAssignedTeam ? (
                          <div className="flex items-center gap-2 mt-1">
                            <Select
                              value={assignedTeam}
                              onValueChange={setAssignedTeam}
                            >
                              <SelectTrigger className="h-8 text-sm w-[200px]">
                                <SelectValue placeholder="Select a team" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTeams.map((team) => (
                                  <SelectItem key={team} value={team}>
                                    {team}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              className="h-8"
                              onClick={handleSaveAssignedTeam}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <p className="font-medium">{tripData.assignedTeam}</p>
                        )}
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
                        <p className="text-sm text-muted-foreground">Total Registered Samples</p>
                        <p className="font-medium">{tripData.samplesRegistered}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Unregistered Samples</p>
                        <p className="font-medium">{tripData.samplesUnregistered}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collection Stops Card */}
            <Card>
              <CardHeader>
                <CardTitle>Collection Stops</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead>Stop Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Contact Number</TableHead>
                      <TableHead>Registered Samples</TableHead>
                      <TableHead>Unregistered Samples</TableHead>
                      <TableHead>Attachments</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tripData.stopsList.map((stop: any) => (
                      <TableRow key={stop.id}>
                        <TableCell className="text-center">
                          <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mx-auto">
                            {stop.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{stop.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {stop.address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {stop.status === "completed" && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" /> Completed
                            </Badge>
                          )}
                          {stop.status === "in-progress" && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <Clock className="h-3 w-3 mr-1" /> Active
                            </Badge>
                          )}
                          {(stop.status === "pending" || stop.status === "upcoming" || !stop.status) && (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              <AlertCircle className="h-3 w-3 mr-1" /> Upcoming
                            </Badge>
                          )}
                          {stop.status === "cancelled" && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" /> Cancelled
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {stop.contactName ? (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">{stop.contactName}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {stop.contactPhone ? (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">{stop.contactPhone}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {stop.samplesRegistered ? (
                            <Button
                              variant="link"
                              className="p-0 h-auto text-primary hover:underline flex items-center gap-1"
                              onClick={() => {
                                // Show registered samples modal
                                if (stop.samples && stop.samples.length > 0) {
                                  // Open a modal with all samples from this stop
                                  setSelectedStop(stop);
                                  setShowSamplesModal(true);
                                }
                              }}
                            >
                              <span>{stop.samplesRegistered} samples</span>
                              <Eye className="h-3.5 w-3.5 text-primary" />
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {stop.samplesUnregistered && stop.samplesUnregistered > 0 ? (
                            <Button
                              variant="link"
                              className="p-0 h-auto"
                              onClick={() => {
                                setSelectedStop(stop);
                                setShowUnregisteredSamplesModal(true);
                              }}
                            >
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <span>{stop.samplesUnregistered} unregistered</span>
                                <Eye className="h-3.5 w-3.5" />
                              </Badge>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {stop.attachments && stop.attachments.length > 0 ? (
                            <Button
                              variant="link"
                              className="p-0 h-auto text-primary hover:underline flex items-center gap-1"
                              onClick={() => {
                                // Show attachments modal
                                if (stop.attachments && stop.attachments.length > 0) {
                                  setSelectedStop(stop);
                                  setShowAttachmentsModal(true);
                                }
                              }}
                            >
                              <span>{stop.attachments.length} {stop.attachments.length === 1 ? "file" : "files"}</span>
                              <FileImage className="h-3.5 w-3.5 text-primary" />
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {stop.notes ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="max-w-[200px] truncate text-sm h-5 cursor-default overflow-hidden">
                                    {stop.notes}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm p-2 bg-white border shadow-lg rounded-md">
                                  <div className="text-sm">
                                    <p className="text-muted-foreground">{stop.notes}</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <span className="text-muted-foreground text-sm h-5">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 mt-4 border-t">
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

      {/* Samples Modal */}
      <Dialog open={showSamplesModal} onOpenChange={setShowSamplesModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registered Samples</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedStop?.name} • {selectedStop?.samplesRegistered} samples
            </p>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample ID</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedStop?.samples?.map((sample: any) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.id}</TableCell>
                    <TableCell>{sample.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* No footer with close button */}
        </DialogContent>
      </Dialog>

      {/* Unregistered Samples Modal */}
      <Dialog open={showUnregisteredSamplesModal} onOpenChange={setShowUnregisteredSamplesModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Unregistered Samples</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedStop?.name} • {selectedStop?.samplesUnregistered} samples
            </p>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedStop?.unregisteredSamples
                  ?.filter((sample: any) => sample.quantity > 0)
                  .map((sample: any, index: number) => (
                    <TableRow key={`unregistered-${index}`}>
                      <TableCell className="font-medium">{sample.type}</TableCell>
                      <TableCell className="text-right">{sample.quantity}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {/* No footer with close button */}
        </DialogContent>
      </Dialog>

      {/* Attachments Modal */}
      <Dialog open={showAttachmentsModal} onOpenChange={setShowAttachmentsModal}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[80vh] p-0 overflow-hidden">
          <div className="flex h-[80vh]">
            {/* Left sidebar with attachment list */}
            <div className="w-64 border-r bg-gray-50 overflow-y-auto">
              <div className="p-4 border-b bg-white sticky top-0 z-10">
                <h3 className="font-medium">Attachments</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedStop?.attachments?.length || 0} items
                </p>
              </div>
              <div className="divide-y">
                {selectedStop?.attachments?.map((attachment: any, index: number) => (
                  <div
                    key={attachment.id}
                    className={`p-3 cursor-pointer hover:bg-gray-100 ${index === 0 ? 'bg-gray-100' : ''}`}
                    onClick={() => handleViewAttachment(attachment)}
                  >
                    <div className="flex items-center space-x-2">
                      {attachment.type === "pdf" && <FileText className="h-5 w-5 text-red-500" />}
                      {attachment.type === "xlsx" && <FileText className="h-5 w-5 text-green-500" />}
                      {attachment.type === "image" && <FileImage className="h-5 w-5 text-blue-500" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{attachment.name}</p>
                        <Badge variant="outline" className="mt-1 text-xs">{attachment.type.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-lg font-semibold">{selectedStop?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedStop?.attachments?.[0]?.name} • {selectedStop?.attachments?.[0]?.type.toUpperCase()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadAttachment(selectedStop?.attachments?.[0]?.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAttachmentsModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* Preview area */}
              <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-gray-50">
                {selectedStop?.attachments?.[0]?.type === "image" ? (
                  <div className="max-h-full max-w-full overflow-hidden rounded-md shadow-lg">
                    <img
                      src={`/images/sample-image.jpg`}
                      alt={selectedStop?.attachments?.[0]?.name}
                      className="max-h-[60vh] max-w-full object-contain"
                    />
                  </div>
                ) : selectedStop?.attachments?.[0]?.type === "pdf" ? (
                  <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-3xl">
                    <div className="flex items-center justify-center h-[50vh] border-2 border-dashed border-gray-300 rounded-md">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">{selectedStop?.attachments?.[0]?.name}</h3>
                        <p className="text-muted-foreground mb-4">PDF Preview not available</p>
                        <Button
                          variant="outline"
                          onClick={() => handleDownloadAttachment(selectedStop?.attachments?.[0]?.id)}
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
                        <h3 className="font-medium text-lg mb-2">{selectedStop?.attachments?.[0]?.name}</h3>
                        <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
                        <Button
                          variant="outline"
                          onClick={() => handleDownloadAttachment(selectedStop?.attachments?.[0]?.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download to View
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
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
