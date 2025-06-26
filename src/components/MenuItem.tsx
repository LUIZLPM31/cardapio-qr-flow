
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface MenuItemProps {
  item: MenuItemType;
  quantity: number;
  onAdd: (item: MenuItemType) => void;
  onRemove: (itemId: string) => void;
}

const MenuItem = ({ item, quantity, onAdd, onRemove }: MenuItemProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-cardapio-green text-white px-2 py-1 rounded-full text-sm font-bold">
          R$ {item.price.toFixed(2)}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-cardapio-text mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
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
              <span className="min-w-[2rem] text-center font-bold text-cardapio-text">
                {quantity}
              </span>
            )}
            
            <Button
              onClick={() => onAdd(item)}
              size="sm"
              className="w-8 h-8 p-0 bg-cardapio-orange hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {quantity > 0 && (
            <div className="text-sm font-bold text-cardapio-green">
              R$ {(item.price * quantity).toFixed(2)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
