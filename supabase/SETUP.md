# Setting Up Supabase for B2B Logistics App

This guide will help you set up Supabase for your B2B Logistics App.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in to your account
2. Create a new project named "B2B Logistics App"
3. Choose a strong database password and save it securely
4. Select a region closest to your users
5. Wait for your project to be created (this may take a few minutes)

## Step 2: Set Up the Database Schema

1. In your Supabase dashboard, navigate to the "SQL Editor" section
2. Create a new query
3. Copy the contents of the `simple-schema.sql` file from this directory
4. Paste the SQL into the query editor
5. Run the query to create all tables and sample data

## Step 3: Configure Storage for Attachments

1. Go to the "Storage" section in your Supabase dashboard
2. Create a new bucket called `route-runner-attachments`
3. Set the bucket's privacy to "Public"
4. Configure CORS for the bucket to allow uploads from your application domain

## Step 4: Update Environment Variables

1. In your Supabase project dashboard, go to "Settings" > "API"
2. Copy your project URL and anon key (public API key)
3. Update the `.env` file in the root of your project with these values:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_KEY=your-supabase-anon-key
```

## Step 5: Test the Connection

1. Start your application with `npm run dev`
2. Navigate to the Supabase Demo page at `/supabase-demo`
3. Verify that the application can connect to Supabase and display data

## Database Schema

The database consists of the following tables:

- **organizations**: Stores information about organizations (hospitals, clinics, labs)
- **partners**: Pickup partners who handle the routes
- **teams**: Teams assigned to routes
- **routes**: Main routes with trip information
- **stops**: Collection points and drop-off points within routes
- **samples**: Samples collected at stops (registered or unregistered)
- **attachments**: Files attached to stops

## Troubleshooting

If you encounter issues:

1. Check that your Supabase URL and API key are correct in the `.env` file
2. Verify that all tables were created successfully in the Database section
3. Check the browser console for any API errors
4. Ensure your Supabase project has the correct permissions set up

For more detailed information, refer to the [Supabase documentation](https://supabase.com/docs).
