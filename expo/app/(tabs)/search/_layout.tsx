import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Discover Recipes",
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