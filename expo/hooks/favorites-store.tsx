import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  isLoading: boolean;
}

export const [FavoritesProvider, useFavorites] = createContextHook<FavoritesState>(() => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (ids: string[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(ids));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (recipeId: string) => {
    setFavoriteIds(prev => {
      const updated = prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
      saveFavorites(updated);
      return updated;
    });
  };

  const isFavorite = (recipeId: string) => {
    return favoriteIds.includes(recipeId);
  };

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    isLoading
  };
});