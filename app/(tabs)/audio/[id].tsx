import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Rewind, 
  FastForward,
  Volume2 
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Slider } from '@react-native-community/slider';

const { width } = Dimensions.get('window');

// Mock audio data based on the briefing/category selected
const AUDIO_DATA = {
  'daily-brief': {
    title: 'The Daily',
    source: 'The New York Times',
    duration: 1800, // 30 minutes in seconds
    coverImage: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    description: 'Your daily news briefing covering the most important stories of the day.',
  },
  'morning-brief': {
    title: 'Morning Brief',
    source: 'Morning News',
    duration: 1200, // 20 minutes
    coverImage: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    description: 'Start your day with the latest morning news and updates.',
  },
  'evening-brief': {
    title: 'Evening Brief',
    source: 'Evening News',
    duration: 900, // 15 minutes
    coverImage: 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    description: 'Wind down with the evening news summary.',
  },
  'tech': {
    title: 'Tech Weekly',
    source: 'Tech News',
    duration: 2100, // 35 minutes
    coverImage: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    description: 'The latest in technology news and innovations.',
  },
  'market': {
    title: 'Market Watch',
    source: 'Business Insights',
    duration: 1500, // 25 minutes
    coverImage: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    description: 'Market trends and business analysis.',
  },
  'science': {
    title: 'Science Today',
    source: 'Science Discoveries',
    duration: 1800, // 30 minutes
    coverImage: 'https://images.pexels.com/photos/8348553/pexels-photo-8348553.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    description: 'Latest breakthroughs in science and research.',
  },
  'politics': {
    title: 'Political Analysis',
    source: 'Political Analysis',
    duration: 2400, // 40 minutes
    coverImage: 'https://images.pexels.com/photos/6615544/pexels-photo-6615544.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    description: 'In-depth political analysis and commentary.',
  },
};

export default function AudioPlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Get audio data based on ID
  const audioData = AUDIO_DATA[id as keyof typeof AUDIO_DATA] || AUDIO_DATA['daily-brief'];

  // Animation values
  const pulseScale = useSharedValue(1);
  const coverRotation = useSharedValue(0);

  // Animated styles
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const coverStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${coverRotation.value}deg` }],
  }));

  // Start/stop animations based on playing state
  useEffect(() => {
    if (isPlaying) {
      // Pulse animation for play button
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      );
      
      // Slow rotation for cover image
      coverRotation.value = withRepeat(
        withTiming(360, { duration: 20000 }),
        -1,
        false
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
      coverRotation.value = withTiming(coverRotation.value, { duration: 300 });
    }
  }, [isPlaying]);

  // Mock progress update
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= audioData.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, audioData.duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number) => {
    setCurrentTime(value);
  };

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 15));
  };

  const handleSkipForward = () => {
    setCurrentTime(Math.min(audioData.duration, currentTime + 15));
  };

  const handleSpeedChange = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      {/* Cover Art */}
      <View style={styles.coverContainer}>
        <View style={styles.coverFrame}>
          <Animated.View style={[styles.coverImageContainer, coverStyle]}>
            <Image 
              source={{ uri: audioData.coverImage }}
              style={styles.coverImage}
            />
          </Animated.View>
        </View>
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{audioData.title}</Text>
        <Text style={styles.trackSource}>{audioData.source}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.progressSlider}
          minimumValue={0}
          maximumValue={audioData.duration}
          value={currentTime}
          onValueChange={handleSeek}
          minimumTrackTintColor="#4285f4"
          maximumTrackTintColor="#3a3f4e"
          thumbStyle={styles.sliderThumb}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(audioData.duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleSkipBack}
        >
          <Rewind color="#FFFFFF" size={28} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setCurrentTime(Math.max(0, currentTime - 10))}
        >
          <SkipBack color="#FFFFFF" size={32} />
        </TouchableOpacity>

        <Animated.View style={pulseStyle}>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={handlePlayPause}
          >
            {isPlaying ? (
              <Pause color="#FFFFFF" size={36} />
            ) : (
              <Play color="#FFFFFF" size={36} />
            )}
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setCurrentTime(Math.min(audioData.duration, currentTime + 10))}
        >
          <SkipForward color="#FFFFFF" size={32} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleSkipForward}
        >
          <FastForward color="#FFFFFF" size={28} />
        </TouchableOpacity>
      </View>

      {/* Volume Control */}
      <View style={styles.volumeContainer}>
        <Volume2 color="#8E8E93" size={20} />
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={100}
          value={volume}
          onValueChange={setVolume}
          minimumTrackTintColor="#4285f4"
          maximumTrackTintColor="#3a3f4e"
          thumbStyle={styles.volumeThumb}
        />
        <Text style={styles.volumeText}>{volume}</Text>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleSpeedChange}
        >
          <Text style={styles.actionButtonText}>
            Playback Speed {playbackSpeed}x
          </Text>
        </TouchableOpacity>
      </View>

      {/* Episode Details Button */}
      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Episode Details</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d29',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  coverFrame: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  coverImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  trackTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  trackSource: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressSlider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#4285f4',
    width: 20,
    height: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4285f4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4285f4',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 15,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
  },
  volumeThumb: {
    backgroundColor: '#4285f4',
    width: 16,
    height: 16,
  },
  volumeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    minWidth: 30,
    textAlign: 'right',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#2a2f3e',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  detailsButton: {
    backgroundColor: '#4285f4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});