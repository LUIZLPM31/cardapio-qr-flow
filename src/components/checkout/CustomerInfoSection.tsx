
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CustomerInfoSectionProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
}

const CustomerInfoSection = ({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
}: CustomerInfoSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default CustomerInfoSection;
