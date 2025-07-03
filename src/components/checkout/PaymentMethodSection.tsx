
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

interface PaymentMethodSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethodSection = ({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodSectionProps) => {
  return (
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
  );
};

export default PaymentMethodSection;
