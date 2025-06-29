
// Utility functions for generating email HTML content

export const generateWelcomeEmail = (userName: string) => {
  return {
    title: "Bem-vindo ao CardápioGO!",
    content: `
      <p>Olá <strong>${userName}</strong>,</p>
      <p>Seja muito bem-vindo ao <strong>CardápioGO</strong>! Estamos muito felizes em tê-lo conosco.</p>
      <p>Com nossa plataforma, você pode:</p>
      <ul style="text-align: left; margin: 20px 0;">
        <li>Visualizar cardápios digitais em tempo real</li>
        <li>Fazer pedidos de forma rápida e prática</li>
        <li>Acompanhar promoções especiais</li>
        <li>Ter uma experiência gastronômica única</li>
      </ul>
      <p>Estamos aqui para tornar sua experiência gastronômica ainda melhor!</p>
    `,
    buttonText: "Começar Agora",
    buttonUrl: `${window.location.origin}/`
  };
};

export const generateOrderConfirmationEmail = (orderNumber: string, items: string[], total: number) => {
  const itemsList = items.map(item => `<li>${item}</li>`).join('');
  
  return {
    title: "Pedido Confirmado!",
    content: `
      <p>Seu pedido foi confirmado com sucesso!</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">Detalhes do Pedido</h3>
        <p><strong>Número do Pedido:</strong> #${orderNumber}</p>
        <p><strong>Itens:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${itemsList}
        </ul>
        <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
      </div>
      <p>Seu pedido está sendo preparado com todo carinho. Em breve você receberá uma notificação quando estiver pronto!</p>
    `,
    buttonText: "Acompanhar Pedido",
    buttonUrl: `${window.location.origin}/pedidos`
  };
};

export const generatePasswordResetEmail = (resetUrl: string) => {
  return {
    title: "Redefinir Senha",
    content: `
      <p>Você solicitou a redefinição de sua senha no CardápioGO.</p>
      <p>Clique no botão abaixo para criar uma nova senha:</p>
      <p style="margin: 20px 0; padding: 15px; background-color: #fef3cd; border-radius: 6px; border-left: 4px solid #f59e0b;">
        <strong>⚠️ Importante:</strong> Este link expira em 1 hora por questões de segurança.
      </p>
      <p>Se você não solicitou esta redefinição, pode ignorar este email com segurança.</p>
    `,
    buttonText: "Redefinir Senha",
    buttonUrl: resetUrl
  };
};

export const generatePromotionEmail = (promoTitle: string, promoDescription: string, discount: string) => {
  return {
    title: `🎉 ${promoTitle}`,
    content: `
      <p>Uma promoção especial está esperando por você!</p>
      <div style="background-color: #fef3cd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px dashed #f59e0b;">
        <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 20px;">${discount} OFF</h3>
        <p style="margin: 0; color: #92400e; font-weight: 600;">${promoDescription}</p>
      </div>
      <p>Não perca esta oportunidade única! Aproveite agora mesmo.</p>
      <p style="font-size: 14px; color: #6b7280;">*Promoção válida por tempo limitado. Termos e condições aplicáveis.</p>
    `,
    buttonText: "Aproveitar Oferta",
    buttonUrl: `${window.location.origin}/`
  };
};
