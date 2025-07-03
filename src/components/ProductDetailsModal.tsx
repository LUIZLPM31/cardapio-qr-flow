
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MenuItemType } from "@/components/MenuItem";

interface ProductDetailsModalProps {
  item: MenuItemType | null;
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  onAdd: (item: MenuItemType) => void;
  onRemove: (itemId: string) => void;
}

const ProductDetailsModal = ({
  item,
  isOpen,
  onClose,
  quantity,
  onAdd,
  onRemove,
}: ProductDetailsModalProps) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-cardapio-text">
            {item.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-cardapio-green text-white px-3 py-1 rounded-full text-sm font-bold">
              R$ {item.price.toFixed(2)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {quantity > 0 && (
                    <Button
                      onClick={() => onRemove(item.id)}
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0 border-cardapio-orange text-cardapio-orange hover:bg-cardapio-orange hover:text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {quantity > 0 && (
                    <span className="min-w-[2rem] text-center font-bold text-cardapio-text text-lg">
                      {quantity}
                    </span>
                  )}
                  
                  <Button
                    onClick={() => onAdd(item)}
                    size="sm"
                    className={`${
                      quantity === 0 
                        ? "bg-cardapio-orange hover:bg-orange-600 text-white px-6" 
                        : "w-8 h-8 p-0 bg-cardapio-orange hover:bg-orange-600 text-white"
                    }`}
                  >
                    {quantity === 0 ? "Adicionar" : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
                
                {quantity > 0 && (
                  <div className="text-lg font-bold text-cardapio-green">
                    R$ {(item.price * quantity).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
