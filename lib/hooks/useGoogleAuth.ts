import { useState } from 'react';
import { Linking } from 'react-native';
import { supabase } from '@/lib/supabase/client';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: false,
          redirectTo: 'recalibration-app://auth/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
      // Open the OAuth URL in the browser
      if (data.url) {
        await Linking.openURL(data.url);
      }
    } catch (error) {
      console.error('Error during Google sign in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading,
  };
}; 