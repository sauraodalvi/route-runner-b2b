# Supabase Setup for Route Runner B2B

This document provides instructions for setting up the Supabase backend for the Route Runner B2B application.

## Prerequisites

- A Supabase account
- Access to the Supabase project dashboard

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in to your account
2. Create a new project
3. Note your project URL and anon key (public API key)

### 2. Set Up the Database Schema

1. Navigate to the SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy the contents of `schema.sql` from this directory
4. Run the SQL script to create all tables, functions, and sample data

### 3. Configure Storage

1. Go to the Storage section in your Supabase dashboard
2. Create a new bucket called `route-runner-attachments`
3. Set the bucket's privacy to "Public"
4. Configure CORS for the bucket to allow uploads from your application domain

### 4. Update Environment Variables

1. Copy the `.env.example` file to `.env` in the root of your project
2. Update the Supabase URL and anon key with your project's values:

```
VITE_SUPABASE_URL=https://your-supabase-project-url.supabase.co
VITE_SUPABASE_KEY=your-supabase-anon-key
```

## Database Schema

The database consists of the following tables:

### Organizations
- Stores information about organizations (hospitals, clinics, labs)
- Includes contact information and payment type

### Partners
- Pickup partners who handle the routes
- Includes name and contact information

### Teams
- Teams assigned to routes
- Includes name

### Routes
- Main routes with trip information
- Includes name, trip ID, date, status, and assigned team

### Stops
- Collection points and drop-off points within routes
- Includes sequence, name, address, type, status, and contact information

### Samples
- Samples collected at stops
- Can be registered or unregistered
- Includes type, status, quantity, and collection information

### Attachments
- Files attached to stops
- Includes name, type, URL, and size

## API Services

The application interacts with Supabase through the API services defined in `src/services/api.ts`. These services provide functions for:

- Fetching, creating, and updating routes
- Managing stops and their statuses
- Adding samples
- Uploading attachments
- Getting organizations, teams, and partners

## Sample Data

The schema includes a function to generate sample data, which creates:

- 15 routes with different dates and statuses
- 3-7 stops per route
- Registered and unregistered samples for completed and in-progress stops
- Attachments for some stops

This sample data allows you to test the application without having to create data manually.

## Troubleshooting

If you encounter issues with the setup:

1. Check that all tables were created correctly in the Database section of your Supabase dashboard
2. Verify that the sample data was generated
3. Ensure your environment variables are set correctly
4. Check the browser console for any API errors
