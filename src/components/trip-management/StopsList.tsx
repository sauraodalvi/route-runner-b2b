
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Building, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Stop {
  id: number;
  name: string;
  address: string;
  type: "checkpoint" | "pickup";
  time?: string;
  organization?: string;
}

interface StopsListProps {
  stops: Stop[];
}

export function StopsList({ stops }: StopsListProps) {
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
                  <div className="font-medium text-sm">{stop.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {stop.address}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={stop.type === "checkpoint" ? "secondary" : "default"} className="mb-1">
                  {stop.type === "checkpoint" ? 
                    <Check className="h-3 w-3 mr-1" /> : 
                    <Building className="h-3 w-3 mr-1" />
                  }
                  {stop.type === "checkpoint" ? "Checkpoint" : "Pickup"}
                </Badge>
                {stop.time && (
                  <div className="text-xs text-muted-foreground flex items-center justify-end">
                    <Clock className="h-3 w-3 mr-1" />
                    {stop.time}
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
