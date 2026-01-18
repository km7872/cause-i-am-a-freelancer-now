import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('user_id');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const error = searchParams.get('error');

    if (error) {
      toast({
        title: 'Authentication failed',
        description: error,
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (token) {
        // this section of code is needed i.e const userData because the protected tag in App.tsx checks for user state
      const userData = {
        id: userId,
        email,
        name: name || undefined,
      };

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(userData));

      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with Google.',
      });

      navigate('/');
    } else {
      toast({
        title: 'Authentication failed',
        description: 'Invalid callback parameters.',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </motion.div>
    </div>
  );
}