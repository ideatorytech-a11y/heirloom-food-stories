import { Stack } from "expo-router";

export default function FavoritesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Saved Recipes",
          headerStyle: {
            backgroundColor: '#FFF8F0',
          },
          headerTintColor: '#8B4513',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 20,
          },
        }} 
      />
    </Stack>
  );
}