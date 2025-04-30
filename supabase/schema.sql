-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up realtime
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;

-- Create tables
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

CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

-- Add realtime to tables
ALTER PUBLICATION supabase_realtime ADD TABLE organizations;
ALTER PUBLICATION supabase_realtime ADD TABLE partners;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE routes;
ALTER PUBLICATION supabase_realtime ADD TABLE stops;
ALTER PUBLICATION supabase_realtime ADD TABLE samples;
ALTER PUBLICATION supabase_realtime ADD TABLE attachments;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_routes_date ON routes(date);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);
CREATE INDEX IF NOT EXISTS idx_stops_route_id ON stops(route_id);
CREATE INDEX IF NOT EXISTS idx_stops_status ON stops(status);
CREATE INDEX IF NOT EXISTS idx_samples_stop_id ON samples(stop_id);
CREATE INDEX IF NOT EXISTS idx_attachments_stop_id ON attachments(stop_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON partners
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON teams
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
BEFORE UPDATE ON routes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stops_updated_at
BEFORE UPDATE ON stops
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_samples_updated_at
BEFORE UPDATE ON samples
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attachments_updated_at
BEFORE UPDATE ON attachments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
-- Teams
INSERT INTO teams (name) VALUES
  ('Team Alpha'),
  ('Team Beta'),
  ('Team Gamma'),
  ('Team Delta');

-- Partners
INSERT INTO partners (name, contact) VALUES
  ('MedLab Partners', '+1-555-123-4567'),
  ('HealthCare Labs', '+1-555-987-6543'),
  ('City Medical Center', '+1-555-456-7890');

-- Organizations
INSERT INTO organizations (name, address, city, state, zip, contact_name, contact_phone, payment_type) VALUES
  ('General Hospital', '123 Main St', 'New York', 'NY', '10001', 'John Smith', '+1-555-111-2222', 'prepaid'),
  ('Community Clinic', '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'Jane Doe', '+1-555-333-4444', 'postpaid'),
  ('Urgent Care Center', '789 Pine Rd', 'Chicago', 'IL', '60601', 'Robert Johnson', '+1-555-555-6666', 'walkin'),
  ('Family Practice', '321 Elm St', 'Houston', 'TX', '77001', 'Sarah Williams', '+1-555-777-8888', 'prepaid'),
  ('Specialty Lab', '654 Maple Dr', 'Phoenix', 'AZ', '85001', 'Michael Brown', '+1-555-999-0000', 'postpaid'),
  ('Research Institute', '987 Cedar Ln', 'Philadelphia', 'PA', '19101', 'Emily Davis', '+1-555-222-3333', 'prepaid'),
  ('Medical Center', '159 Birch Blvd', 'San Antonio', 'TX', '78201', 'David Miller', '+1-555-444-5555', 'walkin'),
  ('Health Clinic', '753 Spruce St', 'San Diego', 'CA', '92101', 'Lisa Wilson', '+1-555-666-7777', 'prepaid'),
  ('Diagnostic Center', '246 Willow Way', 'Dallas', 'TX', '75201', 'James Taylor', '+1-555-888-9999', 'postpaid'),
  ('Wellness Center', '135 Aspen Ave', 'San Jose', 'CA', '95101', 'Jennifer Martinez', '+1-555-000-1111', 'prepaid');

-- Create a function to generate routes with stops, samples, and attachments
CREATE OR REPLACE FUNCTION generate_sample_data()
RETURNS VOID AS $$
DECLARE
  route_id UUID;
  stop_id UUID;
  partner_id UUID;
  team_name TEXT;
  org_record RECORD;
  stop_count INTEGER;
  sample_types TEXT[] := ARRAY['Blood', 'Urine', 'Tissue', 'Saliva', 'Plasma'];
  statuses TEXT[] := ARRAY['active', 'upcoming', 'completed'];
  i INTEGER;
  j INTEGER;
  k INTEGER;
  trip_date DATE;
  route_status TEXT;
  stop_status TEXT;
BEGIN
  -- Get a partner ID
  SELECT id INTO partner_id FROM partners ORDER BY RANDOM() LIMIT 1;
  
  -- Generate 15 routes with different dates and statuses
  FOR i IN 1..15 LOOP
    -- Generate a date within the last 30 days or next 30 days
    trip_date := CURRENT_DATE + (RANDOM() * 60 - 30)::INTEGER;
    
    -- Determine route status based on date
    IF trip_date < CURRENT_DATE THEN
      route_status := 'completed';
    ELSIF trip_date = CURRENT_DATE THEN
      route_status := 'active';
    ELSE
      route_status := 'upcoming';
    END IF;
    
    -- Sometimes override for variety
    IF RANDOM() < 0.2 AND route_status = 'upcoming' THEN
      route_status := 'cancelled';
    END IF;
    
    -- Select a random team
    SELECT name INTO team_name FROM teams ORDER BY RANDOM() LIMIT 1;
    
    -- Insert route
    INSERT INTO routes (name, trip_id, date, status, assigned_team, partner_id)
    VALUES (
      'Route ' || i,
      'TR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(i::TEXT, 3, '0'),
      trip_date,
      route_status,
      team_name,
      partner_id
    ) RETURNING id INTO route_id;
    
    -- Generate 3-7 stops for each route
    stop_count := 3 + (RANDOM() * 4)::INTEGER;
    
    FOR j IN 1..stop_count LOOP
      -- Get a random organization
      SELECT * INTO org_record FROM organizations ORDER BY RANDOM() LIMIT 1;
      
      -- Determine stop status based on route status
      IF route_status = 'completed' THEN
        stop_status := 'completed';
      ELSIF route_status = 'active' THEN
        IF j <= (stop_count / 2) THEN
          stop_status := 'completed';
        ELSIF j = (stop_count / 2 + 1) THEN
          stop_status := 'in-progress';
        ELSE
          stop_status := 'pending';
        END IF;
      ELSIF route_status = 'upcoming' THEN
        stop_status := 'pending';
      ELSE
        stop_status := 'cancelled';
      END IF;
      
      -- Insert stop
      INSERT INTO stops (
        route_id,
        sequence,
        name,
        address,
        type,
        status,
        time,
        contact_name,
        contact_phone,
        notes
      ) VALUES (
        route_id,
        j,
        org_record.name,
        org_record.address || ', ' || org_record.city || ', ' || org_record.state || ' ' || org_record.zip,
        CASE WHEN j = 1 THEN 'pickup' WHEN RANDOM() < 0.3 THEN 'pickup' ELSE 'dropoff' END,
        stop_status,
        CASE 
          WHEN stop_status IN ('completed', 'in-progress') THEN 
            (CURRENT_DATE + (8 + (RANDOM() * 8)::INTEGER || ' hours')::INTERVAL)::TIME
          ELSE NULL
        END,
        org_record.contact_name,
        org_record.contact_phone,
        CASE WHEN RANDOM() < 0.7 THEN
          CASE (RANDOM() * 5)::INTEGER
            WHEN 0 THEN 'Regular pickup location. Staff is familiar with the collection process.'
            WHEN 1 THEN 'High-priority samples. Ensure proper temperature control during transport.'
            WHEN 2 THEN 'Contact person may be on break during scheduled pickup time. Call ahead.'
            WHEN 3 THEN 'Facility has restricted access. Check in at security desk upon arrival.'
            WHEN 4 THEN 'Multiple departments may have samples ready. Check with reception.'
            ELSE 'Verification at drop-off point. Ensure all documentation is complete.'
          END
        ELSE NULL END
      ) RETURNING id INTO stop_id;
      
      -- Add samples if the stop is completed or in progress
      IF stop_status IN ('completed', 'in-progress') THEN
        -- Add 2-5 registered samples
        FOR k IN 1..(2 + (RANDOM() * 3)::INTEGER) LOOP
          INSERT INTO samples (
            stop_id,
            type,
            status,
            quantity,
            collected_by,
            collection_time
          ) VALUES (
            stop_id,
            sample_types[(RANDOM() * 5)::INTEGER + 1],
            'registered',
            1,
            team_name || ' Collector',
            CASE 
              WHEN stop_status = 'completed' THEN NOW() - (RANDOM() * 24 || ' hours')::INTERVAL
              ELSE NOW() - (RANDOM() * 2 || ' hours')::INTERVAL
            END
          );
        END LOOP;
        
        -- Add 0-3 unregistered samples with 30% probability
        IF RANDOM() < 0.3 THEN
          FOR k IN 1..(RANDOM() * 3)::INTEGER LOOP
            INSERT INTO samples (
              stop_id,
              type,
              status,
              quantity,
              collected_by,
              collection_time
            ) VALUES (
              stop_id,
              sample_types[(RANDOM() * 5)::INTEGER + 1],
              'unregistered',
              1 + (RANDOM() * 3)::INTEGER,
              team_name || ' Collector',
              CASE 
                WHEN stop_status = 'completed' THEN NOW() - (RANDOM() * 24 || ' hours')::INTERVAL
                ELSE NOW() - (RANDOM() * 2 || ' hours')::INTERVAL
              END
            );
          END LOOP;
        END IF;
        
        -- Add 0-2 attachments with 40% probability
        IF RANDOM() < 0.4 THEN
          FOR k IN 1..(RANDOM() * 2)::INTEGER + 1 LOOP
            INSERT INTO attachments (
              stop_id,
              name,
              type,
              url,
              size
            ) VALUES (
              stop_id,
              CASE (RANDOM() * 3)::INTEGER
                WHEN 0 THEN 'Lab Report ' || k
                WHEN 1 THEN 'Sample Image ' || k
                WHEN 2 THEN 'Test Results ' || k
                ELSE 'Document ' || k
              END || CASE (RANDOM() * 3)::INTEGER
                WHEN 0 THEN '.pdf'
                WHEN 1 THEN '.jpg'
                WHEN 2 THEN '.xlsx'
                ELSE '.txt'
              END,
              CASE (RANDOM() * 3)::INTEGER
                WHEN 0 THEN 'pdf'
                WHEN 1 THEN 'image'
                WHEN 2 THEN 'xlsx'
                ELSE 'txt'
              END,
              'https://example.com/attachments/' || stop_id || '/' || k,
              (RANDOM() * 5000000)::INTEGER
            );
          END LOOP;
        END IF;
      END IF;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to generate sample data
SELECT generate_sample_data();

-- Clean up
DROP FUNCTION generate_sample_data();
