export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  story: string;
  author: string;
  generation: string;
  imageUrl: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  familyOrigin: string;
  yearEstablished: string;
  tags: string[];
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  avatar?: string;
}