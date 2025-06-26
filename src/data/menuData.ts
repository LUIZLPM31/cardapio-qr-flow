
import { MenuItemType } from "@/components/MenuItem";

export const categories = [
  { id: "burgers", name: "Hambúrgueres", icon: "🍔" },
  { id: "drinks", name: "Bebidas", icon: "🥤" },
  { id: "sides", name: "Acompanhamentos", icon: "🍟" },
  { id: "desserts", name: "Sobremesas", icon: "🍰" },
];

export const menuItems: MenuItemType[] = [
  // Hambúrgueres
  {
    id: "1",
    name: "Big Burger Clássico",
    description: "Dois hambúrgueres suculentos, queijo cheddar, alface, tomate, cebola e molho especial",
    price: 32.90,
    image: "/lovable-uploads/5cc4cbbd-db11-4a60-adcf-4b4585d14302.png",
    category: "burgers"
  },
  {
    id: "2",
    name: "Burger Bacon Supreme",
    description: "Hambúrguer artesanal, bacon crocante, queijo swiss, cebola caramelizada e molho barbecue",
    price: 28.90,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop",
    category: "burgers"
  },
  {
    id: "3",
    name: "Chicken Burger",
    description: "Peito de frango grelhado, queijo mozzarella, alface, tomate e maionese temperada",
    price: 24.90,
    image: "https://images.unsplash.com/photo-1606755962773-d324e2dabd81?w=500&h=300&fit=crop",
    category: "burgers"
  },
  {
    id: "4",
    name: "Veggie Burger",
    description: "Hambúrguer de grão-de-bico e quinoa, queijo vegano, alface, tomate e molho tahine",
    price: 26.90,
    image: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=500&h=300&fit=crop",
    category: "burgers"
  },

  // Bebidas
  {
    id: "5",
    name: "Refrigerante Lata",
    description: "Coca-Cola, Pepsi, Sprite, Fanta - 350ml gelado",
    price: 6.50,
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&h=300&fit=crop",
    category: "drinks"
  },
  {
    id: "6",
    name: "Suco Natural",
    description: "Laranja, limão, maracujá ou açaí - 400ml natural",
    price: 8.90,
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&h=300&fit=crop",
    category: "drinks"
  },
  {
    id: "7",
    name: "Milkshake",
    description: "Chocolate, morango ou baunilha com chantilly - 300ml",
    price: 12.90,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&h=300&fit=crop",
    category: "drinks"
  },
  {
    id: "8",
    name: "Água Mineral",
    description: "Água mineral sem gás - 500ml",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=300&fit=crop",
    category: "drinks"
  },

  // Acompanhamentos
  {
    id: "9",
    name: "Batata Frita Grande",
    description: "Porção generosa de batatas crocantes com sal especial",
    price: 14.90,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=300&fit=crop",
    category: "sides"
  },
  {
    id: "10",
    name: "Onion Rings",
    description: "Anéis de cebola empanados e fritos - 8 unidades",
    price: 12.90,
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=300&fit=crop",
    category: "sides"
  },
  {
    id: "11",
    name: "Nuggets de Frango",
    description: "10 nuggets crocantes com molho barbecue ou mostarda",
    price: 16.90,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=300&fit=crop",
    category: "sides"
  },
  {
    id: "12",
    name: "Salada Caesar",
    description: "Alface americana, croutons, parmesão e molho caesar",
    price: 18.90,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop",
    category: "sides"
  },

  // Sobremesas
  {
    id: "13",
    name: "Brownie com Sorvete",
    description: "Brownie de chocolate quente com sorvete de baunilha e calda",
    price: 15.90,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=300&fit=crop",
    category: "desserts"
  },
  {
    id: "14",
    name: "Cheesecake Frutas Vermelhas",
    description: "Fatia de cheesecake cremoso com calda de frutas vermelhas",
    price: 13.90,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop",
    category: "desserts"
  },
  {
    id: "15",
    name: "Sorvete Artesanal",
    description: "2 bolas de sorvete artesanal - sabores disponíveis no balcão",
    price: 8.90,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=300&fit=crop",
    category: "desserts"
  },
  {
    id: "16",
    name: "Petit Gateau",
    description: "Bolinho de chocolate quente com sorvete de creme",
    price: 17.90,
    image: "https://images.unsplash.com/photo-1540337706094-da10342c93d8?w=500&h=300&fit=crop",
    category: "desserts"
  },
];
