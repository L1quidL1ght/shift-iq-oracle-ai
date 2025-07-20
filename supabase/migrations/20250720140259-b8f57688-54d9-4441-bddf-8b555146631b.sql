-- Create the actual auth user account for the super admin
-- This is needed because we only created the profile record earlier
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) 
SELECT 
  p.id,
  p.email,
  crypt('ShiftIQ2024!', gen_salt('bf')), -- Default password: ShiftIQ2024!
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Super Admin"}',
  false,
  'authenticated'
FROM profiles p 
WHERE p.email = 'lorenzo@herouei.com' 
  AND p.role = 'super_admin'
  AND NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'lorenzo@herouei.com'
  );

-- Also create identity record for proper auth
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT 
  p.id::text,
  p.id,
  json_build_object(
    'sub', p.id::text,
    'email', p.email,
    'email_verified', true
  ),
  'email',
  now(),
  now(),
  now()
FROM profiles p 
WHERE p.email = 'lorenzo@herouei.com' 
  AND p.role = 'super_admin'
  AND NOT EXISTS (
    SELECT 1 FROM auth.identities WHERE user_id = p.id
  );