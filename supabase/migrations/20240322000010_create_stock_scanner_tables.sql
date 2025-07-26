-- Stock Scanner Tables

-- Screening Rules Table
CREATE TABLE IF NOT EXISTS public.screening_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    rules jsonb NOT NULL DEFAULT '{}',
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Stock Analysis Results Table
CREATE TABLE IF NOT EXISTS public.stock_analysis (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    screening_rule_id uuid REFERENCES public.screening_rules(id) ON DELETE CASCADE,
    symbol text NOT NULL,
    company_name text,
    sector text,
    market_cap bigint,
    current_price decimal(10,2),
    pe_ratio decimal(8,2),
    pb_ratio decimal(8,2),
    debt_to_equity decimal(8,2),
    roe decimal(8,2),
    revenue_growth decimal(8,2),
    profit_growth decimal(8,2),
    dividend_yield decimal(8,2),
    ai_score decimal(3,1),
    ai_analysis jsonb DEFAULT '{}',
    technical_indicators jsonb DEFAULT '{}',
    news_sentiment jsonb DEFAULT '{}',
    recommendation text,
    risk_level text,
    target_price decimal(10,2),
    stop_loss decimal(10,2),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Stock Watchlist Table
CREATE TABLE IF NOT EXISTS public.stock_watchlist (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    symbol text NOT NULL,
    company_name text,
    added_price decimal(10,2),
    target_price decimal(10,2),
    stop_loss decimal(10,2),
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, symbol)
);

-- Stock Scanner History Table
CREATE TABLE IF NOT EXISTS public.scanner_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    screening_rule_id uuid REFERENCES public.screening_rules(id) ON DELETE CASCADE,
    scan_date timestamp with time zone DEFAULT timezone('utc'::text, now()),
    total_stocks_scanned integer DEFAULT 0,
    stocks_passed integer DEFAULT 0,
    scan_results jsonb DEFAULT '{}',
    execution_time_ms integer DEFAULT 0
);

-- Enable realtime for all tables
alter publication supabase_realtime add table screening_rules;
alter publication supabase_realtime add table stock_analysis;
alter publication supabase_realtime add table stock_watchlist;
alter publication supabase_realtime add table scanner_history;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_screening_rules_user_id ON public.screening_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_analysis_user_id ON public.stock_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_analysis_symbol ON public.stock_analysis(symbol);
CREATE INDEX IF NOT EXISTS idx_stock_analysis_ai_score ON public.stock_analysis(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_stock_watchlist_user_id ON public.stock_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_scanner_history_user_id ON public.scanner_history(user_id);

-- Insert default screening rules
INSERT INTO public.screening_rules (name, description, rules, is_active) VALUES
('Growth Stocks', 'High growth potential stocks with strong fundamentals', '{
  "market_cap_min": 1000000000,
  "pe_ratio_max": 30,
  "revenue_growth_min": 15,
  "profit_growth_min": 20,
  "debt_to_equity_max": 0.5,
  "roe_min": 15
}', true),
('Value Stocks', 'Undervalued stocks with strong fundamentals', '{
  "market_cap_min": 500000000,
  "pe_ratio_max": 15,
  "pb_ratio_max": 1.5,
  "debt_to_equity_max": 0.6,
  "roe_min": 12,
  "dividend_yield_min": 2
}', true),
('Dividend Stocks', 'High dividend yielding stocks for income investors', '{
  "market_cap_min": 1000000000,
  "dividend_yield_min": 4,
  "pe_ratio_max": 20,
  "debt_to_equity_max": 0.7,
  "roe_min": 10
}', true),
('Small Cap Growth', 'Small cap stocks with high growth potential', '{
  "market_cap_min": 100000000,
  "market_cap_max": 2000000000,
  "revenue_growth_min": 25,
  "profit_growth_min": 30,
  "pe_ratio_max": 25,
  "debt_to_equity_max": 0.4
}', true);

-- Insert sample stock data for demonstration
INSERT INTO public.stock_analysis (symbol, company_name, sector, market_cap, current_price, pe_ratio, pb_ratio, debt_to_equity, roe, revenue_growth, profit_growth, dividend_yield, ai_score, recommendation, risk_level, target_price, stop_loss) VALUES
('RELIANCE.NS', 'Reliance Industries Limited', 'Oil & Gas', 1800000000000, 2847.50, 12.5, 1.8, 0.3, 18.5, 12.3, 15.8, 0.5, 8.2, 'BUY', 'Medium', 3200.00, 2500.00),
('TCS.NS', 'Tata Consultancy Services', 'Information Technology', 1200000000000, 3245.75, 28.4, 12.5, 0.1, 45.2, 8.7, 12.4, 1.2, 9.1, 'BUY', 'Low', 3800.00, 2900.00),
('HDFCBANK.NS', 'HDFC Bank Limited', 'Banking', 850000000000, 1542.30, 18.7, 2.1, 0.8, 16.8, 14.2, 18.9, 1.8, 7.8, 'HOLD', 'Medium', 1750.00, 1350.00),
('INFY.NS', 'Infosys Limited', 'Information Technology', 650000000000, 1567.85, 24.3, 8.9, 0.2, 28.4, 6.5, 9.8, 2.1, 8.5, 'BUY', 'Low', 1800.00, 1400.00),
('ITC.NS', 'ITC Limited', 'FMCG', 450000000000, 365.20, 22.1, 4.2, 0.1, 19.2, 5.8, 8.3, 4.2, 7.2, 'HOLD', 'Low', 420.00, 320.00),
('HINDUNILVR.NS', 'Hindustan Unilever Limited', 'FMCG', 520000000000, 2234.60, 58.7, 12.8, 0.2, 21.8, 4.2, 6.7, 1.9, 6.8, 'HOLD', 'Low', 2500.00, 2000.00),
('BAJFINANCE.NS', 'Bajaj Finance Limited', 'Financial Services', 380000000000, 6187.45, 28.9, 4.5, 3.2, 15.6, 22.4, 28.7, 0.8, 8.9, 'BUY', 'High', 7200.00, 5500.00),
('MARUTI.NS', 'Maruti Suzuki India Limited', 'Automobile', 290000000000, 9567.30, 24.6, 3.1, 0.3, 12.8, 18.5, 22.1, 1.5, 7.9, 'BUY', 'Medium', 11000.00, 8500.00);
