// src/screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../config/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(async () => {
      const seen = await AsyncStorage.getItem('onboarding_seen');
      navigation.replace(seen ? 'Auth' : 'Onboarding');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Background circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <Animated.View style={[styles.logoWrap, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
        <Text style={styles.logoEmoji}>👘</Text>
      </Animated.View>

      <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
        PURANO KAPADA
      </Animated.Text>

      <Animated.Text style={[styles.nepali, { opacity: textOpacity }]}>
        पुरानो कपडा
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Buy & Sell Old Clothes in Nepal
      </Animated.Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ for Nepal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle1: {
    position: 'absolute', width: 300, height: 300,
    borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.05)',
    top: -80, right: -80,
  },
  circle2: {
    position: 'absolute', width: 200, height: 200,
    borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: 60, left: -60,
  },
  logoWrap: {
    width: 100, height: 100, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoEmoji: { fontSize: 50 },
  appName: {
    fontSize: 28, fontWeight: '800',
    color: COLORS.white, letterSpacing: 3,
  },
  nepali: {
    fontSize: 18, fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4, letterSpacing: 1,
  },
  tagline: {
    fontSize: 14, color: 'rgba(255,255,255,0.7)',
    marginTop: 12, letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute', bottom: 40,
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)', fontSize: 12,
  },
});