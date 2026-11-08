
import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Create shared book context
const BookContext = createContext();

const books = [
  { id: '1', title: 'The Little Prince', author: 'Antoine de Saint-Exupéry' },
  { id: '2', title: 'Atomic Habits', author: 'James Clear' },
  { id: '3', title: 'The Alchemist', author: 'Paulo Coelho' },
  { id: '4', title: 'Wonder', author: 'R. J. Palacio' },
];

function BookProvider({ children }) {
  const [readingList, setReadingList] = useState([]);

  return (
    <BookContext.Provider value={{ readingList, setReadingList }}>
      {children}
    </BookContext.Provider>
  );
}

const Tab = createBottomTabNavigator();

function DiscoverScreen() {
  const { readingList } = useContext(BookContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookNest 📚</Text>
      <Text style={styles.subtitle}>Discover your next favorite book.</Text>
      <Text style={styles.info}>
        Books in your reading list: {readingList.length}
      </Text>

      {books.map((book) => (
        <View key={book.id} style={styles.card}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
        </View>
      ))}
    </View>
  );
}

function ReadingScreen() {
  const { readingList } = useContext(BookContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reading List ♡</Text>
      <Text style={styles.subtitle}>
        Saved books: {readingList.length}
      </Text>

      {readingList.map((book) => (
        <View key={book.id} style={styles.card}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
        </View>
      ))}
    </View>
  );
}

function MainNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#D94F87',
          tabBarInactiveTintColor: '#A99AA1',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={route.name === 'Discover' ? 'book-outline' : 'bookmark-outline'}
              size={size}
              color={color}
            />
          ),
        })}
      >
        <Tab.Screen name="Discover" component={DiscoverScreen} />
        <Tab.Screen name="My Reading" component={ReadingScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <BookProvider>
        <MainNavigation />
      </BookProvider>
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
    marginBottom: 18,
  },
  info: {
    color: '#B83D73',
    marginBottom: 15,
    fontWeight: '600',
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
