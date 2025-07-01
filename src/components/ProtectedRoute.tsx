
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar sessão atual primeiro
    const checkAuth = async () => {
      console.log('ProtectedRoute: Verificando autenticação...');
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('ProtectedRoute: Sessão encontrada:', session);
        
        if (session?.user) {
          console.log('ProtectedRoute: Usuário autenticado:', session.user.email);
          setUser(session.user);
        } else {
          console.log('ProtectedRoute: Nenhuma sessão, redirecionando para login');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('ProtectedRoute: Erro ao verificar autenticação:', error);
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('ProtectedRoute: Auth state mudou:', event, session);
        
        if (session?.user) {
          console.log('ProtectedRoute: Usuário logado via state change');
          setUser(session.user);
        } else {
          console.log('ProtectedRoute: Usuário deslogado via state change');
          setUser(null);
          navigate('/login', { replace: true });
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
