
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalSales: number;
  totalOrders: number;
  averageOrder: number;
  topItems: Array<{
    name: string;
    quantity: number;
    percentage: number;
  }>;
}

const ReportsSection = () => {
  const [stats, setStats] = useState<Stats>({
    totalSales: 0,
    totalOrders: 0,
    averageOrder: 0,
    topItems: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      // Buscar estatísticas de pedidos
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total, status')
        .neq('status', 'cancelled');

      if (ordersError) throw ordersError;

      // Calcular estatísticas básicas
      const deliveredOrders = ordersData?.filter(order => order.status === 'delivered') || [];
      const totalSales = deliveredOrders.reduce((sum, order) => sum + Number(order.total), 0);
      const totalOrders = deliveredOrders.length;
      const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

      // Buscar itens mais vendidos
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          quantity,
          menu_item:menu_items(name),
          order:orders!inner(status)
        `)
        .eq('order.status', 'delivered');

      if (itemsError) throw itemsError;

      // Processar itens mais vendidos
      const itemStats: { [key: string]: number } = {};
      let totalItemsSold = 0;

      itemsData?.forEach(item => {
        const itemName = item.menu_item?.name || 'Item desconhecido';
        itemStats[itemName] = (itemStats[itemName] || 0) + item.quantity;
        totalItemsSold += item.quantity;
      });

      const topItems = Object.entries(itemStats)
        .map(([name, quantity]) => ({
          name,
          quantity,
          percentage: totalItemsSold > 0 ? (quantity / totalItemsSold) * 100 : 0
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 4);

      setStats({
        totalSales,
        totalOrders,
        averageOrder,
        topItems
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os relatórios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cardapio-text">Relatórios</h2>
        <p className="text-gray-600">Acompanhe o desempenho do seu restaurante</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Vendas Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-cardapio-green">
              R$ {stats.totalSales.toFixed(2)}
            </p>
            <p className="text-xs text-gray-600 mt-1">Pedidos entregues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Pedidos Entregues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-cardapio-green">
              {stats.totalOrders}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total de pedidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-cardapio-green">
              R$ {stats.averageOrder.toFixed(2)}
            </p>
            <p className="text-xs text-gray-600 mt-1">Valor médio por pedido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Item Mais Vendido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-cardapio-green">
              {stats.topItems[0]?.name || 'Nenhum'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {stats.topItems[0]?.quantity || 0} vendas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Gráfico em desenvolvimento</p>
                <p className="text-sm text-gray-400">
                  Total de vendas: R$ {stats.totalSales.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Itens Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topItems.length > 0 ? (
              <div className="space-y-3">
                {stats.topItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} vendas</p>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-cardapio-green h-2 rounded-full"
                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum item vendido ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsSection;
