
import { ShoppingCart, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemCount, onCartClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-cardapio-green shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <QrCode className="w-6 h-6 text-cardapio-green" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CardápioGO</h1>
            <p className="text-green-100 text-sm">Seu cardápio digital em tempo real</p>
          </div>
        </div>
        
        <Button
          onClick={onCartClick}
          variant="outline"
          size="sm"
          className="relative bg-white text-cardapio-green hover:bg-gray-100 border-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Carrinho
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-cardapio-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
