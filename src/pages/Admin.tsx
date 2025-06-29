
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import MenuManagement from "@/components/admin/MenuManagement";
import PromotionsManagement from "@/components/admin/PromotionsManagement";
import OrdersManagement from "@/components/admin/OrdersManagement";
import ReportsSection from "@/components/admin/ReportsSection";
import SettingsSection from "@/components/admin/SettingsSection";
import ProtectedRoute from "@/components/ProtectedRoute";

type AdminSection = 'menu' | 'promotions' | 'orders' | 'reports' | 'settings';

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('menu');
  const { toast } = useToast();

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'menu':
        return <MenuManagement />;
      case 'promotions':
        return <PromotionsManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'reports':
        return <ReportsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <MenuManagement />;
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <main className="flex-1 p-6">
            {renderActiveSection()}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
