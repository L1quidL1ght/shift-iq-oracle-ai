
-- First, create a security definer function to safely check user roles
-- This prevents RLS recursion by using elevated privileges
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

-- Create new non-recursive policies using the security definer function
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT 
  USING (public.get_user_role(auth.uid()) = 'super_admin');

CREATE POLICY "Super admins can update all profiles" ON public.profiles
  FOR UPDATE 
  USING (public.get_user_role(auth.uid()) = 'super_admin');

CREATE POLICY "Super admins can insert profiles" ON public.profiles
  FOR INSERT 
  WITH CHECK (public.get_user_role(auth.uid()) = 'super_admin');

CREATE POLICY "Super admins can delete profiles" ON public.profiles
  FOR DELETE 
  USING (public.get_user_role(auth.uid()) = 'super_admin');

-- Update other table policies to use the new function
-- Documents policies
DROP POLICY IF EXISTS "Admins can manage documents" ON public.documents;

CREATE POLICY "Content admins can insert documents" ON public.documents
  FOR INSERT 
  WITH CHECK (public.get_user_role(auth.uid()) IN ('content_admin', 'super_admin'));

CREATE POLICY "Content admins can update documents" ON public.documents
  FOR UPDATE 
  USING (public.get_user_role(auth.uid()) IN ('content_admin', 'super_admin'));

CREATE POLICY "Content admins can delete documents" ON public.documents
  FOR DELETE 
  USING (public.get_user_role(auth.uid()) IN ('content_admin', 'super_admin'));

-- Document embeddings policies  
DROP POLICY IF EXISTS "Admins can manage embeddings" ON public.document_embeddings;

CREATE POLICY "Content admins can insert embeddings" ON public.document_embeddings
  FOR INSERT 
  WITH CHECK (public.get_user_role(auth.uid()) IN ('content_admin', 'super_admin'));

CREATE POLICY "Content admins can update embeddings" ON public.document_embeddings
  FOR UPDATE 
  USING (public.get_user_role(auth.uid()) IN ('content_admin', 'super_admin'));

CREATE POLICY "Content admins can delete embeddings" ON public.document_embeddings
  FOR DELETE 
  USING (public.get_user_role(auth.uid()) IN ('content_admin', 'super_admin'));

-- Beers policies
DROP POLICY IF EXISTS "Admins can manage beers" ON public.beers;

CREATE POLICY "Content admins can insert beers" ON public.beers
  FOR INSERT 
  WITH CHECK (public.get_user_role(auth.uid()) IN ('content_admin', 'super_admin'));

CREATE POLICY "Content admins can update beers" ON public.beers
  FOR UPDATE 
  USING (public.get_user_role(auth.uid()) IN ('content_admin', 'super_admin'));

CREATE POLICY "Content admins can delete beers" ON public.beers
  FOR DELETE 
  USING (public.get_user_role(auth.uid()) IN ('content_admin', 'super_admin'));

-- System settings policies
DROP POLICY IF EXISTS "Super admins can manage system settings" ON public.system_settings;

CREATE POLICY "Super admins can insert system settings" ON public.system_settings
  FOR INSERT 
  WITH CHECK (public.get_user_role(auth.uid()) = 'super_admin');

CREATE POLICY "Super admins can update system settings" ON public.system_settings
  FOR UPDATE 
  USING (public.get_user_role(auth.uid()) = 'super_admin');

CREATE POLICY "Super admins can delete system settings" ON public.system_settings
  FOR DELETE 
  USING (public.get_user_role(auth.uid()) = 'super_admin');

-- Now manually create the missing profile for lorenzo@herouei.com
-- First, find the user ID from auth.users (this requires elevated privileges)
DO $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Get the user ID for lorenzo@herouei.com
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'lorenzo@herouei.com' 
    LIMIT 1;
    
    -- Insert the profile if user exists and profile doesn't exist
    IF user_uuid IS NOT NULL THEN
        INSERT INTO public.profiles (id, email, role, created_at, updated_at)
        VALUES (
            user_uuid, 
            'lorenzo@herouei.com', 
            'super_admin',
            now(),
            now()
        )
        ON CONFLICT (id) DO UPDATE SET
            role = 'super_admin',
            updated_at = now();
            
        RAISE NOTICE 'Profile created/updated for user: %', user_uuid;
    ELSE
        RAISE NOTICE 'No user found with email: lorenzo@herouei.com';
    END IF;
END $$;
