-- Decore Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'STAFF', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED');
CREATE TYPE event_type AS ENUM ('WEDDING', 'BIRTHDAY', 'GRADUATION', 'ENGAGEMENT', 'ANNIVERSARY', 'BABY_SHOWER', 'CORPORATE', 'ETHIOPIAN_TRADITIONAL', 'OTHER');
CREATE TYPE flower_type AS ENUM ('ROSE', 'LILY', 'SUNFLOWER', 'ORCHID', 'TULIP', 'MIXED', 'ETHIOPIAN_LOCAL');
CREATE TYPE decoration_style AS ENUM ('CLASSIC', 'MODERN', 'LUXURY', 'MINIMAL', 'ETHIOPIAN_TRADITIONAL');
CREATE TYPE size_type AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'PREMIUM');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'CUSTOMER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  compare_at_price DECIMAL(12,2),
  category_id UUID REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  stock INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Designs
CREATE TABLE gallery_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  occasion event_type,
  starting_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  materials TEXT[],
  flower_types TEXT[],
  color_palette TEXT[],
  size TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID NOT NULL REFERENCES gallery_designs(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  is_before BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  design_id UUID REFERENCES gallery_designs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id),
  UNIQUE(user_id, design_id),
  CHECK (
    (product_id IS NOT NULL AND design_id IS NULL) OR
    (product_id IS NULL AND design_id IS NOT NULL)
  )
);

-- Cart
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  design_id UUID REFERENCES gallery_designs(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  order_number TEXT UNIQUE NOT NULL,
  status order_status DEFAULT 'PENDING',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_status payment_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  design_id UUID REFERENCES gallery_designs(id),
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  note TEXT,
  changed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Bookings
CREATE TABLE event_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  event_type event_type NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  venue TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 0,
  decoration_style decoration_style,
  color_theme TEXT,
  budget DECIMAL(12,2),
  special_instructions TEXT,
  estimated_cost DECIMAL(12,2),
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES event_bookings(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  price DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom Designs
CREATE TABLE custom_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  occasion event_type NOT NULL,
  flower_type flower_type NOT NULL,
  colors TEXT[] NOT NULL,
  size size_type NOT NULL,
  style decoration_style NOT NULL,
  addons TEXT[] DEFAULT '{}',
  message TEXT,
  estimated_price DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  design_id UUID REFERENCES gallery_designs(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  event_type TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery Zones
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL UNIQUE,
  base_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
  free_above DECIMAL(12,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  booking_id UUID REFERENCES event_bookings(id),
  amount DECIMAL(12,2) NOT NULL,
  method TEXT NOT NULL,
  status payment_status DEFAULT 'PENDING',
  transaction_ref TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Methods (configurable by admin)
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT FALSE,
  config JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
  discount_value DECIMAL(12,2) NOT NULL,
  min_order_amount DECIMAL(12,2) DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_gallery_slug ON gallery_designs(slug);
CREATE INDEX idx_gallery_featured ON gallery_designs(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_reviews_design ON reviews(design_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER gallery_updated_at BEFORE UPDATE ON gallery_designs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER event_bookings_updated_at BEFORE UPDATE ON event_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    'CUSTOMER'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for products & gallery
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (TRUE);
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Public can view gallery designs" ON gallery_designs FOR SELECT USING (TRUE);
CREATE POLICY "Public can view gallery images" ON gallery_images FOR SELECT USING (TRUE);
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Public can view delivery zones" ON delivery_zones FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view enabled payment methods" ON payment_methods FOR SELECT USING (is_enabled = TRUE);
CREATE POLICY "Public can view active coupons" ON coupons FOR SELECT USING (is_active = TRUE);

-- Profile policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Favorites & Cart
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Event bookings
CREATE POLICY "Users manage own bookings" ON event_bookings FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users manage own custom designs" ON custom_designs FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Addresses & Notifications
CREATE POLICY "Users manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Admin policies (simplified - check role)
CREATE POLICY "Admins full access profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN', 'STAFF'))
);
CREATE POLICY "Admins full access products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN', 'STAFF'))
);
CREATE POLICY "Admins full access orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN', 'STAFF'))
);
CREATE POLICY "Admins full access gallery" ON gallery_designs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN', 'STAFF'))
);

-- Seed delivery zones for Ethiopia
INSERT INTO delivery_zones (city, base_fee, free_above) VALUES
  ('Addis Ababa', 150, 3000),
  ('Bahir Dar', 350, 5000),
  ('Gondar', 400, 5000),
  ('Hawassa', 300, 4500),
  ('Mekelle', 450, 5500),
  ('Dire Dawa', 400, 5000),
  ('Adama', 250, 4000),
  ('Jimma', 400, 5000),
  ('Dessie', 400, 5000),
  ('Other', 500, 6000);

-- Seed payment methods
INSERT INTO payment_methods (name, code, description, is_enabled, sort_order) VALUES
  ('Telebirr', 'telebirr', 'Pay with Telebirr mobile money', false, 1),
  ('CBE Birr', 'cbe_birr', 'Commercial Bank of Ethiopia Birr', false, 2),
  ('Bank Transfer', 'bank_transfer', 'Direct bank transfer', true, 3),
  ('Cash on Delivery', 'cod', 'Pay when you receive your order', true, 4);

-- Seed categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Flowers', 'flowers', 'Fresh cut flowers and arrangements', 1),
  ('Bouquets', 'bouquets', 'Hand-tied and designer bouquets', 2),
  ('Weddings', 'weddings', 'Wedding flowers and venue decoration', 3),
  ('Birthdays', 'birthdays', 'Birthday celebration designs', 4),
  ('Graduation', 'graduation', 'Graduation gifts and decorations', 5),
  ('Engagement', 'engagement', 'Engagement ceremony designs', 6),
  ('Baby Shower', 'baby-shower', 'Baby shower decorations', 7),
  ('Corporate', 'corporate', 'Corporate event floral designs', 8),
  ('Ethiopian Traditional', 'ethiopian-traditional', 'Traditional Ethiopian ceremony decorations', 9),
  ('Events', 'events', 'General event decorations', 10),
  ('Home Decor', 'home-decor', 'Home and interior floral designs', 11);
