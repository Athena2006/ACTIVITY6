
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookNest 📚</Text>
      <Text style={styles.subtitle}>Discover your next favorite book.</Text>

      <View style={styles.card}>
        <Text style={styles.bookTitle}>The Little Prince</Text>
        <Text style={styles.author}>Antoine de Saint-Exupéry</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.bookTitle}>Atomic Habits</Text>
        <Text style={styles.author}>James Clear</Text>
      </View>
    </View>
  );
}

function ReadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reading List ♡</Text>
      <Text style={styles.subtitle}>Your saved books will appear here.</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#D94F87',
            tabBarInactiveTintColor: '#A99AA1',
            tabBarIcon: ({ color, size }) => {
              const iconName =
                route.name === 'Discover' ? 'book-outline' : 'bookmark-outline';

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Discover" component={DiscoverScreen} />
          <Tab.Screen name="My Reading" component={ReadingScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
    padding: 20,
    paddingTop: 35,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#D94F87',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#C44578',
  },
  author: {
    color: '#888',
    marginTop: 5,
  },
});
