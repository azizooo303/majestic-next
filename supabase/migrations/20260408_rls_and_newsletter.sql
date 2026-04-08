-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);

-- ============================================================
-- Row-Level Security
-- ============================================================

-- contact_submissions: anon can INSERT only
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_contact"
  ON contact_submissions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "service_all_contact"
  ON contact_submissions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- cart_sessions: anon can INSERT and UPDATE their own session
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_cart"
  ON cart_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon_select_own_cart"
  ON cart_sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "anon_update_own_cart"
  ON cart_sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_all_cart"
  ON cart_sessions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- products: anon can SELECT only
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_products"
  ON products FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "service_all_products"
  ON products FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- categories: anon can SELECT only
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_categories"
  ON categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "service_all_categories"
  ON categories FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- newsletter_subscribers: anon can INSERT only
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "service_all_newsletter"
  ON newsletter_subscribers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
