import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Download, LogOut, ShoppingBag, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MenuItem } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

// Helper function to generate UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const Admin = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);

  const { logout, user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Category: '',
    Price: '',
    Currency: 'AED',
    isAvailable: true,
    Image: ''
  });

  const categories = ['BEST SELLERS', 'KARAK', 'PARATHAS', 'BREAKFAST', 'SNACKS', 'DESI', 'DESSERTS'];

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
      const transformedData = data.map(item => ({
        id: item.id,
        Name: item.name,
        Description: item.description,
        Category: item.category,
        Price: parseFloat(item.price),
        Currency: item.currency,
        isAvailable: item.is_available,
        Image: item.image || ''
      }));

      setMenuItems(transformedData);
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to load menu items: ' + error.message, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter items
  useEffect(() => {
    let filtered = [...menuItems];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.Category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [menuItems, searchTerm, selectedCategory]);

  // Form submission (add/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const menuItemData = {
        name: formData.Name,
        description: formData.Description,
        category: formData.Category,
        price: parseFloat(formData.Price),
        currency: formData.Currency,
        is_available: formData.isAvailable,
        image: formData.Image
      };

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update(menuItemData)
          .eq('id', editingItem.id);

        if (error) throw error;

        toast({ title: 'Success', description: 'Menu item updated successfully' });
      } else {
        // Add new item with generated UUID
        const newItemData = {
          ...menuItemData,
          id: generateUUID()
        };

        const { error } = await supabase
          .from('menu_items')
          .insert([newItemData]);

        if (error) throw error;

        toast({ title: 'Success', description: 'Menu item added successfully' });
      }

      // Reload menu items
      await loadMenuItems();
      resetForm();
      setIsDialogOpen(false);

    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to save menu item: ' + error.message, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Edit menu item
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      Name: item.Name,
      Description: item.Description,
      Category: item.Category,
      Price: item.Price.toString(),
      Currency: item.Currency,
      isAvailable: item.isAvailable,
      Image: item.Image,
    });
    setIsDialogOpen(true);
  };

  // Delete menu item
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Menu item deleted successfully' });
      await loadMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to delete menu item: ' + error.message, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle availability
  const toggleAvailability = async (id: string) => {
    const item = menuItems.find(item => item.id === id);
    if (!item) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !item.isAvailable })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Item availability updated' });
      await loadMenuItems();
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to update availability: ' + error.message, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Description: '',
      Category: '',
      Price: '',
      Currency: 'AED',
      isAvailable: true,
      Image: ''
    });
    setEditingItem(null);
  };

  // Download JSON
  const downloadJSON = () => {
    const dataStr = JSON.stringify(menuItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'menu-items.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged Out', description: 'You have been logged out successfully' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppButton />

      {/* Admin Header */}
      <section className="pt-24 pb-8 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
              <p className="text-white/90">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button variant="secondary" onClick={downloadJSON} className="flex items-center space-x-2" disabled={loading}>
                <Download size={16} />
                <span>Download JSON</span>
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={loading}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="truck" onClick={resetForm} disabled={loading}>
                  <Plus className="mr-2" size={16} />
                  Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary">
                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.Name}
                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.Category} 
                        onValueChange={(value) => setFormData({ ...formData, Category: value })}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.Description}
                      onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                      rows={3}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Price, Currency, Availability */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.Price}
                        onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={formData.Currency} 
                        onValueChange={(value) => setFormData({ ...formData, Currency: value })}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AED">AED</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="available">Available</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="available"
                          checked={formData.isAvailable}
                          onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                          disabled={loading}
                        />
                        <span className="text-sm">{formData.isAvailable ? 'Available' : 'Not Available'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.Image}
                      onChange={(e) => setFormData({ ...formData, Image: e.target.value })}
                      placeholder="/src/assets/dish-name.jpg"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button type="submit" variant="truck" className="flex-1" disabled={loading}>
                      {loading ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)} 
                      className="flex-1"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShoppingBag className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{menuItems.length}</p>
                    <p className="text-muted-foreground">Total Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Badge className="text-accent">✓</Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">
                      {menuItems.filter(item => item.isAvailable).length}
                    </p>
                    <p className="text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                    <Badge variant="destructive">✗</Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-destructive">
                      {menuItems.filter(item => !item.isAvailable).length}
                    </p>
                    <p className="text-muted-foreground">Unavailable</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Menu Items Table */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Loading...</p>
            </div>
          )}
          
          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Card className="truck-art-border hover:shadow-lg transition-all duration-300">
                    <div className="relative h-32 overflow-hidden">
                      <img src={item.Image} alt={item.Name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <Badge variant={item.isAvailable ? 'default' : 'destructive'}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-primary text-lg">{item.Name}</h3>
                        <span className="text-lg font-semibold text-accent">{item.Currency} {item.Price}</span>
                      </div>

                      <Badge variant="outline" className="mb-2">{item.Category}</Badge>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.Description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={item.isAvailable} 
                            onCheckedChange={() => toggleAvailability(item.id)}
                            disabled={loading}
                          />
                          <span className="text-xs text-muted-foreground">{item.isAvailable ? 'Available' : 'Unavailable'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEdit(item)}
                            disabled={loading}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDelete(item.id)}
                            disabled={loading}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No menu items found</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;