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
import { useCategories } from '@/hooks/useCategories';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserCategoryPreference } from '@/hooks/useUserCategoryPreference';

export default function InterestsScreen() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const router = useRouter();
  const { setInterests } = useAuthStore();
  const { categories, loading, error } = useCategories();
  const { savePreferences, loading: saving, error: saveError } = useUserCategoryPreference();

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = async () => {
    if (selectedInterests.length < 3) {
      return;
    }
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        alert('User not found in session. Please sign up again.');
        return;
      }
      // Get the full selected category objects
      const selectedCategoryObjects = categories.filter((cat: any) => 
        selectedInterests.includes(cat.id || cat._id)
      );
      const result = await savePreferences(userId, selectedCategoryObjects);
      if (result && 'data' in result && result.data) {
        setInterests(selectedInterests);
        router.replace('/(tabs)');
      } else {
        alert(result.error || 'Failed to save preferences');
      }
    } catch (e) {
      alert('Something went wrong.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading categories...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Failed to load categories</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your interests</Text>
        <TouchableOpacity 
          style={[
            styles.nextButton, 
            (selectedInterests.length < 3 || saving) && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={selectedInterests.length < 3 || saving}
        >
          <Text style={[
            styles.nextButtonText,
            (selectedInterests.length < 3 || saving) && styles.nextButtonTextDisabled
          ]}>
            {saving ? 'Saving...' : 'Next'}
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
          {categories.map((category: any) => (
            <TouchableOpacity
              key={category.id || category._id}
              style={[
                styles.interestCard,
                selectedInterests.includes(category.id || category._id) && styles.selectedCard
              ]}
              onPress={() => toggleInterest(category.id || category._id)}
            >
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }}
                style={styles.cardImage}
              />
              <View 
                style={styles.cardOverlay}
              >
                <Text style={styles.cardTitle}>{category.name || category.title}</Text>
              </View>
              {selectedInterests.includes(category.id || category._id) && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
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
});