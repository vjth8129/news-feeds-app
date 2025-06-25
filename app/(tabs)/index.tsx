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
import { ChevronRight, Bell } from 'lucide-react-native';

const BRIEFING_ITEMS = [
  {
    id: 'daily-brief',
    title: 'Daily Brief',
    subtitle: 'Daily News',
    icon: '📰',
    bgColor: '#1a4c8c',
  },
  {
    id: 'morning-brief',
    title: 'Morning Brief',
    subtitle: 'Morning News',
    icon: '🌅',
    bgColor: '#2d5a3d',
  },
  {
    id: 'evening-brief',
    title: 'Evening Brief',
    subtitle: 'Evening News',
    icon: '🌆',
    bgColor: '#8b4513',
  },
];

const NEWS_CATEGORIES = [
  {
    id: 'tech',
    title: 'The Latest in Tech',
    subtitle: 'Tech News',
    icon: '💻',
    bgColor: '#1a5f7a',
  },
  {
    id: 'market',
    title: 'Market Trends',
    subtitle: 'Business Insights',
    icon: '📈',
    bgColor: '#4a5d23',
  },
  {
    id: 'science',
    title: 'Breakthroughs in Science',
    subtitle: 'Science Discoveries',
    icon: '🔬',
    bgColor: '#1e3a8a',
  },
  {
    id: 'politics',
    title: 'Inside Politics',
    subtitle: 'Political Analysis',
    icon: '🏛️',
    bgColor: '#374151',
  },
];

const FILTER_TABS = ['All', 'Technology', 'Business', 'Science'];

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] = React.useState('All');

  const renderBriefingItem = (item: typeof BRIEFING_ITEMS[0]) => (
    <TouchableOpacity key={item.id} style={styles.briefingItem}>
      <View style={[styles.briefingIcon, { backgroundColor: item.bgColor }]}>
        <Text style={styles.briefingEmoji}>{item.icon}</Text>
      </View>
      <View style={styles.briefingContent}>
        <Text style={styles.briefingTitle}>{item.title}</Text>
        <Text style={styles.briefingSubtitle}>{item.subtitle}</Text>
      </View>
      <ChevronRight color="#8E8E93" size={16} />
    </TouchableOpacity>
  );

  const renderNewsCategory = (item: typeof NEWS_CATEGORIES[0]) => (
    <TouchableOpacity key={item.id} style={styles.categoryItem}>
      <View style={[styles.categoryIcon, { backgroundColor: item.bgColor }]}>
        <Text style={styles.categoryEmoji}>{item.icon}</Text>
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categorySubtitle}>{item.subtitle}</Text>
      </View>
      <ChevronRight color="#8E8E93" size={16} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>For you</Text>
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
          {BRIEFING_ITEMS.map(renderBriefingItem)}
        </View>

        {/* News Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>News Categories</Text>
          {NEWS_CATEGORIES.map(renderNewsCategory)}
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
});