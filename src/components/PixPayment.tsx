import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CheckCircle, X, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PixPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  customerName: string;
  onPaymentConfirmed: () => void;
}

const PixPayment = ({ isOpen, onClose, total, customerName, onPaymentConfirmed }: PixPaymentProps) => {
  const [pixCopied, setPixCopied] = useState(false);
  const { toast } = useToast();

  // Simular código PIX (na vida real viria do seu provedor de pagamento)
  const pixCode = `00020126360014BR.GOV.BCB.PIX0114+55119999999990204531653040000530398654${total.toFixed(2).replace('.', '')}5802BR5925${customerName.toUpperCase()}6014SAO PAULO62070503***6304`;
  
  const pixKey = "pix@restaurante.com.br";

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setPixCopied(true);
    toast({
      title: "Código PIX copiado!",
      description: "Cole o código no seu app de pagamento",
    });
    setTimeout(() => setPixCopied(false), 3000);
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    toast({
      title: "Chave PIX copiada!",
      description: "Use esta chave para fazer o pagamento manual",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-600">Pagamento PIX</CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              R$ {total.toFixed(2)}
            </div>
            <p className="text-gray-600">
              Pedido para: {customerName}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Chave PIX
            </h3>
            <div className="flex items-center justify-between bg-white p-3 rounded border">
              <code className="text-sm text-gray-700 flex-1">{pixKey}</code>
              <Button
                onClick={copyPixKey}
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Código PIX Copia e Cola</h3>
            <div className="bg-white p-3 rounded border mb-3">
              <code className="text-xs text-gray-700 break-all block">
                {pixCode}
              </code>
            </div>
            <Button
              onClick={copyPixCode}
              className="w-full"
              variant={pixCopied ? "default" : "outline"}
            >
              {pixCopied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Código Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Código PIX
                </>
              )}
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Como pagar:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Abra seu app de banco</li>
              <li>2. Escolha PIX</li>
              <li>3. Cole o código ou use a chave PIX</li>
              <li>4. Confirme o pagamento</li>
            </ol>
          </div>

          <div className="border-t pt-4">
            <Button
              onClick={onPaymentConfirmed}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Já realizei o pagamento
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Seu pedido será processado após a confirmação do pagamento
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PixPayment;
