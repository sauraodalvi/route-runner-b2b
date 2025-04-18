import { Route, Stop } from "@/types";

// Sample cancelled stops (only checkpoints can be cancelled)
const cancelledCheckpoints: Stop[] = [
  {
    id: 101,
    name: "Checkpoint Alpha",
    address: "789 Cross St, New York, NY 10003",
    type: "checkpoint",
    time: "10:45 AM",
    status: "cancelled",
    notes: "Checkpoint cancelled due to route optimization.",
  },
  {
    id: 102,
    name: "Checkpoint Beta",
    address: "303 Midtown Blvd, New York, NY 10006",
    type: "checkpoint",
    time: "12:45 PM",
    status: "cancelled",
    notes: "Checkpoint cancelled due to weather conditions.",
  },
  {
    id: 103,
    name: "Checkpoint Gamma",
    address: "505 East Side Ave, New York, NY 10008",
    type: "checkpoint",
    time: "02:15 PM",
    status: "cancelled",
    notes: "Checkpoint cancelled due to traffic congestion.",
  }
];

// Sample stops data for active routes
const activeStops: Stop[] = [
  {
    id: 1,
    name: "Central Hospital",
    address: "123 Main St, New York, NY 10001",
    type: "pickup",
    time: "08:15 AM",
    status: "on-time",
    samplesCollected: 5,
    samplesRegistered: 4,
    samplesUnregistered: 1,
    contactName: "Dr. Johnson",
    contactPhone: "555-123-4567",
    organization: "NYC Health",
    inSystem: true,
    notes: "Samples must be kept at 2-8°C during transport. Access through the loading dock at the rear of the building.",
    attachments: "2 files"
  },
  {
    id: 2,
    name: "City Medical Center",
    address: "456 Park Ave, New York, NY 10002",
    type: "pickup",
    time: "09:30 AM",
    status: "on-time",
    samplesCollected: 7,
    samplesRegistered: 5,
    samplesUnregistered: 2,
    contactName: "Nurse Williams",
    contactPhone: "555-987-6543",
    organization: "City Health Network",
    inSystem: true,
    attachments: ""
  },
  {
    id: 3,
    name: "Checkpoint Alpha",
    address: "789 Cross St, New York, NY 10003",
    type: "checkpoint",
    time: "10:45 AM",
    status: "on-time",
    notes: "Temperature check point. Verify all samples are within acceptable temperature range.",
  },
  {
    id: 4,
    name: "Downtown Clinic",
    address: "101 First Ave, New York, NY 10004",
    type: "pickup",
    time: "11:30 AM",
    status: "delayed",
    samplesCollected: 4,
    samplesRegistered: 1,
    samplesUnregistered: 3,
    contactName: "Dr. Roberts",
    contactPhone: "555-234-5678",
    organization: "Downtown Health",
    inSystem: true,
  },
  {
    id: 5,
    name: "West Side Medical",
    address: "202 West End, New York, NY 10005",
    type: "pickup",
    time: "12:15 PM",
    status: "on-time",
    samplesCollected: 3,
    samplesRegistered: 3,
    samplesUnregistered: 0,
    contactName: "Lab Technician Brown",
    contactPhone: "555-345-6789",
    organization: "West Side Health Group",
    inSystem: true,
  },
  {
    id: 6,
    name: "Checkpoint Beta",
    address: "303 Midtown Blvd, New York, NY 10006",
    type: "checkpoint",
    time: "12:45 PM",
    status: "on-time",
    notes: "Final checkpoint before lab delivery. Verify all documentation is complete.",
  }
];

// Sample stops for upcoming routes (no samples collected yet)
const upcomingStops: Stop[] = [
  {
    id: 1,
    name: "Central Hospital",
    address: "123 Main St, New York, NY 10001",
    type: "pickup",
    time: "08:15 AM",
    status: "pending",
    samplesCollected: 0,
    samplesRegistered: 0,
    samplesUnregistered: 0,
    contactName: "Dr. Johnson",
    contactPhone: "555-123-4567",
    organization: "NYC Health",
    inSystem: true,
    notes: "Samples must be kept at 2-8°C during transport. Access through the loading dock at the rear of the building."
  },
  {
    id: 2,
    name: "City Medical Center",
    address: "456 Park Ave, New York, NY 10002",
    type: "pickup",
    time: "09:30 AM",
    status: "pending",
    samplesCollected: 0,
    samplesRegistered: 0,
    samplesUnregistered: 0,
    contactName: "Nurse Williams",
    contactPhone: "555-987-6543",
    organization: "City Health Network",
    inSystem: true
  },
  {
    id: 3,
    name: "Checkpoint Alpha",
    address: "789 Cross St, New York, NY 10003",
    type: "checkpoint",
    time: "10:45 AM",
    status: "pending",
    notes: "Temperature check point. Verify all samples are within acceptable temperature range."
  },
  {
    id: 4,
    name: "Downtown Clinic",
    address: "101 First Ave, New York, NY 10004",
    type: "pickup",
    time: "11:30 AM",
    status: "pending",
    samplesCollected: 0,
    samplesRegistered: 0,
    samplesUnregistered: 0,
    contactName: "Dr. Roberts",
    contactPhone: "555-234-5678",
    organization: "Downtown Health",
    inSystem: true
  }
];

// Sample stops for completed routes
const completedStops: Stop[] = [
  {
    id: 1,
    name: "Central Hospital",
    address: "123 Main St, New York, NY 10001",
    type: "pickup",
    time: "08:15 AM",
    status: "completed",
    samplesCollected: 5,
    samplesRegistered: 4,
    samplesUnregistered: 1,
    contactName: "Dr. Johnson",
    contactPhone: "555-123-4567",
    organization: "NYC Health",
    inSystem: true,
    notes: "Samples must be kept at 2-8°C during transport. Access through the loading dock at the rear of the building.",
    attachments: "2 files"
  },
  {
    id: 2,
    name: "City Medical Center",
    address: "456 Park Ave, New York, NY 10002",
    type: "pickup",
    time: "09:30 AM",
    status: "completed",
    samplesCollected: 7,
    samplesRegistered: 7,
    samplesUnregistered: 0,
    contactName: "Nurse Williams",
    contactPhone: "555-987-6543",
    organization: "City Health Network",
    inSystem: true,
    attachments: "1 file"
  },
  {
    id: 3,
    name: "Checkpoint Alpha",
    address: "789 Cross St, New York, NY 10003",
    type: "checkpoint",
    time: "10:45 AM",
    status: "completed",
    notes: "Temperature check point. Verify all samples are within acceptable temperature range.",
    attachments: "1 file"
  },
  {
    id: 4,
    name: "Downtown Clinic",
    address: "101 First Ave, New York, NY 10004",
    type: "pickup",
    time: "11:30 AM",
    status: "completed",
    samplesCollected: 4,
    samplesRegistered: 1,
    samplesUnregistered: 3,
    contactName: "Dr. Roberts",
    contactPhone: "555-234-5678",
    organization: "Downtown Health",
    inSystem: true,
    attachments: "2 files"
  }
];

// Sample routes data
export const sampleRoutes: Route[] = [
  {
    id: "1001",
    tripId: "TR-001-1234",
    name: "Downtown Medical Collection",
    date: "2025-04-17",
    startTime: "08:00 AM",
    endTime: "01:30 PM",
    status: "active",
    assignedTeam: "Team Alpha",
    stopCount: 7,
    samplesCollected: 8,
    unregisteredSamples: 3,
    attachments: "1 file",
    stops: [
      // First 2 stops completed
      {
        ...activeStops[0],
        status: "completed",
        samplesCollected: 5,
        samplesRegistered: 3,
        samplesUnregistered: 2,
        attachments: "1 file"
      },
      {
        ...activeStops[1],
        status: "completed",
        samplesCollected: 3,
        samplesRegistered: 2,
        samplesUnregistered: 1
      },
      // Current stop in progress
      {
        ...activeStops[2],
        status: "in-progress"
      },
      // Remaining stops pending
      {
        ...activeStops[3],
        status: "pending"
      },
      {
        ...activeStops[4],
        status: "pending"
      },
      {
        ...activeStops[5],
        status: "pending"
      },
      // Cancelled checkpoint
      cancelledCheckpoints[0]
    ]
  },
  {
    id: "1002",
    tripId: "TR-002-5678",
    name: "Uptown Labs Pickup",
    date: "2025-04-19",
    startTime: "09:15 AM",
    endTime: "02:45 PM",
    status: "upcoming",
    assignedTeam: "Team Beta",
    stopCount: 5,
    samplesCollected: 0,
    unregisteredSamples: 0,
    attachments: "",
    stops: [...upcomingStops.slice(0, 4), cancelledCheckpoints[0]]
  },
  {
    id: "1003",
    tripId: "TR-003-9012",
    name: "Hospital Circuit",
    date: "2025-04-15",
    startTime: "07:30 AM",
    endTime: "03:15 PM",
    status: "completed",
    assignedTeam: "Team Gamma",
    stopCount: 12,
    samplesCollected: 35,
    unregisteredSamples: 0,
    attachments: "4 files",
    stops: completedStops.slice(0, 4)
  },
  {
    id: "1004",
    tripId: "TR-004-3456",
    name: "East Side Collection",
    date: "2025-04-18",
    startTime: "08:30 AM",
    endTime: "01:00 PM",
    status: "upcoming",
    assignedTeam: "Team Delta",
    stopCount: 4,
    samplesCollected: 0,
    unregisteredSamples: 0,
    attachments: "",
    stops: [...upcomingStops.slice(1, 4), cancelledCheckpoints[1]]
  },
  {
    id: "1005",
    tripId: "TR-005-7890",
    name: "Midtown Medical Route",
    date: "2025-04-16",
    startTime: "09:00 AM",
    endTime: "02:30 PM",
    status: "completed",
    assignedTeam: "Team Alpha",
    stopCount: 7,
    samplesCollected: 22,
    unregisteredSamples: 1,
    attachments: "3 files",
    stops: completedStops
  },
  {
    id: "1006",
    tripId: "TR-006-1234",
    name: "South District Collection",
    date: "2025-04-20",
    startTime: "07:45 AM",
    endTime: "12:30 PM",
    status: "upcoming",
    assignedTeam: "Team Beta",
    stopCount: 4,
    samplesCollected: 0,
    unregisteredSamples: 0,
    attachments: "",
    stops: [...upcomingStops.slice(0, 3), cancelledCheckpoints[2]]
  },
  {
    id: "1007",
    tripId: "TR-007-5678",
    name: "North Hospital Route",
    date: "2025-04-17",
    startTime: "08:15 AM",
    endTime: "01:45 PM",
    status: "active",
    assignedTeam: "Team Gamma",
    stopCount: 8,
    samplesCollected: 10,
    unregisteredSamples: 4,
    attachments: "2 files",
    stops: [
      // First 3 stops completed
      {
        ...activeStops[0],
        status: "completed",
        samplesCollected: 5,
        samplesRegistered: 4,
        samplesUnregistered: 1,
        attachments: "1 file"
      },
      {
        ...activeStops[1],
        status: "completed",
        samplesCollected: 3,
        samplesRegistered: 1,
        samplesUnregistered: 2,
        attachments: "1 file"
      },
      {
        ...activeStops[2],
        status: "completed"
      },
      // Current stop in progress
      {
        ...activeStops[3],
        status: "in-progress",
        samplesCollected: 2,
        samplesRegistered: 1,
        samplesUnregistered: 1
      },
      // Remaining stops pending
      {
        ...activeStops[4],
        status: "pending"
      },
      {
        ...activeStops[5],
        status: "pending"
      },
      // Cancelled checkpoints
      cancelledCheckpoints[1],
      cancelledCheckpoints[2]
    ]
  },
  {
    id: "1008",
    tripId: "TR-008-9012",
    name: "West End Collection",
    date: "2025-04-14",
    startTime: "09:30 AM",
    endTime: "03:00 PM",
    status: "completed",
    assignedTeam: "Team Delta",
    stopCount: 9,
    samplesCollected: 27,
    unregisteredSamples: 2,
    attachments: "5 files",
    stops: completedStops
  },
  {
    id: "1009",
    tripId: "TR-009-3456",
    name: "Central District Route",
    date: "2025-04-21",
    startTime: "08:00 AM",
    endTime: "02:00 PM",
    status: "upcoming",
    assignedTeam: "Team Alpha",
    stopCount: 6,
    samplesCollected: 0,
    unregisteredSamples: 0,
    attachments: "",
    stops: [...upcomingStops, cancelledCheckpoints[0], cancelledCheckpoints[1]]
  },
  {
    id: "1010",
    tripId: "TR-010-7890",
    name: "Downtown Express",
    date: "2025-04-16",
    startTime: "07:30 AM",
    endTime: "12:45 PM",
    status: "completed",
    assignedTeam: "Team Beta",
    stopCount: 5,
    samplesCollected: 15,
    unregisteredSamples: 0,
    attachments: "2 files",
    stops: completedStops.slice(0, 3)
  }
];
