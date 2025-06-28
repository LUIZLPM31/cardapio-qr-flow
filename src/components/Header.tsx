import { ShoppingCart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}
const Header = ({
  cartItemCount,
  onCartClick
}: HeaderProps) => {
  const navigate = useNavigate();
  const handleAdminClick = () => {
    navigate('/admin');
  };
  return <header className="sticky top-0 z-50 bg-cardapio-green shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
            <img src="/lovable-uploads/e555a8e8-9e31-48ec-ab33-e0365109314d.png" alt="CardápioGO Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CardápioGO</h1>
            <p className="text-green-100 text-sm">Seu cardápio digital em tempo real</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button onClick={handleAdminClick} variant="outline" size="sm" className="border-white font-normal bg-cardapio-orange text-cardapio-white">
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
          
          <Button onClick={onCartClick} variant="outline" size="sm" className="relative border-white text-cardapio-white bg-cardapio-orange">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Carrinho
            {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-cardapio-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>}
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;