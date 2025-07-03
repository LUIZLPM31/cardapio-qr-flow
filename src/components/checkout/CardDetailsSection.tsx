
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CardDetailsSectionProps {
  cardNumber: string;
  setCardNumber: (number: string) => void;
  cardName: string;
  setCardName: (name: string) => void;
  cardExpiry: string;
  setCardExpiry: (expiry: string) => void;
  cardCvv: string;
  setCardCvv: (cvv: string) => void;
}

const CardDetailsSection = ({
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
}: CardDetailsSectionProps) => {
  return (
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
  );
};

export default CardDetailsSection;
