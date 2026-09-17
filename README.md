# Apex Estates - Real Estate Property Showcase Website

A modern, responsive, ultra-luxury **Real Estate Property Showcase Website** built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**.

Designed specifically for real estate business owners to showcase up to **5 active properties** without paying for expensive servers or complex infrastructure.

---

## Architecture Overview

The project is cleanly divided into two main architectural sections: **Client (Frontend)** and **Server (Backend & Database)**.

---

## 1. CLIENT (Frontend Application)

The client is a single-page web application built with **React 18**, **Vite 5**, and **Tailwind CSS**. It delivers high performance, responsive mobile navigation, glassmorphism UI components, and dynamic SEO metadata.

### Client Technologies & Libraries
- **UI Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + Custom Design System Tokens (Navy, Slate, Gold accents)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Typography**: Google Fonts (*Playfair Display* & *Plus Jakarta Sans*)

### Client Features & Structure

#### Public Showcase Interface
- **Homepage (`/`)**: Hero section with configurable tagline & background, Featured Estates grid (Max 5 active properties), Why Choose Us cards, About Us summary, and Contact callout.
- **Property Catalogue (`/properties`)**: Active listings grid with property type filter tabs (*Villa*, *Plot*, *Commercial*, *Apartment*).
- **Dedicated Property Details Page (`/properties/:slug`)**:
  - Main image + thumbnail gallery + fullscreen Lightbox modal viewer.
  - Responsive Video Walkthrough Player (supports YouTube, Shorts, Cloudinary, MP4 URLs).
  - Specifications table (Size, Rate per unit, Total units, Status).
  - Promotional offer banner & discount badges.
  - Location map section with Google Maps URL & embed CTA.
  - **WhatsApp CTA Integration**: Direct link with pre-filled property enquiry text (`"Hello, I am interested in [Property Name]. Please provide more details."`).
  - Property enquiry form.
- **Empty Property State**: If 0 active properties exist, automatically displays a professional *"New properties coming soon"* banner with Contact Us & WhatsApp Us buttons.
- **About Us (`/about`) & Contact (`/contact`)**: Office details, business hours, social links, quick action buttons (*Call Now*, *WhatsApp Us*, *Send Enquiry*), and Feedback form.
- **Legal Pages**: Privacy Policy (`/privacy`) and Terms & Conditions (`/terms`).

#### Admin Portal Interface (`/admin/*`)
- **Admin Login (`/admin/login`)**: Secure login page supporting Supabase Auth with an automatic demo authentication fallback.
- **Admin Layout (`/admin/layout`)**: Responsive sidebar navigation with mobile hamburger drawer.
- **Dashboard (`/admin/dashboard`)**: Inventory statistics displaying Total, Active, Inactive, Available, and Sold Out counters.
- **Property Inventory (`/admin/properties`)**: Management table with active/inactive toggles, edit shortcuts, and delete confirmations.
- **Property Editor (`/admin/properties/new` & `/edit`)**: Full form for adding/editing property details, pricing, discount offers, media URLs, amenities, and location details.
- **Max 5 Active Limit Validation**: Client-side check preventing addition or activation of a 6th active property with instant toast alerts: *"Maximum of 5 active properties allowed. Please deactivate or delete an existing property before adding another."*
- **Enquiry Manager (`/admin/enquiries`)**: View and respond to customer site visit requests with instant WhatsApp reply shortcuts.
- **Website Settings (`/admin/settings`)**: Edit company name, logo URL, phone number, WhatsApp number, email, address, hero section copy, and social links.

### Running Client Locally

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

---

## 2. SERVER (Backend & Database)

The server infrastructure relies on **Supabase** (PostgreSQL, Supabase Auth, Row Level Security) providing a lightweight, zero-maintenance backend that runs completely within free-tier cloud hosting.

### Server Technologies & Components
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (Email + Password)
- **Security**: PostgreSQL Row Level Security (RLS) policies
- **Media Storage**: External URL references (YouTube, Cloudinary, Unsplash) to avoid database bloat and keep hosting 100% free-tier compatible.

### Database Tables & Schema

#### 1. `properties` Table
Stores property metadata, pricing, status, and media URLs.
```sql
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    property_type TEXT DEFAULT 'Villa',
    location TEXT NOT NULL,
    city TEXT, district TEXT, state TEXT, pincode TEXT,
    google_maps_url TEXT,
    price NUMERIC, original_price NUMERIC, rate TEXT,
    discount_percentage NUMERIC DEFAULT 0,
    offer_title TEXT, offer_description TEXT,
    property_size TEXT, total_units INTEGER DEFAULT 1,
    availability TEXT DEFAULT 'Available', status TEXT DEFAULT 'Available',
    main_image_url TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    video_url TEXT,
    amenities TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `enquiries` Table
Stores customer site visit requests and feedback.
```sql
CREATE TABLE public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    property_name TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `site_settings` Table
Stores company profile, contact numbers, branding, and hero section copy.
```sql
CREATE TABLE public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    company_name TEXT DEFAULT 'Apex Estates',
    logo_url TEXT DEFAULT '',
    phone_number TEXT DEFAULT '+91 98765 43210',
    whatsapp_number TEXT DEFAULT '+91 98765 43210',
    email TEXT DEFAULT 'contact@apexestates.com',
    address TEXT DEFAULT '123 Luxury Avenue, Race Course, Coimbatore, TN 641018',
    hero_heading TEXT DEFAULT 'Find the Right Place for Your Future',
    hero_description TEXT DEFAULT 'Discover hand-picked premium residential plots, luxury villas, and prime commercial spaces with uncompromised quality.',
    facebook_url TEXT DEFAULT 'https://facebook.com',
    instagram_url TEXT DEFAULT 'https://instagram.com',
    youtube_url TEXT DEFAULT 'https://youtube.com',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Server Rules & Database Triggers

#### Enforcement of Maximum 5 Active Properties Rule
A PostgreSQL Trigger function prevents inserting or updating a property to `active = true` if total active properties $\ge 5$:
```sql
CREATE OR REPLACE FUNCTION check_active_property_limit()
RETURNS TRIGGER AS $$
DECLARE
    active_count INTEGER;
BEGIN
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
```

#### Row Level Security (RLS) Policies
- **Public Visitors**: Can read active properties and insert enquiries.
- **Authenticated Admins**: Full read, write, update, and delete access.

---

## Deployment & Setup Guide

### 1. Supabase Backend Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor**, paste the contents of [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**.
3. Create an admin user under **Authentication** -> **Users**.

### 2. Environment Variables Configuration
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 3. Client Deployment (Vercel / Netlify)
- **Vercel**: Import project -> Framework: **Vite** -> Add Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) -> Deploy.
- **Netlify**: Import project -> Build Command: `npm run build` -> Publish directory: `dist` -> Add Environment Variables -> Deploy.
#   r e a l - e s t a t e  
 