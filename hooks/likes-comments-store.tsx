import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Comment } from '@/types/recipe';
import { recipes } from '@/mocks/recipes';

interface LikesCommentsState {
  likes: Record<string, number>;
  userLikes: Record<string, boolean>;
  comments: Record<string, Comment[]>;
}

export const [LikesCommentsContext, useLikesComments] = createContextHook(() => {
  const [state, setState] = useState<LikesCommentsState>({
    likes: {},
    userLikes: {},
    comments: {}
  });
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('likes-comments-data');
      if (stored) {
        const parsedData = JSON.parse(stored);
        setState({
          likes: parsedData.likes || {},
          userLikes: parsedData.userLikes || {},
          comments: parsedData.comments || {}
        });
      } else {
        const initialLikes: Record<string, number> = {};
        const initialComments: Record<string, Comment[]> = {};
        
        recipes.forEach(recipe => {
          initialLikes[recipe.id] = recipe.likes;
          initialComments[recipe.id] = recipe.comments.map(comment => ({
            ...comment,
            timestamp: new Date(comment.timestamp)
          }));
        });
        
        setState({
          likes: initialLikes,
          userLikes: {},
          comments: initialComments
        });
      }
    } catch (error) {
      console.error('Error loading likes/comments data:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveData = async (newState: LikesCommentsState) => {
    try {
      await AsyncStorage.setItem('likes-comments-data', JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving likes/comments data:', error);
    }
  };

  const toggleLike = useCallback((recipeId: string) => {
    const newState = { ...state };
    const isCurrentlyLiked = newState.userLikes[recipeId] || false;
    
    newState.userLikes[recipeId] = !isCurrentlyLiked;
    newState.likes[recipeId] = (newState.likes[recipeId] || 0) + (isCurrentlyLiked ? -1 : 1);
    
    setState(newState);
    saveData(newState);
  }, [state]);

  const addComment = useCallback((recipeId: string, text: string, author: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author,
      text,
      timestamp: new Date()
    };
    
    const newState = { ...state };
    newState.comments[recipeId] = [...(newState.comments[recipeId] || []), newComment];
    
    setState(newState);
    saveData(newState);
  }, [state]);

  const getLikes = useCallback((recipeId: string): number => {
    return state.likes[recipeId] || 0;
  }, [state.likes]);

  const isLiked = useCallback((recipeId: string): boolean => {
    return state.userLikes[recipeId] || false;
  }, [state.userLikes]);

  const getComments = useCallback((recipeId: string): Comment[] => {
    return state.comments[recipeId] || [];
  }, [state.comments]);

  return useMemo(() => ({
    isLoaded,
    toggleLike,
    addComment,
    getLikes,
    isLiked,
    getComments
  }), [isLoaded, toggleLike, addComment, getLikes, isLiked, getComments]);
});