-- Direct SQL script for Supabase SQL Editor
-- This script creates all the necessary tables and sample data for the B2B Logistics App

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_routes_date ON routes(date);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);
CREATE INDEX IF NOT EXISTS idx_stops_route_id ON stops(route_id);
CREATE INDEX IF NOT EXISTS idx_stops_status ON stops(status);
CREATE INDEX IF NOT EXISTS idx_samples_stop_id ON samples(stop_id);
CREATE INDEX IF NOT EXISTS idx_attachments_stop_id ON attachments(stop_id);

-- Create function for updated_at timestamps
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

-- Insert sample routes with the specific trip ID
INSERT INTO routes (name, trip_id, date, status, assigned_team, partner_id)
VALUES (
  'Downtown Medical Collection',
  'TR-20250422-001',
  '2025-04-22',
  'active',
  'Team Alpha',
  (SELECT id FROM partners ORDER BY RANDOM() LIMIT 1)
);

-- Insert more sample routes
INSERT INTO routes (name, trip_id, date, status, assigned_team, partner_id)
SELECT 
  'Route ' || i,
  'TR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(i::TEXT, 3, '0'),
  CURRENT_DATE + (i % 10 - 5),
  CASE 
    WHEN i % 4 = 0 THEN 'active'
    WHEN i % 4 = 1 THEN 'upcoming'
    WHEN i % 4 = 2 THEN 'completed'
    ELSE 'cancelled'
  END,
  (SELECT name FROM teams ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM partners ORDER BY RANDOM() LIMIT 1)
FROM generate_series(1, 15) i
WHERE i != 1; -- Skip 1 since we already inserted TR-20250422-001

-- Insert stops for the specific route
INSERT INTO stops (route_id, sequence, name, address, type, status, contact_name, contact_phone, notes)
VALUES
  (
    (SELECT id FROM routes WHERE trip_id = 'TR-20250422-001'),
    1,
    'Central Hospital',
    '123 Main St, New York, NY 10001',
    'pickup',
    'completed',
    'Dr. Johnson',
    '+1-555-123-4567',
    'Regular pickup location. Staff is familiar with the collection process.'
  ),
  (
    (SELECT id FROM routes WHERE trip_id = 'TR-20250422-001'),
    2,
    'City Medical Center',
    '456 Park Ave, New York, NY 10002',
    'pickup',
    'in-progress',
    'Nurse Williams',
    '+1-555-987-6543',
    'High-priority samples. Ensure proper temperature control during transport.'
  ),
  (
    (SELECT id FROM routes WHERE trip_id = 'TR-20250422-001'),
    3,
    'Downtown Clinic',
    '101 First Ave, New York, NY 10004',
    'dropoff',
    'pending',
    'Dr. Roberts',
    '+1-555-234-5678',
    'Urgent samples, high priority'
  );

-- Insert sample stops for other routes
INSERT INTO stops (route_id, sequence, name, address, type, status, contact_name, contact_phone, notes)
SELECT 
  r.id,
  s,
  (SELECT name FROM organizations ORDER BY RANDOM() LIMIT 1),
  (SELECT address || ', ' || city || ', ' || state || ' ' || zip FROM organizations ORDER BY RANDOM() LIMIT 1),
  CASE WHEN s = 1 THEN 'pickup' WHEN s % 3 = 0 THEN 'pickup' ELSE 'dropoff' END,
  CASE 
    WHEN r.status = 'completed' THEN 'completed'
    WHEN r.status = 'active' AND s <= 2 THEN 'completed'
    WHEN r.status = 'active' AND s = 3 THEN 'in-progress'
    WHEN r.status = 'active' THEN 'pending'
    WHEN r.status = 'cancelled' THEN 'cancelled'
    ELSE 'pending'
  END,
  (SELECT contact_name FROM organizations ORDER BY RANDOM() LIMIT 1),
  (SELECT contact_phone FROM organizations ORDER BY RANDOM() LIMIT 1),
  CASE WHEN RANDOM() < 0.7 THEN
    CASE (s % 6)
      WHEN 0 THEN 'Regular pickup location. Staff is familiar with the collection process.'
      WHEN 1 THEN 'High-priority samples. Ensure proper temperature control during transport.'
      WHEN 2 THEN 'Contact person may be on break during scheduled pickup time. Call ahead.'
      WHEN 3 THEN 'Facility has restricted access. Check in at security desk upon arrival.'
      WHEN 4 THEN 'Multiple departments may have samples ready. Check with reception.'
      ELSE 'Verification at drop-off point. Ensure all documentation is complete.'
    END
  ELSE NULL END
FROM routes r, generate_series(1, 5) s
WHERE r.trip_id != 'TR-20250422-001'; -- Skip the route we already added stops to

-- Insert samples for the specific route
INSERT INTO samples (stop_id, type, status, quantity, collected_by, collection_time)
VALUES
  (
    (SELECT s.id FROM stops s JOIN routes r ON s.route_id = r.id WHERE r.trip_id = 'TR-20250422-001' AND s.sequence = 1),
    'Blood',
    'registered',
    1,
    'Team Alpha Collector',
    NOW() - INTERVAL '2 hours'
  ),
  (
    (SELECT s.id FROM stops s JOIN routes r ON s.route_id = r.id WHERE r.trip_id = 'TR-20250422-001' AND s.sequence = 1),
    'Urine',
    'registered',
    1,
    'Team Alpha Collector',
    NOW() - INTERVAL '2 hours'
  ),
  (
    (SELECT s.id FROM stops s JOIN routes r ON s.route_id = r.id WHERE r.trip_id = 'TR-20250422-001' AND s.sequence = 1),
    'Tissue',
    'registered',
    1,
    'Team Alpha Collector',
    NOW() - INTERVAL '2 hours'
  ),
  (
    (SELECT s.id FROM stops s JOIN routes r ON s.route_id = r.id WHERE r.trip_id = 'TR-20250422-001' AND s.sequence = 2),
    'Blood',
    'unregistered',
    2,
    'Team Alpha Collector',
    NOW() - INTERVAL '1 hour'
  );

-- Insert sample registered samples for other stops
INSERT INTO samples (stop_id, type, status, quantity, collected_by, collection_time)
SELECT 
  s.id,
  CASE (i % 5)
    WHEN 0 THEN 'Blood'
    WHEN 1 THEN 'Urine'
    WHEN 2 THEN 'Tissue'
    WHEN 3 THEN 'Saliva'
    ELSE 'Plasma'
  END,
  'registered',
  1,
  r.assigned_team || ' Collector',
  NOW() - ((RANDOM() * 5)::INTEGER || ' hours')::INTERVAL
FROM stops s
JOIN routes r ON s.route_id = r.id
CROSS JOIN generate_series(1, 3) i
WHERE s.status IN ('completed', 'in-progress')
AND s.id NOT IN (SELECT stop_id FROM samples); -- Skip stops we already added samples to

-- Insert sample unregistered samples
INSERT INTO samples (stop_id, type, status, quantity, collected_by, collection_time)
SELECT 
  s.id,
  CASE (i % 5)
    WHEN 0 THEN 'Blood'
    WHEN 1 THEN 'Urine'
    WHEN 2 THEN 'Tissue'
    WHEN 3 THEN 'Saliva'
    ELSE 'Plasma'
  END,
  'unregistered',
  1 + (RANDOM() * 3)::INTEGER,
  r.assigned_team || ' Collector',
  NOW() - ((RANDOM() * 5)::INTEGER || ' hours')::INTERVAL
FROM stops s
JOIN routes r ON s.route_id = r.id
CROSS JOIN generate_series(1, 2) i
WHERE s.status IN ('completed', 'in-progress')
AND RANDOM() < 0.3;

-- Insert sample attachments
INSERT INTO attachments (stop_id, name, type, url, size)
SELECT 
  s.id,
  CASE (i % 4)
    WHEN 0 THEN 'Lab Report ' || i
    WHEN 1 THEN 'Sample Image ' || i
    WHEN 2 THEN 'Test Results ' || i
    ELSE 'Document ' || i
  END || CASE (i % 4)
    WHEN 0 THEN '.pdf'
    WHEN 1 THEN '.jpg'
    WHEN 2 THEN '.xlsx'
    ELSE '.txt'
  END,
  CASE (i % 4)
    WHEN 0 THEN 'pdf'
    WHEN 1 THEN 'image'
    WHEN 2 THEN 'xlsx'
    ELSE 'txt'
  END,
  'https://example.com/attachments/' || s.id || '/' || i,
  (RANDOM() * 5000000)::INTEGER
FROM stops s
CROSS JOIN generate_series(1, 2) i
WHERE s.status IN ('completed', 'in-progress')
AND RANDOM() < 0.4;
