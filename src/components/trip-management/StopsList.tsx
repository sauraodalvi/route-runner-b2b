
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Building, Check, Phone, User, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stop } from "./CreateRouteForm";

interface StopsListProps {
  stops: Stop[];
  onDeleteStop?: (id: number) => void;
  onEditStop?: (stop: Stop) => void;
}

export function StopsList({ stops, onDeleteStop, onEditStop }: StopsListProps) {
  if (stops.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No stops added yet. Add stops to create your route.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
      {stops.map((stop, index) => (
        <Card key={stop.id} className="relative">
          <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-lg" />
          <CardContent className="p-3 pl-4">
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                <div className="ml-2">
                  <div className="font-medium text-sm flex items-center">
                    {stop.name}
                    {stop.type === "pickup" && stop.organization && (
                      <Badge
                        className={`ml-2 ${stop.inSystem ? "bg-green-500" : "bg-orange-500"}`}
                        variant="secondary"
                      >
                        {stop.inSystem ? "In System" : "Not in System"}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {stop.address}
                  </div>
                  {stop.contactName && (
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <User className="h-3 w-3 mr-1" />
                      {stop.contactName}
                      {stop.contactPhone && (
                        <>
                          <span className="mx-1">•</span>
                          <Phone className="h-3 w-3 mr-1" />
                          {stop.contactPhone}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant={stop.type === "checkpoint" ? "secondary" : "default"} className="mb-1">
                  {stop.type === "checkpoint" ?
                    <Check className="h-3 w-3 mr-1" /> :
                    <Building className="h-3 w-3 mr-1" />
                  }
                  {stop.type === "checkpoint" ? "Drop-off Point" : "Pickup"}
                </Badge>
                {stop.time && (
                  <div className="text-xs text-muted-foreground flex items-center justify-end">
                    <Clock className="h-3 w-3 mr-1" />
                    {stop.time}
                  </div>
                )}
                {stop.organization && stop.type === "pickup" && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {organizations.find(org => org.id === stop.organization)?.name}
                  </div>
                )}
                {(onDeleteStop || onEditStop) && (
                  <div className="mt-2 flex space-x-1">
                    {onEditStop && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onEditStop(stop)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    {onDeleteStop && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDeleteStop(stop.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Mock organizations data
const organizations = [
  { id: "1", name: "Medlife Hospital" },
  { id: "2", name: "City Medical Center" },
  { id: "3", name: "HealthFirst Clinic" },
  { id: "4", name: "CarePoint Diagnostics" },
];
