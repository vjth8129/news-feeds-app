import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

const INTEREST_CATEGORIES = [
  {
    id: 'technology',
    title: 'Technology',
    color: '#1a4c8c',
    image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
  },
  {
    id: 'health',
    title: 'Health',
    color: '#2d5a3d',
    image: 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
  },
  {
    id: 'business',
    title: 'Business',
    color: '#8b4513',
    image: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
  },
  {
    id: 'science',
    title: 'Science',
    color: '#1a5f7a',
    image: 'https://images.pexels.com/photos/8348553/pexels-photo-8348553.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
  },
  {
    id: 'environment',
    title: 'Environment',
    color: '#2d5016',
    image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
  },
  {
    id: 'finance',
    title: 'Finance',
    color: '#4a5d23',
    image: 'https://images.pexels.com/photos/128867/coins-currency-investment-insurance-128867.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
  },
  {
    id: 'education',
    title: 'Education',
    color: '#1e3a8a',
    image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
  },
  {
    id: 'local-news',
    title: 'Local News',
    color: '#d97706',
    image: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
  },
  {
    id: 'politics',
    title: 'Politics',
    color: '#374151',
    image: 'https://images.pexels.com/photos/6615544/pexels-photo-6615544.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
  },
];

export default function InterestsScreen() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const router = useRouter();
  const { setInterests } = useAuthStore();

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    if (selectedInterests.length < 3) {
      return;
    }
    
    setInterests(selectedInterests);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your interests</Text>
        <TouchableOpacity 
          style={[
            styles.nextButton, 
            selectedInterests.length < 3 && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={selectedInterests.length < 3}
        >
          <Text style={[
            styles.nextButtonText,
            selectedInterests.length < 3 && styles.nextButtonTextDisabled
          ]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Select at least 3 topics to get started
      </Text>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {INTEREST_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.interestCard,
                selectedInterests.includes(category.id) && styles.selectedCard
              ]}
              onPress={() => toggleInterest(category.id)}
            >
              <Image 
                source={{ uri: category.image }}
                style={styles.cardImage}
              />
              <View 
                style={[
                  styles.cardOverlay,
                  { backgroundColor: category.color + '80' }
                ]}
              >
                <Text style={styles.cardTitle}>{category.title}</Text>
              </View>
              {selectedInterests.includes(category.id) && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
        </View>
      </View>
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
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  nextButton: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nextButtonDisabled: {
    backgroundColor: '#2a2f3e',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  nextButtonTextDisabled: {
    color: '#8E8E93',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interestCard: {
    width: '48%',
    height: 120,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4285f4',
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
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4285f4',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  bottomNav: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2f3e',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#2a2f3e',
    borderRadius: 12,
  },
});