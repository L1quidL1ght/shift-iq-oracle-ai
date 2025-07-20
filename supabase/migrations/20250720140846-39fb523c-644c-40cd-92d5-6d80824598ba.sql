-- Delete the incorrectly created auth user and identity records
DELETE FROM auth.identities WHERE user_id = (SELECT id FROM auth.users WHERE email = 'lorenzo@herouei.com');
DELETE FROM auth.users WHERE email = 'lorenzo@herouei.com';

-- The profile record should remain since it uses the same ID