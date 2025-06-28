
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Promotion {
  id: string;
  code: string;
  discount_percentage: number;
  valid_until: string;
  is_active: boolean;
}

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: Promotion | null;
  onSave: () => void;
}

const PromotionModal = ({ isOpen, onClose, promotion, onSave }: PromotionModalProps) => {
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    valid_until: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (promotion) {
        setFormData({
          code: promotion.code,
          discount_percentage: promotion.discount_percentage.toString(),
          valid_until: promotion.valid_until,
          is_active: promotion.is_active,
        });
      } else {
        setFormData({
          code: '',
          discount_percentage: '',
          valid_until: '',
          is_active: true,
        });
      }
    }
  }, [isOpen, promotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const promotionData = {
        code: formData.code.toUpperCase(),
        discount_percentage: parseInt(formData.discount_percentage),
        valid_until: formData.valid_until,
        is_active: formData.is_active,
      };

      if (promotion) {
        const { error } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', promotion.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Promoção atualizada com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert([promotionData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Promoção criada com sucesso",
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar promoção:', error);
      
      let errorMessage = "Não foi possível salvar a promoção";
      if (error.code === '23505') {
        errorMessage = "Já existe uma promoção com este código";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {promotion ? 'Editar Promoção' : 'Criar Promoção'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">Código da Promoção *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="Ex: DESCONTO10"
              required
            />
          </div>

          <div>
            <Label htmlFor="discount">Desconto (%) *</Label>
            <Input
              id="discount"
              type="number"
              min="1"
              max="100"
              value={formData.discount_percentage}
              onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="valid_until">Válido até *</Label>
            <Input
              id="valid_until"
              type="date"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_active: checked })
              }
            />
            <Label htmlFor="active">Ativa</Label>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-cardapio-green hover:bg-green-700">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionModal;
