
import React from 'react';

interface EmailTemplateProps {
  title: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
}

const EmailTemplate = ({ 
  title, 
  content, 
  buttonText, 
  buttonUrl, 
  footerText = "CardápioGO - Seu cardápio digital em tempo real" 
}: EmailTemplateProps) => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      padding: '0'
    }}>
      {/* Header with Logo */}
      <div style={{
        backgroundColor: '#059669',
        padding: '30px 20px',
        textAlign: 'center',
        borderRadius: '8px 8px 0 0'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          margin: '0 auto 15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px'
        }}>
          <img 
            src="https://zksgfrsmdxijulhfrgpb.supabase.co/storage/v1/object/public/uploads/e555a8e8-9e31-48ec-ab33-e0365109314d.png"
            alt="CardápioGO Logo" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        <h1 style={{
          color: '#ffffff',
          fontSize: '28px',
          fontWeight: 'bold',
          margin: '0 0 8px 0'
        }}>
          CardápioGO
        </h1>
        <p style={{
          color: '#dcfce7',
          fontSize: '16px',
          margin: '0'
        }}>
          Seu cardápio digital em tempo real
        </p>
      </div>

      {/* Content */}
      <div style={{
        padding: '40px 30px',
        backgroundColor: '#ffffff'
      }}>
        <h2 style={{
          color: '#1f2937',
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {title}
        </h2>
        
        <div style={{
          color: '#4b5563',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '30px'
        }} dangerouslySetInnerHTML={{ __html: content }} />

        {/* Button */}
        {buttonText && buttonUrl && (
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <a 
              href={buttonUrl}
              style={{
                display: 'inline-block',
                backgroundColor: '#059669',
                color: '#ffffff',
                padding: '12px 30px',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {buttonText}
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '20px 30px',
        textAlign: 'center',
        borderTop: '1px solid #e5e7eb'
      }}>
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          margin: '0 0 10px 0'
        }}>
          {footerText}
        </p>
        <p style={{
          color: '#9ca3af',
          fontSize: '12px',
          margin: '0'
        }}>
          Este email foi enviado automaticamente. Por favor, não responda.
        </p>
      </div>
    </div>
  );
};

export default EmailTemplate;
