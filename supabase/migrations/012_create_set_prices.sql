-- Separate prices table for multi-currency, multi-source retail prices.
-- Supports unlimited currencies and price sources without schema changes.
-- See agent_docs/future-features.md for upgrade path (v1.5 multi-currency, v2 market value).

CREATE TABLE set_prices (
  set_num TEXT NOT NULL REFERENCES lego_sets(set_num) ON DELETE CASCADE,
  currency CHAR(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  retail_price NUMERIC(10,2) NOT NULL,
  source TEXT NOT NULL DEFAULT 'brickset',
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (set_num, currency, source)
);

-- Index for "show me all prices in EUR" queries (vault display)
CREATE INDEX idx_set_prices_currency ON set_prices(currency, set_num);

-- Enable Row Level Security
ALTER TABLE set_prices ENABLE ROW LEVEL SECURITY;

-- Prices are public read-only data
CREATE POLICY "Anyone can read prices"
  ON set_prices FOR SELECT
  USING (true);

-- Only service role can insert/update (sync scripts run server-side)
CREATE POLICY "Service role can manage prices"
  ON set_prices FOR ALL
  USING (auth.role() = 'service_role');

-- Auto-update updated_at on upsert so we can track price freshness
CREATE OR REPLACE FUNCTION set_prices_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_prices_updated_at_trigger
  BEFORE UPDATE ON set_prices
  FOR EACH ROW EXECUTE FUNCTION set_prices_updated_at();
