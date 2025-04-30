# Supabase Setup Guide for B2B Logistics App

## Project Information

- **Project URL**: https://supabase.com/dashboard/project/wnvonjgjusywqewejeho
- **API URL**: https://wnvonjgjusywqewejeho.supabase.co
- **API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indudm9uamdqdXN5d3Fld2VqZWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTU3NzIsImV4cCI6MjA2MDQ3MTc3Mn0.8jNkNE3XKs11e_EIfkeoRtZd53GVNDIja0_X-uxOQ6g

This guide will walk you through setting up Supabase for the B2B Logistics App.

## Step 1: Access Your Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Sign in to your account
3. Select your project "B2B Logistics App"

## Step 2: Set Up the Database Schema

1. In the Supabase dashboard, navigate to the "SQL Editor" section
2. Click "New Query"
3. Open the file `supabase/schema.sql` from this repository
4. Copy the entire contents of the file
5. Paste the SQL into the query editor in Supabase
6. Click "Run" to execute the SQL and create all tables and sample data

## Step 3: Verify the Setup

1. In the Supabase dashboard, navigate to the "Table Editor" section
2. You should see the following tables:
   - organizations
   - partners
   - teams
   - routes
   - stops
   - samples
   - attachments
3. Click on the "routes" table and verify that there are entries, including one with the trip ID "TR-20250422-001"

## Step 4: Test the Connection

1. Start your application with `npm run dev`
2. Navigate to the Trip Management page
3. Try searching for "TR-20250422-001" in the search bar
4. You should see the route with this trip ID

## Troubleshooting

If you encounter any issues:

1. Check that your `.env` file has the correct Supabase URL and API key
2. Make sure all the SQL statements executed successfully
3. Check the browser console for any error messages
4. Try restarting the application

## Database Schema

The database consists of the following tables:

- **organizations**: Stores information about organizations (hospitals, clinics, labs)
- **partners**: Pickup partners who handle the routes
- **teams**: Teams assigned to routes
- **routes**: Main routes with trip information
- **stops**: Collection points and drop-off points within routes
- **samples**: Samples collected at stops (registered or unregistered)
- **attachments**: Files attached to stops
