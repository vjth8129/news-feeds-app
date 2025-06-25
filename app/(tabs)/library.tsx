import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Bookmark as BookmarkIcon, Clock, Download, Settings } from 'lucide-react-native';

const LIBRARY_SECTIONS = [
  {
    id: 'bookmarks',
    title: 'Bookmarked Articles',
    count: 12,
    icon: BookmarkIcon,
    color: '#4285f4',
  },
  {
    id: 'history',
    title: 'Reading History',
    count: 48,
    icon: Clock,
    color: '#34a853',
  },
  {
    id: 'downloads',
    title: 'Downloaded Articles',
    count: 5,
    icon: Download,
    color: '#ff6b35',
  },
];

const RECENT_BOOKMARKS = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in Healthcare',
    source: 'Tech News',
    readTime: '5 min read',
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Climate Change: New Research Reveals Alarming Trends',
    source: 'Science Daily',
    readTime: '8 min read',
    category: 'Environment',
  },
  {
    id: '3',
    title: 'Global Markets Show Signs of Recovery',
    source: 'Business Times',
    readTime: '3 min read',
    category: 'Finance',
  },
];

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Library</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings color="#8E8E93" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Library Sections */}
        <View style={styles.section}>
          {LIBRARY_SECTIONS.map((section) => (
            <TouchableOpacity key={section.id} style={styles.libraryCard}>
              <View style={[styles.iconContainer, { backgroundColor: section.color }]}>
                <section.icon color="#FFFFFF" size={24} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{section.title}</Text>
                <Text style={styles.cardCount}>{section.count} items</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Bookmarks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Bookmarks</Text>
          {RECENT_BOOKMARKS.map((article) => (
            <TouchableOpacity key={article.id} style={styles.articleCard}>
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {article.title}
                </Text>
                <View style={styles.articleMeta}>
                  <Text style={styles.articleSource}>{article.source}</Text>
                  <Text style={styles.articleDivider}>•</Text>
                  <Text style={styles.articleReadTime}>{article.readTime}</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{article.category}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.bookmarkButton}>
                <BookmarkIcon color="#4285f4" size={20} fill="#4285f4" />
              </TouchableOpacity>
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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  libraryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2f3e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#2a2f3e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  articleContent: {
    flex: 1,
    marginRight: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 22,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleSource: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  articleDivider: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginHorizontal: 6,
  },
  articleReadTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4285f4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  bookmarkButton: {
    padding: 4,
  },
});