
import { useState } from "react";
import { Save, Clock, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SettingsSection = () => {
  const [settings, setSettings] = useState({
    restaurantName: "CardápioGO Restaurant",
    contact: "(11) 99999-9999",
    email: "contato@cardapiogo.com",
    address: "Rua das Flores, 123 - Centro",
    openingHours: "Seg-Dom: 11:00 às 23:00",
    description: "O melhor da gastronomia com tecnologia de ponta."
  });

  const handleSave = () => {
    console.log("Configurações salvas:", settings);
    // Aqui seria implementada a lógica para salvar no backend
  };

  const updateSetting = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cardapio-text">Configurações</h2>
        <p className="text-gray-600">Gerencie as informações do seu estabelecimento</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="restaurantName">Nome do Restaurante</Label>
              <Input
                id="restaurantName"
                value={settings.restaurantName}
                onChange={(e) => updateSetting('restaurantName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => updateSetting('description', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => updateSetting('address', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Contato e Horários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact">Telefone</Label>
              <Input
                id="contact"
                value={settings.contact}
                onChange={(e) => updateSetting('contact', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="openingHours">Horário de Funcionamento</Label>
              <Input
                id="openingHours"
                value={settings.openingHours}
                onChange={(e) => updateSetting('openingHours', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-cardapio-green hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default SettingsSection;
