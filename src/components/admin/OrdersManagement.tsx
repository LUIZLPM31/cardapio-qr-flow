import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menu_item: {
    name: string;
  };
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  created_at: string;
  order_items: OrderItem[];
}

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            menu_item:menu_items (name)
          )
        `)
        .neq('status', 'delivered')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the status to the correct type
      const ordersWithTypedStatus = data?.map(order => ({
        ...order,
        status: order.status as Order['status']
      })) || [];
      
      setOrders(ordersWithTypedStatus);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Configurar atualização em tempo real
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Pedido marcado como ${getStatusText(newStatus).toLowerCase()}`,
      });

      fetchOrders();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o pedido",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'delivered': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cardapio-text">Pedidos Pendentes</h2>
        <div className="flex items-center space-x-4">
          <Button
            onClick={fetchOrders}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Atualizado automaticamente</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Pedido #{order.id.slice(0, 8)}
                  </CardTitle>
                  <p className="text-gray-600">{order.customer_name}</p>
                  {order.customer_phone && (
                    <p className="text-sm text-gray-500">{order.customer_phone}</p>
                  )}
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                  <p className="text-lg font-bold text-cardapio-green mt-2">
                    R$ {order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Itens do pedido:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {order.order_items.map((item) => (
                    <li key={item.id}>
                      • {item.quantity}x {item.menu_item.name} - R$ {item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Aceitar Pedido
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Marcar como Pronto
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    size="sm"
                    className="bg-cardapio-green hover:bg-green-700"
                  >
                    Marcar como Entregue
                  </Button>
                )}
                <Button
                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhum pedido pendente no momento.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
