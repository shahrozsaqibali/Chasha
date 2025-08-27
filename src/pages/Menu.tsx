import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Plus, Minus, ShoppingCart, MessageCircle, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart, MenuItem } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>(['All']);
  const { cart, addItem, removeItem, updateQuantity, clearCart, getItemCount } = useCart();

  // Load menu items from Supabase
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      // Transform Supabase data to match your MenuItem interface
      const transformedData: MenuItem[] = data.map(item => ({
        id: item.id,
        Name: item.name,
        Description: item.description,
        Category: item.category,
        Price: parseFloat(item.price),
        Currency: item.currency,
        isAvailable: item.is_available,
        Image: item.image || '/placeholder-dish.jpg' // Fallback image
      }));

      setMenuItems(transformedData);

      // Extract unique categories from AVAILABLE items only and add "All" option
      const availableItems = transformedData.filter(item => item.isAvailable);
      const uniqueCategories = Array.from(new Set(availableItems.map(item => item.Category)));
      setCategories(['All', ...uniqueCategories]);

      // If current selected category has no available items, switch to "All"
      if (selectedCategory !== 'All') {
        const hasAvailableItemsInCategory = availableItems.some(item => item.Category === selectedCategory);
        if (!hasAvailableItemsInCategory) {
          setSelectedCategory('All');
        }
      }

    } catch (error) {
      console.error('Error loading menu items:', error);
      // You might want to show a toast notification here
      // For now, we'll just log the error
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on selected category and availability
  const filteredItems = selectedCategory === 'All' 
    ? menuItems.filter(item => item.isAvailable) // Only show available items
    : menuItems.filter(item => item.Category === selectedCategory && item.isAvailable);

  const handleCheckout = () => {
    if (cart.items.length === 0) return;

    const orderSummary = cart.items.map(item => 
      `${item.quantity}x ${item.Name} - ${item.Currency} ${(item.Price * item.quantity).toFixed(2)}`
    ).join('\n');

    const total = cart.total.toFixed(2);
    const message = `🍽️ New Order from Chasha Menu!\n\n📋 Order Details:\n${orderSummary}\n\n💰 Total: AED ${total}\n\nPlease confirm this order and let me know the delivery time. Thank you!`;
    
    window.open(`https://wa.me/923431048001?text=${encodeURIComponent(message)}`, '_blank');
    setIsCartOpen(false);
  };

  const getItemQuantity = (itemId: string) => {
    const cartItem = cart.items.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Restaurant Header */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Menu</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
            دیکھ مگر پیار سے
            </p>
            <div className="flex items-center justify-center space-x-2 mt-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-white text-white" />
              ))}
              <span className="ml-2 font-semibold">4.9/5 Rating</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-primary/20 py-4">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "truck" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
                disabled={loading}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading delicious menu items...</p>
            </div>
          </div>
        </section>
      )}

      {/* Menu Grid */}
      {!loading && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {menuItems.length === 0 
                    ? 'No menu items available at the moment' 
                    : `No items available in ${selectedCategory === 'All' ? 'any category' : selectedCategory} category`
                  }
                </p>
                {selectedCategory !== 'All' && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCategory('All')}
                    className="mt-4"
                  >
                    View All Categories
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="truck-art-border hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.Image}
                          alt={item.Name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Handle image loading errors with a placeholder
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-dish.jpg';
                          }}
                        />
                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                          {item.Currency} {item.Price}
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-primary">{item.Name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {item.Category}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                          {item.Description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className="fill-accent text-accent" />
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {getItemQuantity(item.id) > 0 ? (
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                                >
                                  <Minus size={16} />
                                </Button>
                                <span className="font-semibold text-primary min-w-[2rem] text-center">
                                  {getItemQuantity(item.id)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => addItem(item)}
                                >
                                  <Plus size={16} />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="truck"
                                onClick={() => addItem(item)}
                              >
                                <Plus size={16} className="mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Floating Cart Button */}
      {getItemCount() > 0 && (
        <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DrawerTrigger asChild>
            <Button
              size="lg"
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white text-primary hover:bg-gray-50 border-2 border-primary shadow-lg min-h-[56px] px-6 font-semibold"
            >
              <ShoppingCart className="mr-2" size={20} />
              View Cart ({getItemCount()}) - AED {cart.total.toFixed(2)}
            </Button>
          </DrawerTrigger>
          
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-bold text-primary">Your Order</DrawerTitle>
            </DrawerHeader>
            
            <div className="p-6 overflow-y-auto">
              {cart.items.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-xl space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <img
                          src={item.Image}
                          alt={item.Name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-dish.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-primary truncate">{item.Name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.Currency} {item.Price} each
                          </p>
                          <p className="text-sm font-medium text-accent">
                            Subtotal: {item.Currency} {(item.Price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end space-x-2 flex-shrink-0">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="font-semibold min-w-[2rem] text-center px-2">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(item.id)}
                          className="ml-2"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-primary/20 pt-6 mt-6">
                    <div className="flex justify-between items-center text-xl font-bold text-primary mb-6">
                      <span>Total:</span>
                      <span>AED {cart.total.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={clearCart}
                        className="flex-1 h-12"
                      >
                        Clear Cart
                      </Button>
                      <Button
                        variant="whatsapp"
                        size="lg"
                        onClick={handleCheckout}
                        className="flex-1 h-14 text-base font-semibold"
                      >
                        <MessageCircle className="mr-2" size={20} />
                        Order via WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <Footer />
    </div>
  );
};

export default Menu;