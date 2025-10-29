
import React, { useState } from "react";
import { Stop } from "@/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building, Phone, User, FileText, Paperclip, AlertCircle, Eye, FileImage, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StopsAccordionProps {
  stops: Stop[];
}

export const StopsAccordion = ({ stops = [] }: StopsAccordionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showSamplesModal, setShowSamplesModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const stopsPerPage = 10;

  if (!stops || stops.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground text-sm">
        No stops information available
      </div>
    );
  }

  // Calculate pagination
  const indexOfLastStop = currentPage * stopsPerPage;
  const indexOfFirstStop = indexOfLastStop - stopsPerPage;
  const currentStops = stops.slice(indexOfFirstStop, indexOfLastStop);
  const totalPages = Math.ceil(stops.length / stopsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleViewNotes = (notes: string) => {
    setSelectedNotes(notes);
    setShowNotesDialog(true);
  };

  const handleViewSamples = (stop: Stop) => {
    setSelectedStop(stop);
    setShowSamplesModal(true);
  };

  const handleViewAttachments = (stop: Stop) => {
    setSelectedStop(stop);

    // Mock attachments data
    const mockAttachments = [
      { id: 1, name: "Collection Receipt.pdf", type: "pdf" },
      { id: 2, name: "Sample Photos.jpg", type: "image" },
      { id: 3, name: "Temperature Log.xlsx", type: "xlsx" }
    ];

    setAttachments(mockAttachments);
    setSelectedAttachment(mockAttachments[0]);
    setShowAttachmentsModal(true);
  };

  return (
    <div className="border-t pt-2 mt-2">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Samples</TableHead>
              <TableHead>Attachments</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStops.map((stop) => (
              <TableRow key={stop.id}>
                <TableCell className="text-center font-medium">
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mx-auto">
                    {stop.id}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{stop.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-sm">{stop.address}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {stop.type === "checkpoint" ? (
                    <Badge variant="secondary" className="flex items-center">
                      <Building className="h-3 w-3 mr-1" /> Drop-off Point
                    </Badge>
                  ) : (
                    <Badge className="flex items-center">
                      <Building className="h-3 w-3 mr-1" /> Pickup
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {stop.time && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-sm">{stop.time}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {stop.samplesCollected > 0 || stop.samplesRegistered > 0 || stop.samplesUnregistered > 0 ? (
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-primary hover:underline"
                      onClick={() => handleViewSamples(stop)}
                    >
                      <div className="text-left">
                        <div className="text-xs text-muted-foreground">Reg: {stop.samplesRegistered || 0}</div>
                        <div className="text-xs text-muted-foreground">Unreg: {stop.samplesUnregistered || 0}</div>
                      </div>
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {stop.attachments && stop.attachments !== "" ? (
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-primary hover:underline flex items-center gap-1"
                      onClick={() => handleViewAttachments(stop)}
                    >
                      <Paperclip className="h-3 w-3" />
                      {typeof stop.attachments === 'string' ? stop.attachments : 'View'}
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  {stop.contactName ? (
                    <div className="text-sm">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1 text-muted-foreground" />
                        {stop.contactName}
                      </div>
                      {stop.contactPhone && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {stop.contactPhone}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {stop.notes ? (
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-primary hover:underline"
                      onClick={() => handleViewNotes(stop.notes || '')}
                    >
                      View
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  // Show current page, first, last, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={pageNumber === currentPage}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Show ellipsis
                  if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Stop Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{selectedNotes}</p>
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Samples Modal */}
      <Dialog open={showSamplesModal} onOpenChange={setShowSamplesModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Samples Details - {selectedStop?.name}</DialogTitle>
          </DialogHeader>

          {selectedStop && (
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Samples Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Collected</p>
                    <p className="text-lg font-medium">{selectedStop.samplesCollected}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registered</p>
                    <p className="text-lg font-medium">{selectedStop.samplesRegistered}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unregistered</p>
                    <div className="flex items-center">
                      <p className="text-lg font-medium">{selectedStop.samplesUnregistered || 0}</p>
                      {selectedStop.samplesUnregistered > 0 && (
                        <AlertCircle className="h-4 w-4 ml-2 text-destructive" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="registered">
                <TabsList className="w-full">
                  <TabsTrigger value="registered">Registered Samples ({selectedStop.samplesRegistered || 0})</TabsTrigger>
                  <TabsTrigger value="unregistered">Unregistered Samples ({selectedStop.samplesUnregistered || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="registered" className="mt-4">
                  {selectedStop.samplesRegistered > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sample ID</TableHead>
                            <TableHead>Sample Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Mock data for registered samples */}
                          {Array.from({ length: selectedStop.samplesRegistered || 0 }).map((_, index) => (
                            <TableRow key={`reg-${index}`}>
                              <TableCell className="font-medium">S-{selectedStop.id}-{index + 1}</TableCell>
                              <TableCell>{['Blood', 'Urine', 'Tissue', 'Plasma', 'Serum'][index % 5]}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4">No registered samples.</p>
                  )}
                </TabsContent>

                <TabsContent value="unregistered" className="mt-4">
                  {selectedStop.samplesUnregistered > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sample Type</TableHead>
                            <TableHead>Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Mock data for unregistered samples */}
                          {Array.from({ length: Math.min(selectedStop.samplesUnregistered || 0, 3) }).map((_, index) => (
                            <TableRow key={`unreg-${index}`}>
                              <TableCell>{['Blood', 'Urine', 'Tissue', 'Plasma', 'Serum'][index % 5]}</TableCell>
                              <TableCell>{index + 1}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4">No unregistered samples.</p>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Attachments Modal */}
      <Dialog open={showAttachmentsModal} onOpenChange={setShowAttachmentsModal}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] p-0 overflow-hidden">
          <div className="flex h-[80vh]">
            {/* Left sidebar with attachment list */}
            <div className="w-64 border-r bg-gray-50 overflow-y-auto">
              <div className="p-4 border-b bg-white sticky top-0 z-10">
                <h3 className="font-medium">{selectedStop?.name} Attachments</h3>
                <p className="text-xs text-muted-foreground mt-1">{attachments.length} items</p>
              </div>
              <div className="divide-y">
                {attachments.map((attachment, index) => (
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
                  <h2 className="text-lg font-semibold">{selectedAttachment?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedAttachment?.type.toUpperCase()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
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
                      src={`/images/sample-image.jpg`}
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
                        <Button variant="outline">
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
                        <Button variant="outline">
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
    </div>
  );
};
