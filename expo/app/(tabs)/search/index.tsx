import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import RecipeCard from '@/components/RecipeCard';
import { recipes } from '@/mocks/recipes';

const cuisines = ['All', 'Italian', 'Ukrainian', 'Nigerian', 'Mexican', 'Southern American', 'Greek', 'Korean', 'Indian'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = searchQuery === '' || 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCuisine = selectedCuisine === 'All' || recipe.cuisine === selectedCuisine;
      
      return matchesSearch && matchesCuisine;
    });
  }, [searchQuery, selectedCuisine]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes, ingredients, stories..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {cuisines.map((cuisine) => (
            <TouchableOpacity
              key={cuisine}
              style={[
                styles.filterChip,
                selectedCuisine === cuisine && styles.filterChipActive
              ]}
              onPress={() => setSelectedCuisine(cuisine)}
            >
              <Text style={[
                styles.filterText,
                selectedCuisine === cuisine && styles.filterTextActive
              ]}>
                {cuisine}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFF8F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D8',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0D5C7',
  },
  filterChipActive: {
    backgroundColor: '#D2691E',
    borderColor: '#D2691E',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});