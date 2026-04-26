// src/screens/WelcomeScreen.js
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, StatusBar, ImageBackground,
} from 'react-native';
import { COLORS, SIZES } from '../config/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Hero background */}
      <View style={styles.hero}>
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroEmoji}>👘</Text>
          <Text style={styles.appName}>PURANO KAPADA</Text>
          <Text style={styles.nepali}>पुरानो कपडा</Text>
        </View>
        {/* decorative circles */}
        <View style={[styles.circle, { width: 220, height: 220, top: -60, right: -60 }]} />
        <View style={[styles.circle, { width: 140, height: 140, top: 80, left: -40 }]} />
      </View>

      {/* Bottom card */}
      <View style={styles.card}>
        <Text style={styles.headline}>Nepal's #1 Platform for{'\n'}Second-Hand Clothes</Text>
        <Text style={styles.sub}>Buy, sell, and earn. Join thousands of Nepalis already using Purano Kapada.</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>5K+</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>2K+</Text>
            <Text style={styles.statLabel}>Sellers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>10+</Text>
            <Text style={styles.statLabel}>Cities</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.primaryBtnText}>Create Free Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryBtnText}>I already have an account</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={{ color: COLORS.primary }}>Terms & Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  hero: { height: height * 0.45, backgroundColor: COLORS.primary, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  circle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' },
  heroContent: { alignItems: 'center', zIndex: 1 },
  heroEmoji: { fontSize: 70, marginBottom: 12 },
  appName: { fontSize: 24, fontWeight: '800', color: COLORS.white, letterSpacing: 3 },
  nepali: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  card: {
    flex: 1, backgroundColor: COLORS.white,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    marginTop: -24, paddingHorizontal: 24, paddingTop: 30,
  },
  headline: { fontSize: 22, fontWeight: '800', color: COLORS.black, lineHeight: 30 },
  sub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8, lineHeight: 20 },
  stats: { flexDirection: 'row', marginVertical: 20, alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.grayBorder },
  primaryBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
  },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    borderWidth: 1.5, borderColor: COLORS.primary,
    borderRadius: SIZES.radius, paddingVertical: 14,
    alignItems: 'center', marginTop: 12,
  },
  secondaryBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  terms: { textAlign: 'center', color: COLORS.gray, fontSize: 12, marginTop: 16 },
});