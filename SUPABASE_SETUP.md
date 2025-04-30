# Setting Up Supabase for B2B Logistics App

This guide will walk you through setting up Supabase as the backend for your B2B Logistics App.

## Project Information

- **Project Name**: B2B Logistics App
- **Project ID**: wnvonjgjusywqewejeho
- **Project URL**: https://supabase.com/dashboard/project/wnvonjgjusywqewejeho
- **API URL**: https://wnvonjgjusywqewejeho.supabase.co
- **API Key**: sbp_e32eba27975a890a601b4db9f563ad10b74fc9e5
- **JWT Secret**: iqJrewzQZ4E4LAO7LOALJ4HOxA6/XS3YD5pRzPJlzFlv790Ajx+m47LeIK99V65488k4qjacxE0gV3966z8trw==

## Step 1: Test the Connection

First, test the connection to your Supabase project:

```bash
npm run test-connection
```

This script will check if your application can connect to the Supabase project.

## Step 2: Check Existing Tables

Check what tables already exist in your Supabase project:

```bash
npm run check-supabase
```

This script will list all existing tables and check if the required tables for the B2B Logistics App exist.

## Step 3: Create Required Tables

If any required tables are missing, create them:

```bash
npm run create-tables
```

This script will create the following tables if they don't exist:
- organizations
- partners
- teams
- routes
- stops
- samples
- attachments

## Step 4: Start the Application

Start the application to test the Supabase integration:

```bash
npm run dev
```

## Step 5: Explore the Integration

The application includes several ways to explore the Supabase integration:

1. **Trip Management Page**: Navigate to `/trip-management` to see the main application using Supabase data
2. **Supabase Demo Page**: Navigate to `/supabase-demo` to see examples of fetching data from Supabase
3. **Check Tables Page**: Navigate to `/check-tables` to see what tables exist in your Supabase project

## Troubleshooting

If you encounter any issues with the Supabase integration:

1. **Connection Issues**
   - Check that your Supabase URL and API key are correct
   - Make sure your Supabase project is active
   - Try running the `test-connection` script to diagnose connection issues

2. **Missing Tables**
   - Run the `check-supabase` script to see what tables are missing
   - Run the `create-tables` script to create missing tables

3. **Data Issues**
   - Check the browser console for error messages
   - Verify that the data in your Supabase tables matches the expected schema
   - Try adding sample data manually through the Supabase dashboard

## Manual Setup in Supabase Dashboard

If you prefer to set up the tables manually:

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard/project/wnvonjgjusywqewejeho)
2. Navigate to the "SQL Editor" section
3. Create a new query
4. Copy the SQL statements from the `scripts/create-tables.js` file
5. Execute the SQL statements to create the tables

## Adding Sample Data

To add sample data to your Supabase project:

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard/project/wnvonjgjusywqewejeho)
2. Navigate to the "Table Editor" section
3. Select a table (e.g., "routes")
4. Click "Insert Row" to add sample data
5. Fill in the required fields and click "Save"

Alternatively, you can use the SQL Editor to insert sample data using SQL statements.

## Next Steps

Now that you have Supabase set up, you can:

1. Modify the API services in `src/services/api.ts` to fit your specific requirements
2. Integrate the API services into your existing components
3. Add authentication using Supabase Auth
4. Set up real-time subscriptions for live updates

For more information, refer to the [Supabase documentation](https://supabase.com/docs).
