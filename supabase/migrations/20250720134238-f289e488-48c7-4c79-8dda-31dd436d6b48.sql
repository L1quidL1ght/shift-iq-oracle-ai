
-- Temporarily disable email confirmation for user signup
-- This allows users to sign up without email verification
UPDATE auth.config 
SET email_confirm = false;

-- Also disable email change confirmation for completeness
UPDATE auth.config 
SET email_change_confirm = false;
