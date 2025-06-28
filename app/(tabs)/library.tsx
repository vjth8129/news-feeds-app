import React, { useState } from 'react';
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
import { ArrowLeft, User } from 'lucide-react-native';

const LIBRARY_TABS = ['Podcasts', 'Downloads', 'Playlists'];

const FOLLOWED_PODCASTS = [
  {
    id: '1',
    title: 'The New York Times',
    subtitle: 'The Daily',
    image: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bgColor: '#d4a574',
  },
  {
    id: '2',
    title: 'Up First',
    subtitle: 'NPR',
    image: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bgColor: '#8b7355',
  },
  {
    id: '3',
    title: 'The Journal.',
    subtitle: 'The Wall Street Journal',
    image: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bgColor: '#7a8471',
  },
  {
    id: '4',
    title: 'The Ezra Klein Show',
    subtitle: 'The New York Times',
    image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bgColor: '#5a5a5a',
  },
  {
    id: '5',
    title: 'Sway',
    subtitle: 'The New York Times',
    image: 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bgColor: '#d4a574',
  },
  {
    id: '6',
    title: 'Hard Fork',
    subtitle: 'The New York Times',
    image: 'https://images.pexels.com/photos/8348553/pexels-photo-8348553.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    bgColor: '#7a8471',
  },
];

export default function LibraryScreen() {
  const [selectedTab, setSelectedTab] = useState('Podcasts');
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handlePodcastPress = (podcastId: string) => {
    console.log(`Selected podcast: ${podcastId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Library</Text>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <User color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {LIBRARY_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.tabActive
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab && styles.tabTextActive
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Followed Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Followed</Text>
          
          {FOLLOWED_PODCASTS.map((podcast) => (
            <TouchableOpacity
              key={podcast.id}
              style={styles.podcastItem}
              onPress={() => handlePodcastPress(podcast.id)}
            >
              <View style={[styles.podcastImage, { backgroundColor: podcast.bgColor }]}>
                <Image 
                  source={{ uri: podcast.image }}
                  style={styles.podcastImageContent}
                />
              </View>
              <View style={styles.podcastInfo}>
                <Text style={styles.podcastTitle}>{podcast.title}</Text>
                <Text style={styles.podcastSubtitle}>{podcast.subtitle}</Text>
              </View>
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  podcastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  podcastImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podcastImageContent: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  podcastInfo: {
    flex: 1,
  },
  podcastTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  podcastSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
});