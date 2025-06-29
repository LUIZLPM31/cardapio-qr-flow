
import { useState } from "react";
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'admin') {
          toast({
            title: "Login realizado com sucesso",
            description: "Bem-vindo ao painel administrativo!",
          });
          navigate('/admin');
        } else {
          // Sign out if not admin
          await supabase.auth.signOut();
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar o painel administrativo.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Ocorreu um erro ao fazer login.",
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
        
        // If this is the admin email, update role immediately
        if (email === "adm@adm.com") {
          setTimeout(async () => {
            try {
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', data.user!.id);

              if (updateError) {
                console.error('Erro ao definir papel de admin:', updateError);
              } else {
                toast({
                  title: "Papel de admin definido",
                  description: "Você pode fazer login como administrador agora.",
                });
              }
            } catch (err) {
              console.error('Erro ao atualizar perfil:', err);
            }
          }, 2000);
        }
        
        setIsSignUp(false);
      }
    } catch (error: any) {
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
            {isSignUp ? 'Criar Conta Admin' : 'Login Administrativo'}
          </CardTitle>
          <p className="text-gray-600">
            {isSignUp ? 'Crie sua conta de administrador' : 'Acesse o painel de controle do CardápioGO'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="adm@adm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              >
                {isSignUp ? "Já tem conta? Fazer login" : "Primeira vez? Criar conta admin"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
