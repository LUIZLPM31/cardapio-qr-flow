
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PromotionModal from "./PromotionModal";

interface Promotion {
  id: string;
  code: string;
  discount_percentage: number;
  valid_until: string;
  is_active: boolean;
}

const PromotionsManagement = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const { toast } = useToast();

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPromotions(data || []);
    } catch (error) {
      console.error('Erro ao buscar promoções:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as promoções",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleDeletePromotion = async (promotionId: string) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Promoção removida com sucesso",
      });

      fetchPromotions();
    } catch (error) {
      console.error('Erro ao remover promoção:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a promoção",
        variant: "destructive",
      });
    }
  };

  const togglePromotionStatus = async (promotionId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: !currentStatus })
        .eq('id', promotionId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Promoção ${!currentStatus ? 'ativada' : 'desativada'} com sucesso`,
      });

      fetchPromotions();
    } catch (error) {
      console.error('Erro ao alterar status da promoção:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da promoção",
        variant: "destructive",
      });
    }
  };

  const handleSavePromotion = () => {
    fetchPromotions();
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

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
                  promotion.is_active 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {promotion.is_active ? "Ativa" : "Inativa"}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Desconto</p>
                  <p className="text-xl font-bold text-cardapio-green">
                    {promotion.discount_percentage}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Válido até</p>
                  <p className="font-medium">{formatDate(promotion.valid_until)}</p>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={() => togglePromotionStatus(promotion.id, promotion.is_active)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    {promotion.is_active ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    onClick={() => handleEditPromotion(promotion)}
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

      {promotions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhuma promoção encontrada. Crie sua primeira promoção!
          </p>
        </div>
      )}

      <PromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promotion={editingPromotion}
        onSave={handleSavePromotion}
      />
    </div>
  );
};

export default PromotionsManagement;
