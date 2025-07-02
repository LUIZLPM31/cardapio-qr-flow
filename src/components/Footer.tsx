import { Phone, Facebook, Instagram } from "lucide-react";
const Footer = () => {
  return <footer className="bg-cardapio-green text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo/Nome do Restaurante */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">CardápioGO</h3>
            <p className="text-gray-200 text-sm">Seu cardápio digital em tempo real</p>
          </div>

          {/* Contato */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <a href="tel:+5511999999999" className="hover:text-cardapio-orange transition-colors">
                (11) 99999-9999
              </a>
            </div>

            {/* Redes Sociais */}
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-cardapio-orange transition-colors p-2 hover:bg-white/10 rounded-full" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-cardapio-orange transition-colors p-2 hover:bg-white/10 rounded-full" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-6 pt-6 text-center">
          <p className="text-gray-200 text-sm">
            © 2024 CardápioGO. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;