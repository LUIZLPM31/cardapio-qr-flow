
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("adm@adm.com");
  const [password, setPassword] = useState("1234");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Iniciando login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Resultado do login:', { data, error });

      if (error) {
        console.error('Erro de autenticação:', error);
        throw error;
      }

      if (data.user) {
        console.log('Login bem-sucedido para:', data.user.email);
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando...",
        });
        
        // Aguardar um pouco para o toast aparecer e depois redirecionar
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 1000);
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Conta criada com sucesso",
          description: "Verifique seu email para confirmar a conta.",
        });
        setIsSignUp(false);
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao criar a conta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-cardapio-green rounded-full flex items-center justify-center mx-auto mb-4 p-2">
            <img 
              src="/lovable-uploads/e555a8e8-9e31-48ec-ab33-e0365109314d.png" 
              alt="CardápioGO Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-cardapio-text">
            {isSignUp ? 'Criar Conta' : 'Login'}
          </CardTitle>
          <p className="text-gray-600">
            {isSignUp ? 'Crie sua conta' : 'Acesse o sistema do CardápioGO'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-cardapio-green hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Processando..." : (isSignUp ? "Criar Conta" : "Entrar")}
            </Button>
            
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-cardapio-green"
                disabled={loading}
              >
                {isSignUp ? "Já tem conta? Fazer login" : "Não tem conta? Criar conta"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
