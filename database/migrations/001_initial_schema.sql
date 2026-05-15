-- Zamboanga Sibugay Smart Provincial Governance Platform
-- Initial Schema with RLS

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM (
  'governor_super_admin',
  'ict_admin',
  'department_admin',
  'staff',
  'citizen'
);

CREATE TYPE complaint_status AS ENUM (
  'pending',
  'under_review',
  'resolved'
);

CREATE TYPE complaint_category AS ENUM (
  'roads',
  'flooding',
  'health',
  'garbage',
  'water',
  'electricity',
  'others'
);

CREATE TYPE incident_severity AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE incident_category AS ENUM (
  'flood',
  'fire',
  'landslide',
  'accident',
  'rescue'
);

CREATE TYPE incident_status AS ENUM (
  'reported',
  'active',
  'responding',
  'resolved',
  'closed'
);

CREATE TYPE notification_type AS ENUM (
  'info',
  'alert',
  'announcement',
  'complaint_update',
  'incident_update',
  'system'
);

CREATE TYPE report_status AS ENUM (
  'draft',
  'submitted',
  'approved',
  'rejected'
);

-- Departments
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  head_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'citizen',
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  phone VARCHAR(50),
  municipality VARCHAR(255),
  barangay VARCHAR(255),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaints
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category complaint_category NOT NULL,
  status complaint_status DEFAULT 'pending',
  municipality VARCHAR(255) NOT NULL,
  barangay VARCHAR(255),
  image_url TEXT,
  assigned_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  admin_response TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incidents (DRRM)
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number VARCHAR(20) UNIQUE NOT NULL,
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category incident_category NOT NULL,
  severity incident_severity NOT NULL,
  status incident_status DEFAULT 'reported',
  municipality VARCHAR(255) NOT NULL,
  barangay VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  assigned_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  is_emergency BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  type notification_type DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  is_broadcast BOOLEAN DEFAULT false,
  link_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Department Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  report_type VARCHAR(100),
  document_url TEXT,
  status report_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_user ON complaints(user_id);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_created ON complaints(created_at DESC);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_created ON incidents(created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX idx_reports_department ON reports(department_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_complaints_updated BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_incidents_updated BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_departments_updated BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_reports_updated BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_announcements_updated BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Reference number generators
CREATE OR REPLACE FUNCTION generate_complaint_ref()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
    NEW.reference_number := 'CMP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(uuid_generate_v4()::text, 1, 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_incident_ref()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
    NEW.reference_number := 'INC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(uuid_generate_v4()::text, 1, 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_complaint_ref BEFORE INSERT ON complaints FOR EACH ROW EXECUTE FUNCTION generate_complaint_ref();
CREATE TRIGGER tr_incident_ref BEFORE INSERT ON incidents FOR EACH ROW EXECUTE FUNCTION generate_incident_ref();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'citizen')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Helper: get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() IN ('governor_super_admin', 'ict_admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_governor()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'governor_super_admin';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_department_staff()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() IN ('department_admin', 'staff');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Departments policies
CREATE POLICY "Departments viewable by authenticated" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Departments manageable by admins" ON departments FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT TO authenticated USING (id = auth.uid() OR is_admin() OR is_governor());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Admins manage users" ON users FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Complaints policies
CREATE POLICY "Citizens view own complaints" ON complaints FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_admin() OR is_governor() OR (is_department_staff() AND assigned_department_id = (SELECT department_id FROM users WHERE id = auth.uid())));
CREATE POLICY "Citizens create complaints" ON complaints FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Staff update assigned complaints" ON complaints FOR UPDATE TO authenticated
  USING (is_admin() OR is_governor() OR (is_department_staff() AND assigned_department_id = (SELECT department_id FROM users WHERE id = auth.uid())));

-- Incidents policies
CREATE POLICY "View incidents by role" ON incidents FOR SELECT TO authenticated
  USING (reported_by = auth.uid() OR is_admin() OR is_governor() OR is_department_staff());
CREATE POLICY "Create incidents" ON incidents FOR INSERT TO authenticated WITH CHECK (reported_by = auth.uid());
CREATE POLICY "Manage incidents" ON incidents FOR UPDATE TO authenticated USING (is_admin() OR is_governor() OR is_department_staff());

-- Notifications policies
CREATE POLICY "View own notifications" ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL OR is_admin());
CREATE POLICY "Update own notifications" ON notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins create notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (is_admin() OR is_governor());

-- Reports policies
CREATE POLICY "Department reports view" ON reports FOR SELECT TO authenticated
  USING (is_admin() OR is_governor() OR department_id = (SELECT department_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Department reports create" ON reports FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid() AND department_id = (SELECT department_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Department reports update" ON reports FOR UPDATE TO authenticated
  USING (submitted_by = auth.uid() OR is_admin());

-- Activity logs policies
CREATE POLICY "View activity logs" ON activity_logs FOR SELECT TO authenticated USING (is_admin() OR is_governor());
CREATE POLICY "Insert activity logs" ON activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Announcements policies
CREATE POLICY "View published announcements" ON announcements FOR SELECT TO authenticated USING (is_published = true OR is_admin());
CREATE POLICY "Manage announcements" ON announcements FOR ALL TO authenticated USING (is_admin() OR is_governor()) WITH CHECK (is_admin() OR is_governor());

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
