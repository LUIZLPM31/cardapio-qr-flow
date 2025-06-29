
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmailTemplate from './EmailTemplate';
import { 
  generateWelcomeEmail, 
  generateOrderConfirmationEmail, 
  generatePasswordResetEmail,
  generatePromotionEmail 
} from '@/utils/emailTemplates';

const EmailPreview = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('welcome');

  const getTemplateData = () => {
    switch (selectedTemplate) {
      case 'welcome':
        return generateWelcomeEmail('João Silva');
      case 'order':
        return generateOrderConfirmationEmail('12345', ['Pizza Margherita', 'Refrigerante 2L'], 45.90);
      case 'password':
        return generatePasswordResetEmail('https://exemplo.com/reset-password');
      case 'promotion':
        return generatePromotionEmail('Super Desconto!', 'Em todos os pratos principais', '30%');
      default:
        return generateWelcomeEmail('Usuário');
    }
  };

  const templateData = getTemplateData();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-cardapio-text">
            Preview de Templates de Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Selecionar Template:
              </label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Email de Boas-vindas</SelectItem>
                  <SelectItem value="order">Confirmação de Pedido</SelectItem>
                  <SelectItem value="password">Redefinição de Senha</SelectItem>
                  <SelectItem value="promotion">Email Promocional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-2">Preview do Email:</h3>
              <div className="bg-white rounded border" style={{ maxHeight: '600px', overflow: 'auto' }}>
                <EmailTemplate {...templateData} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailPreview;
