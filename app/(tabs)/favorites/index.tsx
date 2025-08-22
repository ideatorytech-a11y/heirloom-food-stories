import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Heart } from 'lucide-react-native';
import RecipeCard from '@/components/RecipeCard';
import { recipes } from '@/mocks/recipes';
import { useFavorites } from '@/hooks/favorites-store';

export default function FavoritesScreen() {
  const { favoriteIds } = useFavorites();
  
  const favoriteRecipes = recipes.filter(recipe => 
    favoriteIds.includes(recipe.id)
  );

  if (favoriteRecipes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Heart size={64} color="#E0D5C7" />
        <Text style={styles.emptyTitle}>No saved recipes yet</Text>
        <Text style={styles.emptyText}>
          Tap the heart icon on any recipe to save it here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>Your collection of family treasures</Text>
        </View>

        {favoriteRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B4513',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B4513',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
});