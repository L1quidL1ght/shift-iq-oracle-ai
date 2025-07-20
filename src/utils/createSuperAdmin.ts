import { supabase } from '@/integrations/supabase/client';

export const createSuperAdmin = async () => {
  try {
    // Step 1: Create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'lorenzo@herouei.com',
      password: 'Eleven11////',
      options: {
        data: {
          full_name: 'Lorenzo',
        },
      },
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create user' };
    }

    // Step 2: Update the user's role to super_admin
    // Note: This requires the service role key since we're updating another user's profile
    const { error: roleError } = await supabase
      .from('profiles')
      .update({ role: 'super_admin' })
      .eq('user_id', authData.user.id);

    if (roleError) {
      console.error('Error updating role:', roleError);
      return { success: false, error: roleError.message };
    }

    console.log('Super admin created successfully:', {
      userId: authData.user.id,
      email: authData.user.email,
    });

    return { 
      success: true, 
      user: authData.user,
      message: 'Super admin account created successfully' 
    };

  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};