
import React from "react";
import { Stop } from "@/types";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building, Check, Phone, User } from "lucide-react";

interface StopsAccordionProps {
  stops: Stop[];
}

export const StopsAccordion = ({ stops = [] }: StopsAccordionProps) => {
  if (!stops || stops.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground text-sm">
        No stops information available
      </div>
    );
  }

  return (
    <div className="border-t pt-2 mt-2">
      <Accordion type="single" collapsible className="w-full">
        {stops.map((stop) => (
          <AccordionItem key={stop.id} value={`stop-${stop.id}`} className="border-b-0">
            <AccordionTrigger className="py-2 px-4 hover:bg-muted/20 text-sm">
              <div className="flex items-center w-full">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-3">
                  {stop.id}
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium">{stop.name}</span>
                </div>
                <div className="flex items-center ml-4 space-x-4">
                  {stop.type === "checkpoint" ? (
                    <Badge variant="secondary" className="flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Checkpoint
                    </Badge>
                  ) : (
                    <Badge className="flex items-center">
                      <Building className="h-3 w-3 mr-1" /> Pickup
                    </Badge>
                  )}
                  {stop.status && (
                    <Badge 
                      variant={
                        stop.status === "on-time" ? "outline" :
                        stop.status === "delayed" ? "secondary" : "destructive"
                      }
                      className="flex items-center"
                    >
                      {stop.status}
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2 bg-muted/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm flex items-center mb-2">
                    <MapPin className="h-3 w-3 mr-2 text-muted-foreground" />
                    {stop.address}
                  </p>
                  {stop.time && (
                    <p className="text-sm flex items-center mb-2">
                      <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                      {stop.time}
                    </p>
                  )}
                  {stop.contactName && (
                    <p className="text-sm flex items-center mb-2">
                      <User className="h-3 w-3 mr-2 text-muted-foreground" />
                      {stop.contactName}
                    </p>
                  )}
                  {stop.contactPhone && (
                    <p className="text-sm flex items-center mb-2">
                      <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                      {stop.contactPhone}
                    </p>
                  )}
                </div>
                
                <div>
                  {stop.samplesCollected > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Samples</p>
                      <p className="text-sm">
                        Collected: <span className="font-medium">{stop.samplesCollected}</span>
                        {stop.samplesRegistered !== undefined && (
                          <span className="ml-2">
                            (Registered: {stop.samplesRegistered} / 
                            Unregistered: {(stop.samplesUnregistered || 0)})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {stop.notes && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground">{stop.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
