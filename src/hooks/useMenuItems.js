// hooks/useMenuItems.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Custom hook for fetching menu items with filters
export const useMenuItems = (filters = {}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('menu_items').select('*');

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.isAvailable !== undefined) {
        query = query.eq('is_available', filters.isAvailable);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      // Default ordering
      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match your MenuItem interface
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
    } catch (err) {
      setError(err.message);
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [filters.category, filters.isAvailable, filters.limit]);

  return { menuItems, loading, error, refetch: fetchMenuItems };
};

// Specific hook for Best Sellers
export const useBestSellers = (limit = null, availableOnly = true) => {
  return useMenuItems({
    category: 'Best Seller',
    isAvailable: availableOnly,
    limit: limit
  });
};

// Specific hook for any category
export const useMenuByCategory = (category, availableOnly = true, limit = null) => {
  return useMenuItems({
    category: category,
    isAvailable: availableOnly,
    limit: limit
  });
};