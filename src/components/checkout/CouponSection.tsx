
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CouponSectionProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: any;
  setAppliedCoupon: (coupon: any) => void;
}

const CouponSection = ({
  couponCode,
  setCouponCode,
  appliedCoupon,
  setAppliedCoupon,
}: CouponSectionProps) => {
  const [couponLoading, setCouponLoading] = useState(false);
  const { toast } = useToast();

  const validateCoupon = async () => {
    console.log('validateCoupon chamado - início');
    
    if (!couponCode.trim()) {
      console.log('Cupom vazio');
      toast({
        title: "Erro",
        description: "Por favor, digite um código de cupom",
        variant: "destructive",
      });
      return;
    }

    console.log('Iniciando validação do cupom:', couponCode);
    setCouponLoading(true);

    try {
      console.log('Fazendo consulta ao Supabase para cupom:', couponCode);
      
      const { data: promotion, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString().split('T')[0])
        .maybeSingle();

      console.log('Resposta do Supabase:', { promotion, error });

      if (error) {
        console.error('Erro na consulta:', error);
        toast({
          title: "Erro",
          description: "Erro ao validar cupom. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      if (!promotion) {
        console.log('Cupom não encontrado ou inválido');
        toast({
          title: "Cupom inválido",
          description: "Cupom não encontrado ou expirado",
          variant: "destructive",
        });
        return;
      }

      console.log('Cupom válido encontrado, aplicando:', promotion);
      setAppliedCoupon(promotion);
      toast({
        title: "Cupom aplicado!",
        description: `Desconto de ${promotion.discount_percentage}% aplicado`,
      });
    } catch (error) {
      console.error('Erro na validação do cupom:', error);
      toast({
        title: "Erro",
        description: "Não foi possível validar o cupom",
        variant: "destructive",
      });
    } finally {
      console.log('Finalizando validação do cupom');
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    console.log('Removendo cupom');
    setAppliedCoupon(null);
    setCouponCode("");
    toast({
      title: "Cupom removido",
      description: "O desconto foi removido do pedido",
    });
  };

  return (
    <div className="border-t pt-4">
      <Label className="text-sm font-medium">Cupom de Desconto</Label>
      <div className="flex gap-2 mt-2">
        <Input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Digite o código"
          disabled={!!appliedCoupon}
          className="flex-1 text-sm"
        />
        {!appliedCoupon ? (
          <Button
            type="button"
            onClick={validateCoupon}
            disabled={couponLoading}
            variant="outline"
            size="sm"
            className="px-2 sm:px-3 shrink-0 text-xs sm:text-sm"
          >
            <Tag className="w-4 h-4 mr-1" />
            {couponLoading ? "..." : "Aplicar"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={removeCoupon}
            variant="destructive"
            size="sm"
            className="px-2 sm:px-3 shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      {appliedCoupon && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700 font-medium">
            Cupom "{appliedCoupon.code}" aplicado - {appliedCoupon.discount_percentage}% de desconto
          </p>
        </div>
      )}
    </div>
  );
};

export default CouponSection;
