CREATE TABLE IF NOT EXISTS portfolio_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  portfolio_value DECIMAL(15,2) NOT NULL,
  gain_percent DECIMAL(5,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_entries_user_id ON portfolio_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_entries_date ON portfolio_entries(entry_date);

alter publication supabase_realtime add table portfolio_entries;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_entries_updated_at BEFORE UPDATE
    ON portfolio_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();