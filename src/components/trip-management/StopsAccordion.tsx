
import React, { useState } from "react";
import { Stop } from "@/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building, Phone, User, FileText, Paperclip } from "lucide-react";
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

interface StopsAccordionProps {
  stops: Stop[];
}

export const StopsAccordion = ({ stops = [] }: StopsAccordionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
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
                      <Building className="h-3 w-3 mr-1" /> Checkpoint
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
                  {stop.samplesCollected > 0 ? (
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <span>Registered:</span>
                        <span className="font-medium">{stop.samplesRegistered || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Unregistered:</span>
                        <span className="font-medium">{stop.samplesUnregistered || 0}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {stop.attachments ? (
                    <Button variant="outline" size="sm" className="h-7">
                      <Paperclip className="h-3 w-3 mr-1" />
                      View {stop.attachments}
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">No attachments</span>
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
                      variant="outline" 
                      size="sm" 
                      className="h-7"
                      onClick={() => handleViewNotes(stop.notes || '')}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      View Notes
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">No notes</span>
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
    </div>
  );
};
