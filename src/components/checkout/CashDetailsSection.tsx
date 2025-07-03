
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CashDetailsSectionProps {
  changeFor: string;
  setChangeFor: (value: string) => void;
  total: number;
}

const CashDetailsSection = ({
  changeFor,
  setChangeFor,
  total,
}: CashDetailsSectionProps) => {
  return (
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
  );
};

export default CashDetailsSection;
