
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, CreditCard, Banknote, Smartphone } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const { toast } = useToast();

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

      // Criar os itens do pedido
      const orderItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
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

      toast({
        title: "Pedido realizado com sucesso!",
        description: `Pedido para ${customerName} via ${paymentMethodText} foi enviado para a cozinha`,
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
    toast({
      title: "Pedido confirmado!",
      description: `Pedido para ${customerName} via PIX foi enviado para a cozinha`,
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
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Finalizar Pedido</CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
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
                />
              </div>

              <div>
                <Label>Forma de Pagamento *</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center space-x-2 cursor-pointer">
                      <Smartphone className="w-4 h-4" />
                      <span>PIX</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard className="w-4 h-4" />
                      <span>Cartão de Crédito</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer">
                      <Banknote className="w-4 h-4" />
                      <span>Dinheiro</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium">Dados do Cartão</h4>
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão *</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Nome no Cartão *</Label>
                    <Input
                      id="cardName"
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Nome como impresso no cartão"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="cardExpiry">Validade *</Label>
                      <Input
                        id="cardExpiry"
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvv">CVV *</Label>
                      <Input
                        id="cardCvv"
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="000"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="border-t pt-4">
                  <Label htmlFor="changeFor">Troco para (opcional)</Label>
                  <Input
                    id="changeFor"
                    type="number"
                    value={changeFor}
                    onChange={(e) => setChangeFor(e.target.value)}
                    placeholder="Valor em R$"
                    step="0.01"
                    min={total}
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
                <h4 className="font-medium mb-2">Resumo do Pedido:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-cardapio-orange hover:bg-orange-600"
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
