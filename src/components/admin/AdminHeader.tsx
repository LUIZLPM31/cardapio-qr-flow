
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminHeader = () => {
  const handleLogout = () => {
    // Implementar logout aqui
    console.log("Logout executado");
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
            <span className="text-sm">Administrador</span>
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
