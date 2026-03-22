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
