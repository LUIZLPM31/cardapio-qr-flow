
import { useState } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import MenuItem, { MenuItemType } from "@/components/MenuItem";
import Cart from "@/components/Cart";
import CheckoutForm from "@/components/CheckoutForm";
import Footer from "@/components/Footer";
import { menuItems, categories } from "@/data/menuData";
import { useToast } from "@/hooks/use-toast";

interface CartItem extends MenuItemType {
  quantity: number;
}

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();

  const filteredItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const getItemQuantity = (itemId: string) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const addToCart = (item: MenuItemType) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });

    toast({
      title: "Item adicionado!",
      description: `${item.name} foi adicionado ao carrinho`,
      duration: 2000,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      
      if (existingItem && existingItem.quantity === 1) {
        return prevItems.filter(item => item.id !== itemId);
      } else {
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-cardapio-text mb-2">
            {activeCategory === "all" ? "Nosso Cardápio" : 
             categories.find(cat => cat.id === activeCategory)?.name}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Escolha seus pratos favoritos e monte seu pedido
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base sm:text-lg">
              Nenhum item encontrado nesta categoria.
            </p>
          </div>
        )}
      </main>

      <Footer />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onCheckout={handleCheckout}
      />

      <CheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderComplete={handleOrderComplete}
      />

      {cartItemCount > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-cardapio-orange hover:bg-orange-600 text-white rounded-full p-3 sm:p-4 shadow-lg z-40 animate-scale-in"
        >
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm sm:text-base">{cartItemCount}</span>
            <span className="hidden sm:inline text-sm">itens</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default Index;
