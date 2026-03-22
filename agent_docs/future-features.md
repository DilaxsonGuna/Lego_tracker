# Future Feature Upgrades

Post-release upgrade paths for features shipped in v1 with limited scope. Each section documents: current state, upgrade plan, API details, and implementation notes.

---

## Price Data — Upgrade Path

### v1 (Launch): Brickset Retail Prices

**What ships:** US retail prices from Brickset API, stored in `lego_sets.retail_price_usd`.

**Source:** Brickset API v3

- Endpoint: `getSets` method at `https://brickset.com/api/v3.asmx`
- Auth: Free API key from https://brickset.com/tools/webservices/requestkey
- Fields used: `LEGOCom.US.retailPrice`
- Rate limits: Daily limit (unspecified but sufficient for batch sync)
- Sync: Periodic batch job — pull all sets with missing prices, update DB

**Limitations:**

- US retail only (no market value, no other currencies)
- Retired sets show last known retail price (not current market value)
- Not all sets have retail prices (older/rare sets may be null)

---

### v1.5: Multi-Currency Retail Prices

**What to add:** Store retail prices for US, UK, CA, EU regions.

**Schema change:**

```sql
ALTER TABLE lego_sets
  ADD COLUMN IF NOT EXISTS retail_price_gbp DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS retail_price_cad DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS retail_price_eur DECIMAL(10,2);
```

**Source:** Same Brickset API — already returns per-region prices:

- `LEGOCom.US.retailPrice` → `retail_price_usd`
- `LEGOCom.UK.retailPrice` → `retail_price_gbp`
- `LEGOCom.CA.retailPrice` → `retail_price_cad`
- `LEGOCom.DE.retailPrice` → `retail_price_eur`

**UI changes:**

- User setting: preferred currency (default: USD)
- Vault stats hero: show collection value in user's currency
- Vault cards: show price in user's currency
- Fallback: if price missing for selected currency, show USD with conversion note

**Effort:** 2-3 hours (schema + sync update + UI currency selector)

---

### v2: Market Value (Secondary Market Prices)

**What to add:** Current market value for new/used sets based on actual sales data.

**Source: BrickLink API v3**

- URL: `https://api.bricklink.com/api/store/v1`
- Endpoint: `GET /items/SET/{set_num}/price`
- Auth: OAuth 1.0 (Consumer Key + Consumer Secret + Token + Token Secret)
- Requires: BrickLink seller account (free to create)
- Rate limit: 5,000 requests/day
- Returns: `min_price`, `max_price`, `avg_price`, `qty_avg_price` for new/used conditions
- Currency: configurable per request

**Schema change:**

```sql
CREATE TABLE set_market_prices (
  set_num TEXT NOT NULL REFERENCES lego_sets(set_num) ON DELETE CASCADE,
  condition TEXT NOT NULL CHECK (condition IN ('new', 'used')),
  currency TEXT NOT NULL DEFAULT 'USD',
  avg_price DECIMAL(10,2),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  sample_size INTEGER,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (set_num, condition, currency)
);

CREATE INDEX set_market_prices_fetched_idx ON set_market_prices(fetched_at);
```

**Sync strategy:**

- Background job: refresh prices for sets in users' collections (most viewed first)
- TTL: 7 days — prices older than 7 days re-fetched on next view
- Rate budget: 5,000/day ÷ ~700 requests/hour = comfortable headroom
- Priority queue: recently added sets first, then by popularity (owner count)

**UI changes:**

- Set detail page: show retail vs market value comparison
- Vault stats: "Collection Value" uses market prices when available, retail as fallback
- Price trend indicator: "above/below retail" badge on vault cards
- Pro tier gate: market value tracking could be a Pro-only feature

**Effort:** 8-12 hours (OAuth setup + new table + sync job + UI)

---

### v3: Price History & Trends

**What to add:** Historical price tracking over time for investment-minded collectors.

**Source: BrickEconomy API** (or BrickLink historical data)

- URL: `https://www.brickeconomy.com/api-reference`
- Auth: Free API key
- Rate limits: 100 requests/day, 4 requests/minute (tight — needs caching)
- Returns: Historical price charts, value forecasting (ML-powered)

**Schema change:**

```sql
CREATE TABLE set_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_num TEXT NOT NULL REFERENCES lego_sets(set_num) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  condition TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  source TEXT NOT NULL,
  recorded_at DATE NOT NULL,
  UNIQUE (set_num, condition, currency, source, recorded_at)
);
```

**UI changes:**

- Set detail page: price history chart (line graph over time)
- Collection analytics: portfolio value over time
- "Investment grade" badge for sets appreciating above X%/year
- Definitely Pro-tier gated

**Effort:** 12-16 hours (new table + sync + charting library + analytics UI)

---

## API Key Reference

| API          | Key Location                                   | Rate Limit     | Free?                      |
| ------------ | ---------------------------------------------- | -------------- | -------------------------- |
| Rebrickable  | `.env.local` as `REBRICKABLE_API_KEY`          | 1 req/sec      | Yes                        |
| Brickset     | `.env.local` as `BRICKSET_API_KEY`             | Daily limit    | Yes                        |
| BrickLink    | `.env.local` as `BRICKLINK_*` (4 OAuth values) | 5,000/day      | Yes (needs seller account) |
| BrickEconomy | `.env.local` as `BRICKECONOMY_API_KEY`         | 100/day, 4/min | Free tier                  |
