import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Professional practice: Save to localStorage and clear URL history
      localStorage.setItem('access_token', token);
      
      // Use { replace: true } so the user can't "go back" to the token URL
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 font-medium">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;