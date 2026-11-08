
import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const BookContext = createContext();

const books = [
  { id: '1', title: 'The Little Prince', author: 'Antoine de Saint-Exupéry' },
  { id: '2', title: 'Atomic Habits', author: 'James Clear' },
  { id: '3', title: 'The Alchemist', author: 'Paulo Coelho' },
  { id: '4', title: 'Wonder', author: 'R. J. Palacio' },
  { id: '5', title: 'Ikigai', author: 'Héctor García' },
];

function BookProvider({ children }) {
  const [readingList, setReadingList] = useState([]);

  // Add a book to the shared list
  const addBook = (book) => {
    setReadingList((current) => {
      if (current.some((item) => item.id === book.id)) return current;
      return [...current, { ...book, completed: false }];
    });
  };

  // Remove a book from the shared list
  const removeBook = (id) => {
    setReadingList((current) =>
      current.filter((book) => book.id !== id)
    );
  };

  // Update a book's reading status
  const toggleCompleted = (id) => {
    setReadingList((current) =>
      current.map((book) =>
        book.id === id
          ? { ...book, completed: !book.completed }
          : book
      )
    );
  };

  return (
    <BookContext.Provider
      value={{ readingList, addBook, removeBook, toggleCompleted }}
    >
      {children}
    </BookContext.Provider>
  );
}

const Tab = createBottomTabNavigator();

function DiscoverScreen() {
  const { readingList, addBook } = useContext(BookContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookNest 📚</Text>
      <Text style={styles.subtitle}>Find your next favorite read.</Text>
      <Text style={styles.count}>Your library: {readingList.length} books</Text>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const saved = readingList.some((book) => book.id === item.id);

          return (
            <View style={styles.card}>
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.author}>{item.author}</Text>
              </View>

              <TouchableOpacity
                style={[styles.button, saved && styles.savedButton]}
                onPress={() => addBook(item)}
                disabled={saved}
              >
                <Text style={styles.buttonText}>
                  {saved ? 'Added ✓' : '+ Add'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

function ReadingScreen() {
  const { readingList, removeBook, toggleCompleted } =
    useContext(BookContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reading ♡</Text>
      <Text style={styles.subtitle}>
        {readingList.length} saved books
      </Text>

      <FlatList
        data={readingList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Your reading list is empty.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.status}>
                {item.completed ? 'Completed ✓' : 'Currently reading'}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => toggleCompleted(item.id)}
              >
                <Ionicons
                  name={item.completed ? 'refresh' : 'checkmark'}
                  size={18}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeBook(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
    padding: 18,
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
    marginBottom: 12,
  },
  count: {
    color: '#B83D73',
    fontWeight: '600',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  bookInfo: {
    flex: 1,
    paddingRight: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C44578',
  },
  author: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#E45B91',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
  },
  savedButton: {
    backgroundColor: '#B9A6B0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  status: {
    color: '#D94F87',
    fontSize: 11,
    marginTop: 7,
  },
  actions: {
    flexDirection: 'row',
    gap: 7,
  },
  smallButton: {
    backgroundColor: '#D94F87',
    padding: 9,
    borderRadius: 9,
  },
  deleteButton: {
    backgroundColor: '#E77B91',
    padding: 9,
    borderRadius: 9,
  },
  empty: {
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});
