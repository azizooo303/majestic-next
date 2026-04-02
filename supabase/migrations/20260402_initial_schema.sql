-- Contact & quotation submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  source text DEFAULT 'contact' -- 'contact' | 'quotation'
);

-- Cart sessions
CREATE TABLE IF NOT EXISTS cart_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_key text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  items jsonb DEFAULT '[]'::jsonb
);

-- Products mirror (from WooCommerce)
CREATE TABLE IF NOT EXISTS products (
  id integer PRIMARY KEY,
  name text NOT NULL,
  name_ar text,
  slug text,
  price numeric,
  regular_price numeric,
  sale_price numeric,
  status text,
  categories jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  short_description text,
  description text,
  stock_status text,
  synced_at timestamptz DEFAULT now()
);

-- Categories mirror
CREATE TABLE IF NOT EXISTS categories (
  id integer PRIMARY KEY,
  name text NOT NULL,
  name_ar text,
  slug text,
  count integer DEFAULT 0,
  synced_at timestamptz DEFAULT now()
);
