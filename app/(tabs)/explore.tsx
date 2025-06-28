import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, User, ArrowLeft } from 'lucide-react-native';

const EXPLORE_CATEGORIES = [
  {
    id: 'true-crime',
    title: 'True Crime',
    icon: '🔍',
    bgColor: 'rgba(139, 115, 85, 0.3)',
  },
  {
    id: 'comedy',
    title: 'Comedy',
    icon: '😄',
    bgColor: 'rgba(212, 165, 116, 0.3)',
  },
  {
    id: 'news',
    title: 'News',
    icon: '📰',
    bgColor: 'rgba(90, 90, 90, 0.3)',
  },
  {
    id: 'sports',
    title: 'Sports',
    icon: '⚽',
    bgColor: 'rgba(212, 165, 116, 0.3)',
  },
  {
    id: 'business',
    title: 'Business',
    icon: '💼',
    bgColor: 'rgba(139, 115, 85, 0.3)',
  },
  {
    id: 'technology',
    title: 'Technology',
    icon: '💻',
    bgColor: 'rgba(122, 132, 113, 0.3)',
  },
  {
    id: 'health',
    title: 'Health',
    icon: '🏥',
    bgColor: 'rgba(122, 132, 113, 0.3)',
  },
  {
    id: 'science',
    title: 'Science',
    icon: '🔬',
    bgColor: 'rgba(122, 132, 113, 0.3)',
  },
  {
    id: 'arts',
    title: 'Arts',
    icon: '🎨',
    bgColor: 'rgba(139, 115, 85, 0.3)',
  },
  {
    id: 'music',
    title: 'Music',
    icon: '🎵',
    bgColor: 'rgba(212, 165, 116, 0.3)',
  },
  {
    id: 'education',
    title: 'Education',
    icon: '📚',
    bgColor: 'rgba(122, 132, 113, 0.3)',
  },
  {
    id: 'kids-family',
    title: 'Kids & Family',
    icon: '👨‍👩‍👧‍👦',
    bgColor: 'rgba(212, 165, 116, 0.3)',
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    console.log(`Selected category: ${categoryId}`);
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <User color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search color="#8E8E93" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find conversations"
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {EXPLORE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.bgColor }]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d29',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2f3e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2f3e',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    paddingVertical: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryCard: {
    width: '47%',
    aspectRatio: 1.5,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryIcon: {
    fontSize: 28,
    alignSelf: 'flex-start',
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});