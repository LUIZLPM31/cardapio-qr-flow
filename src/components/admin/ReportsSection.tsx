
import { BarChart3, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReportsSection = () => {
  // Dados fictícios para demonstração
  const stats = {
    totalSales: 2450.50,
    totalOrders: 45,
    averageOrder: 54.45,
    topItem: "Hambúrguer Clássico"
  };

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
            <p className="text-xs text-green-600 mt-1">+12% desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Pedidos Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-cardapio-green">
              {stats.totalOrders}
            </p>
            <p className="text-xs text-green-600 mt-1">+8% desde ontem</p>
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
            <p className="text-xs text-green-600 mt-1">+5% desde ontem</p>
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
              {stats.topItem}
            </p>
            <p className="text-xs text-gray-600 mt-1">12 vendas hoje</p>
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
              <p className="text-gray-500">Gráfico de vendas por período</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Itens Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Hambúrguer Clássico", sales: 12, percentage: 85 },
                { name: "Pizza Margherita", sales: 8, percentage: 60 },
                { name: "Batata Frita", sales: 6, percentage: 45 },
                { name: "Refrigerante", sales: 4, percentage: 30 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.sales} vendas</p>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-cardapio-green h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsSection;
