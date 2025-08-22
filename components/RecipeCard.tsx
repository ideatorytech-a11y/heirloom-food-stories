import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, Clock, Users, ThumbsUp, MessageCircle } from 'lucide-react-native';
import { Recipe } from '@/types/recipe';
import { useFavorites } from '@/hooks/favorites-store';
import { useLikesComments } from '@/hooks/likes-comments-store';
import { router } from 'expo-router';

interface RecipeCardProps {
  recipe: Recipe;
}

const { width } = Dimensions.get('window');

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getLikes, getComments } = useLikesComments();
  const favorite = isFavorite(recipe.id);
  const likes = getLikes(recipe.id);
  const comments = getComments(recipe.id);

  const handlePress = () => {
    router.push(`/recipe/${recipe.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.95}
      testID={`recipe-card-${recipe.id}`}
    >
      <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      <View style={styles.overlay} />
      
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(recipe.id)}
        testID={`favorite-button-${recipe.id}`}
      >
        <Heart 
          size={24} 
          color="#fff" 
          fill={favorite ? '#fff' : 'transparent'}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.cuisine}>{recipe.cuisine.toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
        <Text style={styles.generation}>{recipe.generation}</Text>
        
        <Text style={styles.storyPreview} numberOfLines={3}>
          &ldquo;{recipe.story.substring(0, 150)}...&rdquo;
        </Text>

        <View style={styles.footer}>
          <View style={styles.stat}>
            <Clock size={14} color="#fff" />
            <Text style={styles.statText}>{recipe.prepTime}</Text>
          </View>
          <View style={styles.stat}>
            <Users size={14} color="#fff" />
            <Text style={styles.statText}>{recipe.servings} servings</Text>
          </View>
        </View>
        
        <View style={styles.engagementFooter}>
          <View style={styles.engagementStat}>
            <ThumbsUp size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.engagementStatText}>{likes}</Text>
          </View>
          <View style={styles.engagementStat}>
            <MessageCircle size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.engagementStatText}>{comments.length}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 420,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    backgroundGradient: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  cuisine: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    lineHeight: 34,
  },
  generation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  storyPreview: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  engagementFooter: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  engagementStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementStatText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
});