// hooks/useMenuItems.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import fallbackData from './fallback_data.json';

// add a flag to control source
const USE_FALLBACK = true; 

export const useMenuItems = (filters = {}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const transformData = (data) => {
    if (!Array.isArray(data)) throw new Error('Data is not an array');
    return data.map(item => ({
      id: item.id,
      Name: item.name,
      Description: item.description,
      Category: item.category,
      Price: parseFloat(item.price),
      Currency: item.currency,
      isAvailable: item.is_available,
      Image: item.image || ''
    }));
  };

  const applyFilters = (data) => {
    let filtered = data;
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    if (filters.isAvailable !== undefined) {
      filtered = filtered.filter(item => item.is_available === filters.isAvailable);
    }
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }
    return filtered;
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);

    try {
      if (USE_FALLBACK) {
        // Always use fallback JSON
        let fallback = applyFilters(fallbackData);
        const transformedFallback = transformData(fallback);
        setMenuItems(transformedFallback);
      } else {
        // Fetch from Supabase
        let query = supabase.from('menu_items').select('*');

        if (filters.category) query = query.eq('category', filters.category);
        if (filters.isAvailable !== undefined) query = query.eq('is_available', filters.isAvailable);
        if (filters.limit) query = query.limit(filters.limit);

        query = query.order('name', { ascending: true });

        const { data, error } = await query;
        if (error) throw error;

        const transformedData = transformData(data);
        setMenuItems(transformedData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch menu items');
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [filters.category, filters.isAvailable, filters.limit]);

  return { menuItems, loading, error, refetch: fetchMenuItems };
};

// Specific hooks
export const useBestSellers = (limit = null, availableOnly = true) =>
  useMenuItems({ category: 'BEST SELLERS', isAvailable: availableOnly, limit });

export const useMenuByCategory = (category, availableOnly = true, limit = null) =>
  useMenuItems({ category, isAvailable: availableOnly, limit });
