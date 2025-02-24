import { authMiddleware } from "@clerk/nextjs";
import { supabase } from '@/lib/supabase/client';

async function createUserProfile(userId: string) {
  try {
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the "not found" error code
      console.error('Error checking existing profile:', fetchError);
      return;
    }

    if (!existingProfile) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: userId,
            credits: 3,
            tier: 'free'
          }
        ]);

      if (insertError) {
        console.error('Error creating user profile:', insertError);
      } else {
        console.log('Successfully created profile for user:', userId);
      }
    }
  } catch (error) {
    console.error('Unexpected error in createUserProfile:', error);
  }
}

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Only the home page is public
  publicRoutes: ["/"],
  // Webhook can be ignored
  ignoredRoutes: ["/api/webhook"],
  async afterAuth(auth, req) {
    // Only run after successful authentication
    if (auth.userId) {
      await createUserProfile(auth.userId);
    }
  }
});

export const config = {
  // Protects all routes, including api/trpc
  // See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
  runtime: 'nodejs'
};