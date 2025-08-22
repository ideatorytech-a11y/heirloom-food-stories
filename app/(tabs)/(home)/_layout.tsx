import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Family Recipes",
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