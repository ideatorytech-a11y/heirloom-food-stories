import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Share, Platform, Dimensions, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Heart, Share2, Clock, Users, MapPin, Calendar, ThumbsUp } from 'lucide-react-native';
import { recipes } from '@/mocks/recipes';
import { useFavorites } from '@/hooks/favorites-store';
import { useLikesComments } from '@/hooks/likes-comments-store';
import Comments from '@/components/Comments';

const { height } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const recipe = recipes.find(r => r.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getLikes, isLiked, getComments, toggleLike, addComment } = useLikesComments();
  const scrollViewRef = useRef<ScrollView>(null);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Recipe not found</Text>
      </View>
    );
  }

  const favorite = isFavorite(recipe.id);
  const likes = getLikes(recipe.id);
  const liked = isLiked(recipe.id);
  const comments = getComments(recipe.id);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${recipe.title}\n\n"${recipe.story.substring(0, 200)}..."\n\nA ${recipe.generation} family recipe from ${recipe.familyOrigin}\n\n❤️ ${likes} likes | 💬 ${comments.length} comments`,
        title: recipe.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleLike = () => {
    toggleLike(recipe.id);
  };

  const handleAddComment = (text: string, author: string) => {
    addComment(recipe.id, text, author);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} />
          <View style={styles.imageOverlay} />
          
          <SafeAreaView style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => router.back()}
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.rightButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => toggleFavorite(recipe.id)}
              >
                <Heart 
                  size={24} 
                  color="#fff" 
                  fill={favorite ? '#fff' : 'transparent'}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleLike}
              >
                <ThumbsUp 
                  size={24} 
                  color="#fff" 
                  fill={liked ? '#fff' : 'transparent'}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Share2 size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <View style={styles.titleContainer}>
            <Text style={styles.cuisine}>{recipe.cuisine.toUpperCase()}</Text>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.author}>by {recipe.author}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <MapPin size={16} color="#8B4513" />
              <Text style={styles.metaText}>{recipe.familyOrigin}</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={16} color="#8B4513" />
              <Text style={styles.metaText}>{recipe.yearEstablished}</Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={16} color="#8B4513" />
              <Text style={styles.metaText}>{recipe.generation}</Text>
            </View>
          </View>

          <View style={styles.engagementBar}>
            <TouchableOpacity style={styles.engagementButton} onPress={handleLike}>
              <ThumbsUp 
                size={20} 
                color={liked ? '#D2691E' : '#666'} 
                fill={liked ? '#D2691E' : 'transparent'}
              />
              <Text style={[styles.engagementText, liked && styles.engagementTextActive]}>
                {likes} {likes === 1 ? 'Like' : 'Likes'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.engagementButton}>
              <Heart 
                size={20} 
                color={favorite ? '#D2691E' : '#666'} 
                fill={favorite ? '#D2691E' : 'transparent'}
              />
              <Text style={[styles.engagementText, favorite && styles.engagementTextActive]}>
                {favorite ? 'Favorited' : 'Favorite'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.engagementButton} onPress={handleShare}>
              <Share2 size={20} color="#666" />
              <Text style={styles.engagementText}>Share</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.storySection}>
            <Text style={styles.sectionTitle}>The Story</Text>
            <Text style={styles.story}>{recipe.story}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Clock size={20} color="#8B4513" />
              <Text style={styles.statLabel}>Prep Time</Text>
              <Text style={styles.statValue}>{recipe.prepTime}</Text>
            </View>
            <View style={styles.stat}>
              <Clock size={20} color="#8B4513" />
              <Text style={styles.statLabel}>Cook Time</Text>
              <Text style={styles.statValue}>{recipe.cookTime}</Text>
            </View>
            <View style={styles.stat}>
              <Users size={20} color="#8B4513" />
              <Text style={styles.statLabel}>Servings</Text>
              <Text style={styles.statValue}>{recipe.servings}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tagsContainer}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          <Comments 
            comments={comments}
            onAddComment={handleAddComment}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  imageContainer: {
    height: height * 0.5,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  cuisine: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 38,
  },
  author: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
  },
  content: {
    padding: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  storySection: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 16,
  },
  story: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingLeft: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D2691E',
    marginTop: 8,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D2691E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0E6D8',
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#8B4513',
  },
  engagementBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  engagementText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  engagementTextActive: {
    color: '#D2691E',
  },
});