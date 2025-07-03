
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummarySectionProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: any;
}

const OrderSummarySection = ({
  items,
  subtotal,
  discount,
  total,
  appliedCoupon,
}: OrderSummarySectionProps) => {
  return (
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
  );
};

export default OrderSummarySection;
