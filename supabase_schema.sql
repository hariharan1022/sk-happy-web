-- =======================================================
-- Supabase Schema for "SK Happy Little Things" Marketplace
-- =======================================================
-- Copy and paste this script into your Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- Then click "Run" to initialize your database structure.

-- 1. PROFILES TABLE (Syncs User Metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'buyer',
    shop_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);


-- 2. SHOPS TABLE
CREATE TABLE IF NOT EXISTS public.shops (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    logo TEXT,
    banner TEXT,
    category TEXT DEFAULT 'Other',
    contact TEXT,
    social JSONB DEFAULT '{}'::jsonb,
    address TEXT,
    "sellerId" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending, approved, suspended
    rating NUMERIC DEFAULT 0.0,
    followers NUMERIC DEFAULT 0,
    reviews JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Shops
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-access to shops" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Allow sellers to manage own shop" ON public.shops FOR ALL USING (auth.uid() = "sellerId"::uuid);


-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    category TEXT,
    subcategory TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    sizes JSONB DEFAULT '[]'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    "deliveryDetails" TEXT,
    "returnPolicy" TEXT,
    "shopId" TEXT REFERENCES public.shops(id) ON DELETE CASCADE,
    "sellerId" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating NUMERIC DEFAULT 5.0,
    reviews JSONB DEFAULT '[]'::jsonb,
    hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-access to active products" ON public.products FOR SELECT USING (hidden = false);
CREATE POLICY "Allow sellers to manage own products" ON public.products FOR ALL USING (auth.uid() = "sellerId"::uuid);
