-- Create client_logos table
CREATE TABLE IF NOT EXISTS client_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_client_logos_order ON client_logos(order_index, created_at);
CREATE INDEX IF NOT EXISTS idx_client_logos_active ON client_logos(is_active);

-- Enable RLS
ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active logos
CREATE POLICY "Anyone can view active client logos"
  ON client_logos
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users (admins) can do everything
CREATE POLICY "Authenticated users can manage client logos"
  ON client_logos
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_client_logos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER client_logos_updated_at
  BEFORE UPDATE ON client_logos
  FOR EACH ROW
  EXECUTE FUNCTION update_client_logos_updated_at();

-- Insert some placeholder logos
INSERT INTO client_logos (name, logo_url, alt_text, order_index, is_active) VALUES
  ('Client Company 1', 'https://via.placeholder.com/200x100/C19A6B/FFFFFF?text=Client+1', 'Client Company 1', 1, true),
  ('Client Company 2', 'https://via.placeholder.com/200x100/9A4818/FFFFFF?text=Client+2', 'Client Company 2', 2, true),
  ('Client Company 3', 'https://via.placeholder.com/200x100/C19A6B/FFFFFF?text=Client+3', 'Client Company 3', 3, true),
  ('Client Company 4', 'https://via.placeholder.com/200x100/9A4818/FFFFFF?text=Client+4', 'Client Company 4', 4, true),
  ('Client Company 5', 'https://via.placeholder.com/200x100/C19A6B/FFFFFF?text=Client+5', 'Client Company 5', 5, true),
  ('Client Company 6', 'https://via.placeholder.com/200x100/9A4818/FFFFFF?text=Client+6', 'Client Company 6', 6, true),
  ('Client Company 7', 'https://via.placeholder.com/200x100/C19A6B/FFFFFF?text=Client+7', 'Client Company 7', 7, true),
  ('Client Company 8', 'https://via.placeholder.com/200x100/9A4818/FFFFFF?text=Client+8', 'Client Company 8', 8, true)
ON CONFLICT DO NOTHING;
