
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { menuItems } from "@/data/menuData";
import { MenuItemType } from "@/components/MenuItem";

const MenuManagement = () => {
  const [items, setItems] = useState<MenuItemType[]>(menuItems);

  const handleAddItem = () => {
    console.log("Adicionar novo item");
    // Implementar modal para adicionar item
  };

  const handleEditItem = (itemId: string) => {
    console.log("Editar item:", itemId);
    // Implementar modal para editar item
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    console.log("Item removido:", itemId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cardapio-text">Gerenciar Cardápio</h2>
        <Button 
          onClick={handleAddItem}
          className="bg-cardapio-green hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <p className="text-sm text-gray-600">{item.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-cardapio-green">
                  R$ {item.price.toFixed(2)}
                </span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEditItem(item.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  onClick={() => handleDeleteItem(item.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;
