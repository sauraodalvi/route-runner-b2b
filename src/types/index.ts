
// Define the Route interface
export interface Route {
  id: string;
  tripId: string;
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: "active" | "upcoming" | "completed" | string;
  assignedTeam: string;
  stopCount: number;
  samplesCollected: number;
  unregisteredSamples: number;
  attachments?: string;
}

// Add other type definitions as needed
