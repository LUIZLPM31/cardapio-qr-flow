
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItemType } from "./MenuItem";

interface CartItem extends MenuItemType {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onCheckout: () => void;
}

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onCheckout }: CartProps) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end md:items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-hidden animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between bg-cardapio-green text-white">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5" />
            <span>Carrinho ({itemCount})</span>
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col max-h-[calc(90vh-140px)]">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Seu carrinho está vazio</p>
              <p className="text-sm">Adicione alguns itens deliciosos!</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 border-b pb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-cardapio-text">{item.name}</h4>
                      <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-cardapio-text">Total:</span>
                  <span className="text-xl font-bold text-cardapio-green">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={onCheckout}
                  className="w-full bg-cardapio-orange hover:bg-orange-600 text-white"
                  size="lg"
                >
                  Finalizar Pedido
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
