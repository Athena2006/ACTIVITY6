
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

// Create shared book context
const BookContext = createContext();

const books = [
  {
    id: '1',
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    emoji: '⭐',
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    emoji: '🌱',
  },
  {
    id: '3',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    emoji: '🪄',
  },
  {
    id: '4',
    title: 'Wonder',
    author: 'R. J. Palacio',
    emoji: '🌸',
  },
  {
    id: '5',
    title: 'Ikigai',
    author: 'Héctor García',
    emoji: '🌷',
  },
  {
    id: '6',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    emoji: '☁️',
  },
];

// Context Provider for shared book data
function BookProvider({ children }) {
  const [readingList, setReadingList] = useState([]);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  // Show updating state before changing the reading list
  const updateLibrary = (action) => {
    if (savingRef.current) return;

    savingRef.current = true;
    setSaving(true);

    setTimeout(() => {
      action();
      savingRef.current = false;
      setSaving(false);
    }, 700);
  };

  // Add a book to the reading list
  const addBook = (book) => {
    if (
      savingRef.current ||
      readingList.some((item) => item.id === book.id)
    ) {
      return;
    }

    updateLibrary(() => {
      setReadingList((current) => [
        ...current,
        { ...book, completed: false },
      ]);
    });
  };

  // Remove a book from the reading list
  const removeBook = (id) => {
    updateLibrary(() => {
      setReadingList((current) =>
        current.filter((book) => book.id !== id)
      );
    });
  };

  // Change the book completion status
  const toggleCompleted = (id) => {
    updateLibrary(() => {
      setReadingList((current) =>
        current.map((book) =>
          book.id === id
            ? { ...book, completed: !book.completed }
            : book
        )
      );
    });
  };

  return (
    <BookContext.Provider
      value={{
        readingList,
        saving,
        addBook,
        removeBook,
        toggleCompleted,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

// Screen entrance animation
function useScreenAnimation() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  };
}

// Updating indicator
function SavingMessage() {
  const { saving } = useContext(BookContext);

  if (!saving) return null;

  return (
    <View style={styles.savingBox}>
      <ActivityIndicator size="small" color="#D94F87" />
      <Text style={styles.savingText}>
        Updating your library...
      </Text>
    </View>
  );
}

// Discover Screen
function DiscoverScreen() {
  const { readingList, addBook, saving } = useContext(BookContext);
  const animation = useScreenAnimation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Animated.View style={[styles.header, animation]}>
          <Text style={styles.headerEmoji}>📚</Text>

          <Text style={styles.title}>BookNest</Text>

          <Text style={styles.subtitle}>
            A little space for big stories.
          </Text>

          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>
              Find your next chapter ♡
            </Text>

            <Text style={styles.bannerText}>
              Discover stories and build your own reading collection.
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Discover Books
            </Text>

            <Text style={styles.count}>
              {readingList.length} saved
            </Text>
          </View>
        </Animated.View>

        <SavingMessage />

        <FlatList
          style={styles.listView}
          data={books}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const saved = readingList.some(
              (book) => book.id === item.id
            );

            return (
              <Animated.View style={[styles.card, animation]}>
                <View style={styles.bookEmoji}>
                  <Text style={styles.emojiText}>
                    {item.emoji}
                  </Text>
                </View>

                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.author}>
                    {item.author}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.button,
                    saved && styles.savedButton,
                  ]}
                  onPress={() => addBook(item)}
                  disabled={saved || saving}
                  activeOpacity={0.7}
                >
                  <Text style={styles.buttonText}>
                    {saved ? 'Added ✓' : '+ Add'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

// My Reading Screen
function ReadingScreen() {
  const {
    readingList,
    removeBook,
    toggleCompleted,
    saving,
  } = useContext(BookContext);

  const animation = useScreenAnimation();

  const completed = readingList.filter(
    (book) => book.completed
  ).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Animated.View style={[styles.header, animation]}>
          <Text style={styles.headerEmoji}>💗</Text>

          <Text style={styles.title}>My Reading List</Text>

          <Text style={styles.subtitle}>
            Your stories, your progress.
          </Text>

          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>
              Your Reading Progress
            </Text>

            <Text style={styles.progressNumber}>
              {completed} / {readingList.length}
            </Text>

            <Text style={styles.progressCaption}>
              Books completed
            </Text>
          </View>
        </Animated.View>

        <SavingMessage />

        <FlatList
          style={styles.listView}
          data={readingList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📖</Text>

              <Text style={styles.emptyTitle}>
                Your list is waiting!
              </Text>

              <Text style={styles.emptyText}>
                Add a book from the Discover tab.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Animated.View style={[styles.card, animation]}>
              <View style={styles.bookEmoji}>
                <Text style={styles.emojiText}>
                  {item.emoji}
                </Text>
              </View>

              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>
                  {item.title}
                </Text>

                <Text style={styles.author}>
                  {item.author}
                </Text>

                <Text style={styles.status}>
                  {item.completed
                    ? 'Completed ✓'
                    : 'Currently reading'}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() => toggleCompleted(item.id)}
                  disabled={saving}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      item.completed ? 'refresh' : 'checkmark'
                    }
                    size={18}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeBook(item.id)}
                  disabled={saving}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

// Bottom Tab Navigation
function MainNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Discover"
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarActiveTintColor: '#D94F87',
          tabBarInactiveTintColor: '#B6A4AD',

          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={
                route.name === 'Discover'
                  ? 'compass-outline'
                  : 'heart-outline'
              }
              size={size}
              color={color}
            />
          ),
        })}
      >
        <Tab.Screen
          name="Discover"
          component={DiscoverScreen}
        />

        <Tab.Screen
          name="My Reading"
          component={ReadingScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Main App
export default function App() {
  return (
    <SafeAreaProvider>
      <BookProvider>
        <MainNavigation />
      </BookProvider>
    </SafeAreaProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
  },

  header: {
    flexShrink: 0,
  },

  headerEmoji: {
    fontSize: 28,
    textAlign: 'center',
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#D94F87',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 12,
    color: '#9B8791',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },

  banner: {
    backgroundColor: '#F9DCE8',
    padding: 15,
    borderRadius: 17,
    marginBottom: 16,
  },

  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B83D73',
  },

  bannerText: {
    color: '#8F5570',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    color: '#B83D73',
    fontWeight: 'bold',
  },

  count: {
    fontSize: 12,
    color: '#999',
  },

  savingBox: {
    backgroundColor: '#F9DCE8',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  savingText: {
    color: '#B83D73',
    fontSize: 12,
    fontWeight: '600',
  },

  listView: {
    flex: 1,
  },

  list: {
    paddingTop: 2,
    paddingBottom: 18,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#D98AA8',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  bookEmoji: {
    width: 43,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FCE5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  emojiText: {
    fontSize: 22,
  },

  bookInfo: {
    flex: 1,
    paddingRight: 5,
  },

  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C44578',
  },

  author: {
    color: '#999',
    fontSize: 11,
    marginTop: 4,
  },

  button: {
    backgroundColor: '#E45B91',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },

  savedButton: {
    backgroundColor: '#B9A6B0',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },

  status: {
    color: '#D94F87',
    fontSize: 10,
    marginTop: 6,
  },

  actions: {
    flexDirection: 'row',
    gap: 6,
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

  progressCard: {
    backgroundColor: '#F9DCE8',
    padding: 15,
    borderRadius: 17,
    marginBottom: 14,
  },

  progressTitle: {
    color: '#B83D73',
    fontWeight: 'bold',
    fontSize: 14,
  },

  progressNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D94F87',
    marginTop: 6,
  },

  progressCaption: {
    fontSize: 12,
    color: '#8F5570',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 25,
    borderRadius: 17,
    marginTop: 12,
  },

  emptyEmoji: {
    fontSize: 38,
  },

  emptyTitle: {
    color: '#C44578',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },

  emptyText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 5,
  },

  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F6DCE7',
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 5 : 7,
    minHeight: 62,
    elevation: 10,
  },

  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
