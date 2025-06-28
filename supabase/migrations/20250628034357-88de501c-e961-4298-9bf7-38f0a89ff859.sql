
-- Criar tabela de categorias de menu
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de itens do menu
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category_id UUID REFERENCES public.categories(id),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de promoções
CREATE TABLE public.promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  valid_until DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de pedidos
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de itens do pedido
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de configurações do restaurante
CREATE TABLE public.restaurant_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_name TEXT NOT NULL DEFAULT 'CardápioGO Restaurant',
  contact_phone TEXT,
  email TEXT,
  address TEXT,
  opening_hours TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configurações padrão
INSERT INTO public.restaurant_settings (restaurant_name, contact_phone, email, address, opening_hours, description)
VALUES ('CardápioGO Restaurant', '(11) 99999-9999', 'contato@cardapiogo.com', 'Rua das Flores, 123 - Centro', 'Seg-Dom: 11:00 às 23:00', 'O melhor da gastronomia com tecnologia de ponta.');

-- Inserir categorias padrão
INSERT INTO public.categories (name, description) VALUES 
('Hambúrgueres', 'Deliciosos hambúrgueres artesanais'),
('Pizzas', 'Pizzas tradicionais e especiais'),
('Bebidas', 'Refrigerantes, sucos e bebidas'),
('Sobremesas', 'Doces e sobremesas irresistíveis');

-- Inserir alguns itens de menu de exemplo
INSERT INTO public.menu_items (name, description, price, category_id) VALUES 
('Hambúrguer Clássico', 'Hambúrguer com carne, queijo, alface e tomate', 25.90, (SELECT id FROM categories WHERE name = 'Hambúrgueres' LIMIT 1)),
('Pizza Margherita', 'Pizza com molho de tomate, mussarela e manjericão', 35.00, (SELECT id FROM categories WHERE name = 'Pizzas' LIMIT 1)),
('Refrigerante', 'Coca-Cola, Pepsi ou Guaraná', 5.00, (SELECT id FROM categories WHERE name = 'Bebidas' LIMIT 1)),
('Pudim', 'Pudim de leite condensado', 8.50, (SELECT id FROM categories WHERE name = 'Sobremesas' LIMIT 1));

-- Habilitar RLS (Row Level Security) para todas as tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso público de leitura (para o cardápio público)
CREATE POLICY "Todos podem ver categorias" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Todos podem ver itens do menu" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Todos podem ver promoções ativas" ON public.promotions FOR SELECT USING (is_active = true);
CREATE POLICY "Todos podem ver configurações" ON public.restaurant_settings FOR SELECT USING (true);

-- Criar políticas para permitir inserção de pedidos (público pode fazer pedidos)
CREATE POLICY "Todos podem criar pedidos" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Todos podem criar itens de pedido" ON public.order_items FOR INSERT WITH CHECK (true);

-- Políticas administrativas (para depois implementar autenticação de admin)
CREATE POLICY "Admin pode gerenciar categorias" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin pode gerenciar itens" ON public.menu_items FOR ALL USING (true);
CREATE POLICY "Admin pode gerenciar promoções" ON public.promotions FOR ALL USING (true);
CREATE POLICY "Admin pode ver todos os pedidos" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Admin pode atualizar pedidos" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Admin pode ver itens dos pedidos" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Admin pode gerenciar configurações" ON public.restaurant_settings FOR ALL USING (true);
