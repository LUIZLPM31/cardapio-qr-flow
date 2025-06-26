
import { useState } from "react";
import { Plus, Edit, Trash2, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Promotion {
  id: string;
  code: string;
  discount: number;
  validity: string;
  isActive: boolean;
}

const PromotionsManagement = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: "1",
      code: "PRIMEIRACOMPRA",
      discount: 10,
      validity: "2024-12-31",
      isActive: true
    },
    {
      id: "2",
      code: "CLIENTE20",
      discount: 20,
      validity: "2024-06-30",
      isActive: false
    }
  ]);

  const handleAddPromotion = () => {
    console.log("Adicionar nova promoção");
  };

  const handleEditPromotion = (promotionId: string) => {
    console.log("Editar promoção:", promotionId);
  };

  const handleDeletePromotion = (promotionId: string) => {
    setPromotions(promotions.filter(promo => promo.id !== promotionId));
  };

  const togglePromotionStatus = (promotionId: string) => {
    setPromotions(promotions.map(promo => 
      promo.id === promotionId 
        ? { ...promo, isActive: !promo.isActive }
        : promo
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cardapio-text">Gerenciar Promoções</h2>
        <Button 
          onClick={handleAddPromotion}
          className="bg-cardapio-green hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Promoção
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <Card key={promotion.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Percent className="w-5 h-5 mr-2 text-cardapio-orange" />
                  {promotion.code}
                </CardTitle>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  promotion.isActive 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {promotion.isActive ? "Ativa" : "Inativa"}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Desconto</p>
                  <p className="text-xl font-bold text-cardapio-green">
                    {promotion.discount}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Válido até</p>
                  <p className="font-medium">{promotion.validity}</p>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={() => togglePromotionStatus(promotion.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    {promotion.isActive ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    onClick={() => handleEditPromotion(promotion.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeletePromotion(promotion.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromotionsManagement;
