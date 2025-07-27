import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, User, ArrowLeft } from 'lucide-react-native';
import { useAllCategories } from '@/hooks/useAllCategories';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();
  const { categories, loading, error } = useAllCategories();

  // Debug logging
  React.useEffect(() => {
    console.log('Explore - categories:', categories);
    console.log('Explore - loading:', loading);
    console.log('Explore - error:', error);
  }, [categories, loading, error]);

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/(tabs)/audio/${categoryId}`);
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleBackPress = () => {
    router.back();
  };

  // Filter categories based on search query
  const filteredCategories = Array.isArray(categories) 
    ? categories.filter(category => 
        category.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
        {loading ? (
          <Text style={styles.loadingText}>Loading categories...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Failed to load categories</Text>
        ) : (
          <View style={styles.grid}>
            {filteredCategories.map((category: any) => (
              <TouchableOpacity
                key={category.id || category._id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id || category._id)}
              >
                <Image 
                  source={{ 
                    uri: category.image || category.imageUri || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&h=200&fit=crop&crop=center'
                  }}
                  style={styles.cardImage}
                  defaultSource={require('@/assets/images/icon.png')}
                  onError={() => console.log('Failed to load explore image:', category.image || category.imageUri)}
                  resizeMode="cover"
                />
                <View style={styles.cardOverlay}>
                  <Text style={styles.cardTitle}>{category.title || category.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    height: 120,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});