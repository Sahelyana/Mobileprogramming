// src/screens/OnboardingScreen.js
import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, Animated, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '../config/theme';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    emoji: '👗',
    bgColor: '#FFF3E0',
    accentColor: COLORS.secondary,
    title: 'Buy Affordable Clothes',
    titleNepali: 'सस्तो कपडा किन्नुहोस्',
    description: 'Find pre-loved clothes from sellers across Nepal at great prices. Save money while looking stylish!',
    badge: '🛍️ 1000+ listings',
  },
  {
    id: '2',
    emoji: '💰',
    bgColor: '#E8F5E9',
    accentColor: COLORS.success,
    title: 'Sell & Earn Money',
    titleNepali: 'बेच्नुहोस् र पैसा कमाउनुहोस्',
    description: 'List your old clothes in minutes and earn cash. Turn your unused wardrobe into money!',
    badge: '💸 Easy cashout',
  },
  {
    id: '3',
    emoji: '🌍',
    bgColor: '#E3F2FD',
    accentColor: '#1565C0',
    title: 'Help the Environment',
    titleNepali: 'वातावरण जोगाउनुहोस्',
    description: 'By reusing clothes, you reduce waste and help build a sustainable Nepal. Every item counts!',
    badge: '♻️ Go green',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('onboarding_seen', 'true');
    navigation.replace('Auth');
  };

  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.imageArea, { backgroundColor: item.bgColor }]}>
        <Text style={styles.mainEmoji}>{item.emoji}</Text>
        <View style={[styles.badge, { backgroundColor: item.accentColor + '20' }]}>
          <Text style={[styles.badgeText, { color: item.accentColor }]}>{item.badge}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.titleNepali}>{item.titleNepali}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity style={styles.skipBtn} onPress={handleGetStarted}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
      />

      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
            const opacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
            return (
              <Animated.View key={i} style={[styles.dot, { width: dotWidth, opacity }]} />
            );
          })}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? 'Get Started 🚀' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  skipBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8 },
  skipText: { color: COLORS.gray, fontSize: 14, fontWeight: '500' },
  slide: { flex: 1 },
  imageArea: {
    height: height * 0.45, alignItems: 'center', justifyContent: 'center',
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
  },
  mainEmoji: { fontSize: 100 },
  badge: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, marginTop: 20,
  },
  badgeText: { fontSize: 14, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 32 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.black, lineHeight: 32 },
  titleNepali: { fontSize: 15, color: COLORS.gray, marginTop: 4, marginBottom: 16 },
  description: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 24 },
  footer: {
    paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16,
    alignItems: 'center', gap: 20,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    height: 8, borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    width: '100%', paddingVertical: 16,
    borderRadius: SIZES.radius, alignItems: 'center',
  },
  nextText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});