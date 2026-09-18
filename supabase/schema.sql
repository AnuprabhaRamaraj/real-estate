-- Supabase Schema for Real Estate Property Showcase Website
-- Run this script in your Supabase SQL Editor

-- 1. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    property_type TEXT DEFAULT 'Villa', -- 'Villa', 'Land / Plot', 'Commercial', 'Apartment'
    location TEXT NOT NULL,
    city TEXT,
    district TEXT,
    state TEXT,
    pincode TEXT,
    google_maps_url TEXT,
    price NUMERIC,
    original_price NUMERIC,
    rate TEXT, -- e.g. '₹3,500 / sq.ft'
    price_unit TEXT DEFAULT 'total',
    discount_percentage NUMERIC DEFAULT 0,
    offer_title TEXT,
    offer_description TEXT,
    property_size TEXT, -- e.g. '2,400 sq.ft'
    total_units INTEGER DEFAULT 1,
    availability TEXT DEFAULT 'Available', -- 'Available', 'Sold', 'Reserved', 'Coming Soon'
    status TEXT DEFAULT 'Available',
    main_image_url TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    video_url TEXT,
    amenities TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    property_name TEXT,
    message TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'closed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    company_name TEXT DEFAULT 'Apex Estates',
    logo_url TEXT DEFAULT '',
    phone_number TEXT DEFAULT '+91 98765 43210',
    email TEXT DEFAULT 'contact@apexestates.com',
    address TEXT DEFAULT '123 Luxury Avenue, Race Course, Coimbatore, TN 641018',
    hero_heading TEXT DEFAULT 'Find the Right Place for Your Future',
    hero_description TEXT DEFAULT 'Discover hand-picked premium residential plots, luxury villas, and prime commercial spaces with uncompromised quality.',
    facebook_url TEXT DEFAULT 'https://facebook.com',
    instagram_url TEXT DEFAULT 'https://instagram.com',
    youtube_url TEXT DEFAULT 'https://youtube.com',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Settings
INSERT INTO public.site_settings (id) 
VALUES ('default') 
ON CONFLICT (id) DO NOTHING;

-- 4. FUNCTION & TRIGGER: ENFORCE MAXIMUM 5 ACTIVE PROPERTIES
CREATE OR REPLACE FUNCTION check_active_property_limit()
RETURNS TRIGGER AS $$
DECLARE
    active_count INTEGER;
BEGIN
    -- Count current active properties excluding the updated record if editing
    IF (TG_OP = 'INSERT' AND NEW.active = true) OR (TG_OP = 'UPDATE' AND NEW.active = true AND (OLD.active = false OR OLD.active IS NULL)) THEN
        SELECT COUNT(*) INTO active_count 
        FROM public.properties 
        WHERE active = true AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
        
        IF active_count >= 5 THEN
            RAISE EXCEPTION 'Maximum of 5 active properties allowed. Please deactivate or delete an existing property before adding or activating another.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_active_limit ON public.properties;

CREATE TRIGGER trigger_check_active_limit
BEFORE INSERT OR UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION check_active_property_limit();

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Properties Policies
CREATE POLICY "Public read active properties" ON public.properties
    FOR SELECT USING (active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin full access properties" ON public.properties
    FOR ALL USING (auth.role() = 'authenticated');

-- Enquiries Policies
CREATE POLICY "Public insert enquiries" ON public.enquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access enquiries" ON public.enquiries
    FOR ALL USING (auth.role() = 'authenticated');

-- Settings Policies
CREATE POLICY "Public read site_settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admin update site_settings" ON public.site_settings
    FOR ALL USING (auth.role() = 'authenticated');
