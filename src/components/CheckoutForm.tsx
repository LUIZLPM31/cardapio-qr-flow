import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, CreditCard, Banknote, Smartphone, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PixPayment from "./PixPayment";

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
  const [couponLoading, setCouponLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const { toast } = useToast();

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount_percentage / 100) : 0;
  const total = subtotal - discount;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

  console.log('Renderizando CheckoutForm, appliedCoupon:', appliedCoupon);

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
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="mt-1"
                />
              </div>

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

              <div>
                <Label className="text-sm font-medium">Forma de Pagamento *</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center space-x-2 cursor-pointer text-sm">
                      <Smartphone className="w-4 h-4" />
                      <span>PIX</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer text-sm">
                      <CreditCard className="w-4 h-4" />
                      <span>Cartão de Crédito</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer text-sm">
                      <Banknote className="w-4 h-4" />
                      <span>Dinheiro</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium text-sm">Dados do Cartão</h4>
                  <div>
                    <Label htmlFor="cardNumber" className="text-sm">Número do Cartão *</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName" className="text-sm">Nome no Cartão *</Label>
                    <Input
                      id="cardName"
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Nome no cartão"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="cardExpiry" className="text-sm">Validade *</Label>
                      <Input
                        id="cardExpiry"
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvv" className="text-sm">CVV *</Label>
                      <Input
                        id="cardCvv"
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="000"
                        maxLength={4}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="border-t pt-4">
                  <Label htmlFor="changeFor" className="text-sm">Troco para (opcional)</Label>
                  <Input
                    id="changeFor"
                    type="number"
                    value={changeFor}
                    onChange={(e) => setChangeFor(e.target.value)}
                    placeholder="Valor em R$"
                    step="0.01"
                    min={total}
                    className="mt-1"
                  />
                  {changeFor && parseFloat(changeFor) > total && (
                    <p className="text-sm text-gray-600 mt-1">
                      Troco: R$ {(parseFloat(changeFor) - total).toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              {paymentMethod === "pix" && (
                <div className="border-t pt-4 bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Após confirmar o pedido, você receberá o código PIX para pagamento.
                  </p>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 text-sm">Resumo do Pedido:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-xs sm:text-sm">{item.quantity}x {item.name}</span>
                      <span className="text-xs sm:text-sm">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-2 pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto ({appliedCoupon.discount_percentage}%):</span>
                      <span>-R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

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
