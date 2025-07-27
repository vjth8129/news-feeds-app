import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Bell } from 'lucide-react-native';
import { useHome } from '@/hooks/useHome';
import { useCategories } from '@/hooks/useCategories';




const FILTER_TABS = ['All', 'Technology', 'Business', 'Science'];

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] = React.useState('All');
  const router = useRouter();
  const { main, categories, loading, error } = useHome();
  const { categories: allCategories, loading: loadingAllCategories, error: errorAllCategories } = useCategories();

  console.log(main);

  const handleItemPress = (itemId: string) => {
    router.push(`/(tabs)/audio/${itemId}`);
  };

  const renderBriefingItem = (item: any) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.briefingItem}
      onPress={() => handleItemPress(item.id)}
    >
      <View style={styles.briefingIcon}>
        {(item.image || item.imageUri) ? (
          <Image 
            source={{ uri: item.image || item.imageUri }} 
            style={{ width: 32, height: 32, borderRadius: 8 }}
            defaultSource={require('@/assets/images/icon.png')}
            onError={() => console.log('Failed to load briefing image:', item.image || item.imageUri)}
          />
        ) : (
          <Text style={styles.briefingEmoji}>{item.icon || '📰'}</Text>
        )}
      </View>
      <View style={styles.briefingContent}>
        <Text style={styles.briefingTitle}>{item.title}</Text>
        <Text style={styles.briefingSubtitle}>{item.text}</Text>
      </View>
      <ChevronRight color="#8E8E93" size={16} />
    </TouchableOpacity>
  );

  const renderInterest = (item: any) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.categoryItem}
      onPress={() => handleItemPress(item.id)}
    >
      <View style={styles.categoryIcon}>
        {(item.image || item.imageUri) ? (
          <Image 
            source={{ uri: item.image || item.imageUri }} 
            style={{ width: 32, height: 32, borderRadius: 8 }}
            defaultSource={require('@/assets/images/icon.png')}
            onError={() => console.log('Failed to load interest image:', item.image || item.imageUri)}
          />
        ) : (
          <Text style={styles.categoryEmoji}>{item.icon || '⭐'}</Text>
        )}
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categorySubtitle}>{item.text}</Text>
      </View>
      <ChevronRight color="#8E8E93" size={16} />
    </TouchableOpacity>
  );


  const renderNewCategory = (item: any) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.categoryItem}
      onPress={() => handleItemPress(item.id)}
    >
      <View style={styles.categoryIcon}>
        {(item.image || item.imageUri) ? (
          <Image 
            source={{ uri: item.image || item.imageUri }} 
            style={{ width: 32, height: 32, borderRadius: 8 }}
            defaultSource={require('@/assets/images/icon.png')}
            onError={() => console.log('Failed to load category image:', item.image || item.imageUri)}
          />
        ) : (
          <Text style={styles.categoryEmoji}>{item.icon || '🆕'}</Text>
        )}
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categorySubtitle}>{item.text}</Text>
      </View>
      <ChevronRight color="#8E8E93" size={16} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading...</Text>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Failed to load home data</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell color="#8E8E93" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          style={styles.filterContainer}
          showsHorizontalScrollIndicator={false}
        >
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                selectedFilter === tab && styles.filterTabActive
              ]}
              onPress={() => setSelectedFilter(tab)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === tab && styles.filterTabTextActive
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Briefings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Briefings</Text>
          {main.map(renderBriefingItem)}
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          {categories.map(renderInterest)}
        </View>

        {/* News Categories Section (from allCategories API) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>News Categories</Text>
          {loadingAllCategories ? (
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 10 }}>Loading...</Text>
          ) : errorAllCategories ? (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>Failed to load news categories</Text>
          ) : (
            <>
              {Array.isArray(allCategories) && allCategories.slice(0, 10).map(renderNewCategory)}
              {Array.isArray(allCategories) && allCategories.length > 10 && (
                <TouchableOpacity 
                  style={styles.showMoreButton}
                  onPress={() => router.push('/(tabs)/explore')}
                >
                  <Text style={styles.showMoreText}>Show More Categories</Text>
                  <ChevronRight color="#4285f4" size={16} />
                </TouchableOpacity>
              )}
            </>
          )}
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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#2a2f3e',
  },
  filterTabActive: {
    backgroundColor: '#4285f4',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  briefingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2f3e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  briefingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  briefingEmoji: {
    fontSize: 20,
  },
  briefingContent: {
    flex: 1,
  },
  briefingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  briefingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2f3e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2f3e',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  showMoreText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#4285f4',
    marginRight: 8,
  },
});