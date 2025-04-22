
// Define the Route interface
export interface Route {
  id: string;
  tripId: string;
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: "active" | "upcoming" | "completed" | "pending" | "cancelled" | string;
  assignedTeam: string;
  stopCount: number;
  samplesCollected: number;
  unregisteredSamples: number;
  attachments?: string;
  stops?: Stop[];
}

// Define the Stop interface
export interface Stop {
  id: number;
  name: string;
  address: string;
  type: "pickup" | "checkpoint" | string;
  time?: string;
  status?: "on-time" | "delayed" | "critical" | string;
  samplesCollected?: number;
  samplesRegistered?: number;
  samplesUnregistered?: number;
  contactName?: string;
  contactPhone?: string;
  organization?: string;
  inSystem?: boolean;
  notes?: string;
  attachments?: string;
}

// Add other type definitions as needed
