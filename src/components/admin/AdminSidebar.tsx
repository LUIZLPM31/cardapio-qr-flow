
import { Menu, Tag, ShoppingBag, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminSection = 'menu' | 'promotions' | 'orders' | 'reports' | 'settings';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'menu' as AdminSection, label: 'Gerenciar Cardápio', icon: Menu },
    { id: 'promotions' as AdminSection, label: 'Promoções', icon: Tag },
    { id: 'orders' as AdminSection, label: 'Pedidos Pendentes', icon: ShoppingBag },
    { id: 'reports' as AdminSection, label: 'Relatórios', icon: BarChart3 },
    { id: 'settings' as AdminSection, label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-[calc(100vh-73px)]">
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeSection === item.id 
                    ? "bg-cardapio-green text-white hover:bg-green-700" 
                    : "text-cardapio-text hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
