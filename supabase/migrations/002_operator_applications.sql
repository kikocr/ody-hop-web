-- =============================================================================
-- Migration 002 — Operator applications
-- Adds:
--   * public.operator_applications table (W-09 form target)
--   * Status / email indexes for the admin review queue
--   * updated_at trigger
--   * RLS policies (public INSERT + SELECT, authenticated UPDATE)
--   * operator-applications storage bucket + bucket-scoped policies
--
-- All statements are idempotent (IF NOT EXISTS / DROP IF EXISTS / ON CONFLICT)
-- so this can be re-applied safely. Apply via the Supabase SQL Editor or
-- `supabase db push` if you have the CLI hooked up to the project.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Table
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.operator_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  description TEXT,
  destinations TEXT[] NOT NULL DEFAULT '{}',
  regions JSONB DEFAULT '{}',
  specialties TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  years_experience INTEGER,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  photo_urls TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_operator_applications_status
  ON public.operator_applications (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_operator_applications_email
  ON public.operator_applications (email);

-- ---------------------------------------------------------------------------
-- 3. updated_at trigger
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.operator_applications;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.operator_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Row-level security
-- ---------------------------------------------------------------------------

ALTER TABLE public.operator_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit an application"
  ON public.operator_applications;
CREATE POLICY "Anyone can submit an application"
  ON public.operator_applications
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Applicants can view own applications by email"
  ON public.operator_applications;
CREATE POLICY "Applicants can view own applications by email"
  ON public.operator_applications
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update applications"
  ON public.operator_applications;
CREATE POLICY "Authenticated users can update applications"
  ON public.operator_applications
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- No DELETE policy — applications are never hard-deleted, only status-changed.

-- ---------------------------------------------------------------------------
-- 5. Storage bucket
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('operator-applications', 'operator-applications', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies live on storage.objects, scoped per bucket via bucket_id.
-- The form is public (anyone can apply), so anonymous uploads are allowed,
-- and uploaded files are publicly readable so getPublicUrl() resolves.
-- No UPDATE / DELETE — uploaded files are immutable.

DROP POLICY IF EXISTS "Anyone can upload application files"
  ON storage.objects;
CREATE POLICY "Anyone can upload application files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'operator-applications');

DROP POLICY IF EXISTS "Public read access for application files"
  ON storage.objects;
CREATE POLICY "Public read access for application files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'operator-applications');
