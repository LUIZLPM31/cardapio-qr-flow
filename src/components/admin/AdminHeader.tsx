
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/login');
    } catch (error) {
      console.error("Erro no logout:", error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-cardapio-green text-white shadow-lg">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
            <img 
              src="/lovable-uploads/e555a8e8-9e31-48ec-ab33-e0365109314d.png" 
              alt="CardápioGO Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">CardápioGO - Admin</h1>
            <p className="text-green-100 text-sm">Painel Administrativo</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="text-sm">{user?.email || 'Administrador'}</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="bg-white text-cardapio-green hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
