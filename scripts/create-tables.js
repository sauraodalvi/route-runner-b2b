// This script creates the necessary tables in Supabase if they don't exist
// Run with: node scripts/create-tables.js

import { createClient } from '@supabase/supabase-js';

// B2B Logistics App - Supabase Configuration
const supabaseUrl = 'https://wnvonjgjusywqewejeho.supabase.co';
const supabaseKey = 'sbp_e32eba27975a890a601b4db9f563ad10b74fc9e5';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// SQL statements to create tables
const createOrganizationsTable = `
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  payment_type TEXT CHECK (payment_type IN ('walkin', 'prepaid', 'postpaid')) NOT NULL DEFAULT 'prepaid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const createPartnersTable = `
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const createTeamsTable = `
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const createRoutesTable = `
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  trip_id TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'upcoming', 'completed', 'cancelled')) NOT NULL DEFAULT 'upcoming',
  assigned_team TEXT,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const createStopsTable = `
CREATE TABLE IF NOT EXISTS stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  type TEXT CHECK (type IN ('pickup', 'dropoff')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')) NOT NULL DEFAULT 'pending',
  time TIME,
  contact_name TEXT,
  contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (route_id, sequence)
);
`;

const createSamplesTable = `
CREATE TABLE IF NOT EXISTS samples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stop_id UUID NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT CHECK (status IN ('registered', 'unregistered')) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  collected_by TEXT,
  collection_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const createAttachmentsTable = `
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stop_id UUID NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

// Function to execute SQL
async function executeSQL(sql, tableName) {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(`Error creating ${tableName} table:`, error);
      return false;
    }
    
    console.log(`✅ ${tableName} table created or already exists`);
    return true;
  } catch (error) {
    console.error(`Error creating ${tableName} table:`, error);
    return false;
  }
}

// Function to check if a table exists
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', tableName);
    
    if (error) {
      console.error(`Error checking if ${tableName} table exists:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking if ${tableName} table exists:`, error);
    return false;
  }
}

// Main function to create tables
async function createTables() {
  console.log('Creating tables in Supabase project: B2B Logistics App');
  console.log('Project ID:', 'wnvonjgjusywqewejeho');
  console.log('URL:', supabaseUrl);
  
  try {
    // Check if tables exist
    const organizationsExists = await tableExists('organizations');
    const partnersExists = await tableExists('partners');
    const teamsExists = await tableExists('teams');
    const routesExists = await tableExists('routes');
    const stopsExists = await tableExists('stops');
    const samplesExists = await tableExists('samples');
    const attachmentsExists = await tableExists('attachments');
    
    console.log('\nChecking existing tables:');
    console.log(`- organizations: ${organizationsExists ? '✅ Exists' : '❌ Missing'}`);
    console.log(`- partners: ${partnersExists ? '✅ Exists' : '❌ Missing'}`);
    console.log(`- teams: ${teamsExists ? '✅ Exists' : '❌ Missing'}`);
    console.log(`- routes: ${routesExists ? '✅ Exists' : '❌ Missing'}`);
    console.log(`- stops: ${stopsExists ? '✅ Exists' : '❌ Missing'}`);
    console.log(`- samples: ${samplesExists ? '✅ Exists' : '❌ Missing'}`);
    console.log(`- attachments: ${attachmentsExists ? '✅ Exists' : '❌ Missing'}`);
    
    // Create tables if they don't exist
    console.log('\nCreating missing tables:');
    
    if (!organizationsExists) {
      await executeSQL(createOrganizationsTable, 'organizations');
    } else {
      console.log('✅ organizations table already exists');
    }
    
    if (!partnersExists) {
      await executeSQL(createPartnersTable, 'partners');
    } else {
      console.log('✅ partners table already exists');
    }
    
    if (!teamsExists) {
      await executeSQL(createTeamsTable, 'teams');
    } else {
      console.log('✅ teams table already exists');
    }
    
    if (!routesExists) {
      await executeSQL(createRoutesTable, 'routes');
    } else {
      console.log('✅ routes table already exists');
    }
    
    if (!stopsExists) {
      await executeSQL(createStopsTable, 'stops');
    } else {
      console.log('✅ stops table already exists');
    }
    
    if (!samplesExists) {
      await executeSQL(createSamplesTable, 'samples');
    } else {
      console.log('✅ samples table already exists');
    }
    
    if (!attachmentsExists) {
      await executeSQL(createAttachmentsTable, 'attachments');
    } else {
      console.log('✅ attachments table already exists');
    }
    
    console.log('\nTable creation completed!');
    
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Run the function
createTables();
