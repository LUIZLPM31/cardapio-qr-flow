import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PixPayment from "./PixPayment";
import CustomerInfoSection from "./checkout/CustomerInfoSection";
import CouponSection from "./checkout/CouponSection";
import PaymentMethodSection from "./checkout/PaymentMethodSection";
import CardDetailsSection from "./checkout/CardDetailsSection";
import CashDetailsSection from "./checkout/CashDetailsSection";
import PixInfoSection from "./checkout/PixInfoSection";
import OrderSummarySection from "./checkout/OrderSummarySection";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
}

const CheckoutForm = ({ isOpen, onClose, items, onOrderComplete }: CheckoutFormProps) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [changeFor, setChangeFor] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const { toast } = useToast();

  // Cálculos seguros
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon && appliedCoupon.discount_percentage 
    ? (subtotal * appliedCoupon.discount_percentage / 100) 
    : 0;
  const total = Math.max(0, subtotal - discount);

  console.log('CheckoutForm renderizando:', { 
    subtotal, 
    discount, 
    total, 
    appliedCoupon,
    isOpen 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit iniciado');
    
    if (!customerName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu nome",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os dados do cartão",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    console.log('Iniciando processamento do pedido');

    try {
      console.log('Criando pedido para:', customerName);
      console.log('Forma de pagamento:', paymentMethod);
      console.log('Itens do pedido:', items);
      console.log('Cupom aplicado:', appliedCoupon);

      // Primeiro, buscar ou criar os itens do menu no banco de dados
      const menuItemsToCreate = [];
      const existingMenuItems = [];

      for (const item of items) {
        // Tentar buscar o item no banco
        const { data: existingItem } = await supabase
          .from('menu_items')
          .select('id')
          .eq('name', item.name)
          .single();

        if (existingItem) {
          existingMenuItems.push({
            ...item,
            menu_item_id: existingItem.id
          });
        } else {
          // Se não existir, preparar para criar
          menuItemsToCreate.push({
            name: item.name,
            price: item.price,
            description: `Delicioso ${item.name}`,
            is_available: true
          });
        }
      }

      // Criar os itens que não existem
      let createdMenuItems = [];
      if (menuItemsToCreate.length > 0) {
        const { data: newItems, error: createError } = await supabase
          .from('menu_items')
          .insert(menuItemsToCreate)
          .select('id, name');

        if (createError) {
          console.error('Erro ao criar itens do menu:', createError);
          throw createError;
        }

        createdMenuItems = newItems || [];
      }

      // Mapear todos os itens com seus IDs corretos
      const allMenuItems = [
        ...existingMenuItems,
        ...items.filter(item => 
          menuItemsToCreate.some(created => created.name === item.name)
        ).map((item, index) => ({
          ...item,
          menu_item_id: createdMenuItems[index]?.id
        }))
      ];

      console.log('Itens do menu processados:', allMenuItems);

      // Criar o pedido no Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone || null,
          total: total,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Erro ao criar pedido:', orderError);
        throw orderError;
      }

      console.log('Pedido criado:', order);

      // Criar os itens do pedido com UUIDs válidos
      const orderItems = allMenuItems.map(item => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Erro ao criar itens do pedido:', itemsError);
        throw itemsError;
      }

      console.log('Itens do pedido criados com sucesso');

      if (paymentMethod === "pix") {
        // Para PIX, mostrar tela de pagamento
        setShowPixPayment(true);
        setLoading(false);
        return;
      }

      // Para outras formas de pagamento, finalizar normalmente
      let paymentMethodText = "";
      switch (paymentMethod) {
        case "card":
          paymentMethodText = "Cartão de Crédito";
          break;
        case "cash":
          paymentMethodText = "Dinheiro";
          break;
      }

      let successMessage = `Pedido para ${customerName} via ${paymentMethodText} foi enviado para a cozinha`;
      if (appliedCoupon) {
        successMessage += ` com desconto de ${appliedCoupon.discount_percentage}%`;
      }

      toast({
        title: "Pedido realizado com sucesso!",
        description: successMessage,
      });

      onOrderComplete();
      onClose();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast({
        title: "Erro",
        description: "Não foi possível finalizar o pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePixPaymentConfirmed = async () => {
    let successMessage = `Pedido para ${customerName} via PIX foi enviado para a cozinha`;
    if (appliedCoupon) {
      successMessage += ` com desconto de ${appliedCoupon.discount_percentage}%`;
    }

    toast({
      title: "Pedido confirmado!",
      description: successMessage,
    });
    
    setShowPixPayment(false);
    onOrderComplete();
    onClose();
  };

  const handleClosePixPayment = () => {
    setShowPixPayment(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
        <Card className="w-full max-w-md max-h-[95vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl">Finalizar Pedido</CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <CustomerInfoSection
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
              />

              <CouponSection
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                appliedCoupon={appliedCoupon}
                setAppliedCoupon={setAppliedCoupon}
              />

              <PaymentMethodSection
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />

              {paymentMethod === "card" && (
                <CardDetailsSection
                  cardNumber={cardNumber}
                  setCardNumber={setCardNumber}
                  cardName={cardName}
                  setCardName={setCardName}
                  cardExpiry={cardExpiry}
                  setCardExpiry={setCardExpiry}
                  cardCvv={cardCvv}
                  setCardCvv={setCardCvv}
                />
              )}

              {paymentMethod === "cash" && (
                <CashDetailsSection
                  changeFor={changeFor}
                  setChangeFor={setChangeFor}
                  total={total}
                />
              )}

              {paymentMethod === "pix" && <PixInfoSection />}

              <OrderSummarySection
                items={items}
                subtotal={subtotal}
                discount={discount}
                total={total}
                appliedCoupon={appliedCoupon}
              />

              <Button
                type="submit"
                className="w-full bg-cardapio-orange hover:bg-orange-600 text-sm"
                disabled={loading}
              >
                {loading ? "Processando..." : "Confirmar Pedido"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <PixPayment
        isOpen={showPixPayment}
        onClose={handleClosePixPayment}
        total={total}
        customerName={customerName}
        onPaymentConfirmed={handlePixPaymentConfirmed}
      />
    </>
  );
};

export default CheckoutForm;
