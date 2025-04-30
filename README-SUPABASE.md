# B2B Logistics App - Supabase Integration

This document provides detailed instructions on how to set up and use the Supabase backend for the B2B Logistics App.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides a PostgreSQL database, authentication, instant APIs, real-time subscriptions, and storage. We're using it as the backend for our B2B Logistics App.

## Setup Instructions

### 1. Supabase Project Configuration

The app is already configured to use the following Supabase project:
- **Project URL**: https://supabase.com/dashboard/project/wnvonjgjusywqewejeho
- **API URL**: https://wnvonjgjusywqewejeho.supabase.co
- **API Key**: sbp_e32eba27975a890a601b4db9f563ad10b74fc9e5

These values are stored in the `.env` file in the root of the project.

### 2. Database Schema Setup

To set up the database schema:

1. Go to the [Supabase SQL Editor](https://supabase.com/dashboard/project/wnvonjgjusywqewejeho/sql)
2. Click "New Query"
3. Open the file `supabase/direct-schema.sql` from this repository
4. Copy the entire contents of the file
5. Paste the SQL into the query editor in Supabase
6. Click "Run" to execute the SQL and create all tables and sample data

### 3. Verify the Setup

After running the SQL script, you should verify that the database schema was created correctly:

1. Go to the [Table Editor](https://supabase.com/dashboard/project/wnvonjgjusywqewejeho/editor)
2. You should see the following tables:
   - organizations
   - partners
   - teams
   - routes
   - stops
   - samples
   - attachments
3. Click on the "routes" table and verify that there are entries, including one with the trip ID "TR-20250422-001"

## Using the Supabase Integration

The app is already configured to use Supabase as the backend. Here's how it works:

### Data Fetching

The app fetches data from Supabase in the `TripManagement` component:

```javascript
useEffect(() => {
  const fetchRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getRoutes();
      if (error) {
        throw error;
      }
      if (data) {
        setRoutes(data);
      } else {
        // Fallback to mock data if no data is returned
        setRoutes(mockRoutes);
      }
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError('Failed to fetch routes from Supabase. Using mock data instead.');
      setRoutes(mockRoutes);
      toast({
        title: "Connection Error",
        description: "Could not connect to Supabase. Using sample data instead.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  fetchRoutes();
}, []);
```

### API Services

The app uses the following API services to interact with Supabase:

- `getRoutes()`: Fetches all routes from the database
- `getRouteById(id)`: Fetches a specific route by ID
- `createRoute(route)`: Creates a new route
- `updateRoute(id, route, updateAllTrips)`: Updates an existing route
- `cancelRoute(id, cancelAllTrips)`: Cancels a route
- `updateStopStatus(routeId, stopId, status)`: Updates the status of a stop
- `addSamples(stopId, samples)`: Adds samples to a stop
- `uploadAttachment(stopId, file)`: Uploads an attachment for a stop
- `getTeams()`: Fetches all teams
- `getPartners()`: Fetches all partners
- `getOrganizations()`: Fetches all organizations

These services are defined in `src/services/api.ts`.

### Search Functionality

The app includes a search functionality that allows you to search for routes by name or trip ID. The search is case-insensitive and supports partial matches.

To search for a specific trip, you can use the search bar at the top of the Trip Management page. For example, you can search for "TR-20250422-001" to find a specific trip.

## Troubleshooting

If you encounter any issues with the Supabase integration:

1. Check that your `.env` file has the correct Supabase URL and API key
2. Make sure all the SQL statements executed successfully
3. Check the browser console for any error messages
4. Try restarting the application

## Database Schema

The database consists of the following tables:

### organizations
- Stores information about organizations (hospitals, clinics, labs)
- Includes contact information and payment type

### partners
- Pickup partners who handle the routes
- Includes name and contact information

### teams
- Teams assigned to routes
- Includes name

### routes
- Main routes with trip information
- Includes name, trip ID, date, status, and assigned team

### stops
- Collection points and drop-off points within routes
- Includes sequence, name, address, type, status, and contact information

### samples
- Samples collected at stops
- Can be registered or unregistered
- Includes type, status, quantity, and collection information

### attachments
- Files attached to stops
- Includes name, type, URL, and size
