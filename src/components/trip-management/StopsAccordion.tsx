
import React, { useState } from "react";
import { Stop } from "@/types";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building, Check, Phone, User, ChevronRight, ChevronLeft } from "lucide-react";
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

interface StopsAccordionProps {
  stops: Stop[];
}

export const StopsAccordion = ({ stops = [] }: StopsAccordionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const stopsPerPage = 5;
  
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

  const handleStopSelect = (stop: Stop) => {
    setSelectedStop(selectedStop?.id === stop.id ? null : stop);
  };

  return (
    <div className="border-t pt-2 mt-2">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="stop-list" className="border-b-0">
          <AccordionTrigger className="py-2 px-4 hover:bg-muted/20 text-sm">
            <div className="flex items-center w-full">
              <span className="font-medium">Stops Information</span>
              <Badge className="ml-2">{stops.length} stops</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2 bg-muted/10">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Samples</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="w-16">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStops.map((stop) => (
                    <React.Fragment key={stop.id}>
                      <TableRow 
                        className={`cursor-pointer ${selectedStop?.id === stop.id ? 'bg-muted' : ''}`}
                        onClick={() => handleStopSelect(stop)}
                      >
                        <TableCell className="text-center font-medium">
                          <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mx-auto">
                            {stop.id}
                          </div>
                        </TableCell>
                        <TableCell>{stop.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-sm">{stop.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {stop.type === "checkpoint" ? (
                            <Badge variant="secondary" className="flex items-center">
                              <Check className="h-3 w-3 mr-1" /> Checkpoint
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
                          {stop.status && (
                            <Badge 
                              variant={
                                stop.status === "on-time" ? "outline" :
                                stop.status === "delayed" ? "secondary" : "destructive"
                              }
                            >
                              {stop.status}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {stop.samplesCollected > 0 ? (
                            <div className="text-sm">
                              <div>Total: <span className="font-medium">{stop.samplesCollected}</span></div>
                              {stop.samplesRegistered !== undefined && (
                                <div className="text-xs text-muted-foreground">
                                  Reg: {stop.samplesRegistered} / 
                                  Unreg: {(stop.samplesUnregistered || 0)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
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
                            <Badge variant="outline">View</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                      {selectedStop?.id === stop.id && stop.notes && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-muted/20 p-3">
                            <div className="text-sm">
                              <p className="font-medium">Notes:</p>
                              <p className="text-muted-foreground">{stop.notes}</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
