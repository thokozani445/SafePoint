-- SafePoint MVP Database Schema
-- Run this in Supabase SQL Editor

-- Table 1: SafePoint Locations
CREATE TABLE IF NOT EXISTS safepoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('branch', 'atm', 'merchant')),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  contact_number TEXT,
  hours TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: Incidents (SafePoint requests)
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  safepoint_id UUID REFERENCES safepoints(id),
  staff_pin TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'escalated')),
  actions_taken JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  response_time_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Table 3: System Configuration
CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_safepoints_city ON safepoints(city);
CREATE INDEX IF NOT EXISTS idx_safepoints_type ON safepoints(type);
CREATE INDEX IF NOT EXISTS idx_safepoints_active ON safepoints(is_active);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_created ON incidents(created_at DESC);

-- Insert initial system config (with conflict handling)
INSERT INTO system_config (key, value) VALUES
  ('current_code_phrase', 'Is Angela on shift?'),
  ('phrase_updated_at', NOW()::text)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Sample SafePoint locations (Johannesburg area)
INSERT INTO safepoints (name, type, address, city, latitude, longitude, contact_number, hours) VALUES
  ('FNB Rosebank Branch', 'branch', '50 Bath Avenue, Rosebank', 'Johannesburg', -26.146800, 28.040700, '0875759405', '09:00-17:00 Mon-Fri, 09:00-13:00 Sat'),
  ('FNB Sandton City Branch', 'branch', 'Sandton City Shopping Centre', 'Johannesburg', -26.107600, 28.056700, '0875759405', '09:00-17:00 Mon-Fri, 09:00-13:00 Sat'),
  ('FNB Braamfontein Branch', 'branch', 'Jorissen Street, Braamfontein', 'Johannesburg', -26.195300, 28.033600, '0875759405', '09:00-17:00 Mon-Fri'),
  ('FNB Melrose Arch Branch', 'branch', 'Melrose Arch Shopping Centre', 'Johannesburg', -26.130200, 28.080100, '0875759405', '09:00-17:00 Mon-Fri, 09:00-13:00 Sat'),
  ('FNB Eastgate ATM', 'atm', 'Eastgate Shopping Centre', 'Johannesburg', -26.189500, 28.124800, NULL, '24/7'),
  ('FNB Cresta ATM', 'atm', 'Cresta Shopping Centre', 'Johannesburg', -26.122900, 27.990800, NULL, '24/7'),
  ('FNB Southgate ATM', 'atm', 'Southgate Shopping Centre', 'Johannesburg', -26.272400, 27.994600, NULL, '24/7'),
  ('Clicks Sandton City', 'merchant', 'Sandton City Shopping Centre', 'Johannesburg', -26.107600, 28.056700, '0114478600', '09:00-21:00 Daily'),
  ('Clicks Rosebank Mall', 'merchant', 'Rosebank Mall', 'Johannesburg', -26.146800, 28.040700, '0117885600', '09:00-21:00 Daily'),
  ('Clicks Eastgate', 'merchant', 'Eastgate Shopping Centre', 'Johannesburg', -26.189500, 28.124800, '0114503700', '09:00-21:00 Daily'),
  ('Dis-Chem Melrose Arch', 'merchant', 'Melrose Arch Shopping Centre', 'Johannesburg', -26.130200, 28.080100, '0117145500', '08:00-20:00 Daily'),
  ('Dis-Chem Sandton', 'merchant', 'Sandton City Shopping Centre', 'Johannesburg', -26.107600, 28.056700, '0112171300', '08:00-20:00 Daily'),
  ('Shell Parktown', 'merchant', 'Empire Road, Parktown', 'Johannesburg', -26.184900, 28.036900, '0114843000', '24/7'),
  ('Shell Rivonia', 'merchant', 'Rivonia Boulevard', 'Johannesburg', -26.053300, 28.059400, '0118030200', '24/7'),
  ('Shell Oxford Road', 'merchant', 'Oxford Road, Rosebank', 'Johannesburg', -26.153400, 28.039900, '0116427100', '24/7'),
  ('Engen Smit Street', 'merchant', 'Smit Street, Braamfontein', 'Johannesburg', -26.197800, 28.036100, '0113391800', '24/7'),
  ('Pick n Pay Rosebank', 'merchant', 'Rosebank Mall', 'Johannesburg', -26.146800, 28.040700, '0117882300', '08:00-20:00 Daily'),
  ('Pick n Pay Norwood', 'merchant', 'Norwood Hypermarket', 'Johannesburg', -26.158100, 28.076800, '0114832400', '08:00-20:00 Daily'),
  ('Checkers Sandton', 'merchant', 'Sandton City Shopping Centre', 'Johannesburg', -26.107600, 28.056700, '0112172600', '08:00-20:00 Daily'),
  ('Woolworths Melrose Arch', 'merchant', 'Melrose Arch Shopping Centre', 'Johannesburg', -26.130200, 28.080100, '0117145300', '08:00-20:00 Daily'),
  ('Spar Parktown', 'merchant', 'Parktown Shopping Centre', 'Johannesburg', -26.184900, 28.036900, '0114841500', '07:00-21:00 Daily'),
  ('Greenside Pharmacy', 'merchant', '74 Gleneagles Road, Greenside', 'Johannesburg', -26.165900, 28.025100, '0116463200', '08:00-18:00 Mon-Fri, 08:00-13:00 Sat'),
  ('Med-E-Care Rosebank', 'merchant', 'Rosebank Mall', 'Johannesburg', -26.146800, 28.040700, '0117888900', '08:00-20:00 Daily'),
  ('Link Pharmacy Sandton', 'merchant', 'Sandton Clinic', 'Johannesburg', -26.107600, 28.056700, '0117835400', '08:00-20:00 Daily'),
  ('FNB Hyde Park ATM', 'atm', 'Hyde Park Corner', 'Johannesburg', -26.130700, 28.032200, NULL, '24/7'),
  ('FNB Killarney ATM', 'atm', 'Killarney Mall', 'Johannesburg', -26.162500, 28.040000, NULL, '24/7')
ON CONFLICT DO NOTHING;

-- Add Cape Town locations
INSERT INTO safepoints (name, type, address, city, latitude, longitude, contact_number, hours) VALUES
  ('FNB Adderley Street Branch', 'branch', 'Adderley Street, Cape Town CBD', 'Cape Town', -33.924100, 18.423800, '0875759405', '09:00-17:00 Mon-Fri'),
  ('FNB V&A Waterfront Branch', 'branch', 'Victoria & Alfred Waterfront', 'Cape Town', -33.905700, 18.421400, '0875759405', '09:00-17:00 Mon-Fri, 09:00-13:00 Sat'),
  ('FNB Canal Walk Branch', 'branch', 'Canal Walk Shopping Centre', 'Cape Town', -33.885300, 18.508800, '0875759405', '09:00-17:00 Mon-Fri, 09:00-13:00 Sat'),
  ('Clicks V&A Waterfront', 'merchant', 'Victoria Wharf Shopping Centre', 'Cape Town', -33.905700, 18.421400, '0214252300', '09:00-21:00 Daily'),
  ('Dis-Chem Canal Walk', 'merchant', 'Canal Walk Shopping Centre', 'Cape Town', -33.885300, 18.508800, '0215556200', '08:00-20:00 Daily'),
  ('Shell N1 City', 'merchant', 'N1 City Mall', 'Cape Town', -33.904900, 18.504400, '0215952100', '24/7'),
  ('Pick n Pay V&A', 'merchant', 'Victoria Wharf', 'Cape Town', -33.905700, 18.421400, '0214255800', '08:00-21:00 Daily'),
  ('Woolworths Gardens', 'merchant', 'Gardens Centre', 'Cape Town', -33.937400, 18.415100, '0214657600', '08:00-19:00 Daily'),
  ('FNB Gardens ATM', 'atm', 'Mill Street, Gardens', 'Cape Town', -33.937400, 18.415100, NULL, '24/7'),
  ('FNB Sea Point ATM', 'atm', 'Main Road, Sea Point', 'Cape Town', -33.924200, 18.389500, NULL, '24/7')
ON CONFLICT DO NOTHING;

-- Disable Row Level Security for MVP (enable in production!)
ALTER TABLE safepoints DISABLE ROW LEVEL SECURITY;
ALTER TABLE incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_config DISABLE ROW LEVEL SECURITY;

-- Grant access to anon role (for demo purposes only!)
GRANT ALL ON safepoints TO anon;
GRANT ALL ON incidents TO anon;
GRANT ALL ON system_config TO anon;
GRANT USAGE ON SCHEMA public TO anon;