// src/screens/ProfileScreen.js
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const MenuItem = ({ emoji, label, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={{ fontSize: 22 }}>{emoji}</Text>
    <Text style={[styles.menuLabel, danger && { color: COLORS.error }]}>{label}</Text>
    <Text style={styles.chevron}>›</Text>
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  const { user, userProfile, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await signOut(); navigation.replace('Auth'); } },
    ]);
  };

  const initial = (userProfile?.name || user?.displayName || 'U')[0]?.toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View>
        <Text style={styles.name}>{userProfile?.name || user?.displayName || 'User'}</Text>
        <Text style={styles.email}>{user?.email || user?.phoneNumber || ''}</Text>
        <View style={styles.statsRow}>
          {[
            { val: userProfile?.totalSales || 0, label: 'Sales' },
            { val: userProfile?.totalPurchases || 0, label: 'Purchases' },
            { val: userProfile?.rating?.toFixed(1) || '—', label: 'Rating' },
          ].map((s, i) => (
            <View key={i} style={styles.stat}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editText}>✏️ Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        {/* Selling */}
        <Text style={styles.section}>My Selling</Text>
        <View style={[styles.card, SHADOWS.sm]}>
          <MenuItem emoji="📦" label="My Listings" onPress={() => navigation.navigate('MyListings')} />
          <MenuItem emoji="📋" label="My Orders" onPress={() => navigation.navigate('Orders')} />
        </View>

        {/* Profit tools */}
        <Text style={styles.section}>Boost & Earn</Text>
        <View style={[styles.card, SHADOWS.sm]}>
          <MenuItem emoji="⭐" label="Feature My Listings" onPress={() => Alert.alert('Coming Soon', 'Boost your listing for Rs. 50/day')} />
          <MenuItem emoji="🏆" label="Get Verified Seller Badge" onPress={() => Alert.alert('Coming Soon', 'Verified badge for Rs. 200/month')} />
          <MenuItem emoji="💰" label="Refer & Earn Rs. 100" onPress={() => Alert.alert('Coming Soon', 'Refer friends and earn commission')} />
        </View>

        {/* Account */}
        <Text style={styles.section}>Account</Text>
        <View style={[styles.card, SHADOWS.sm]}>
          <MenuItem emoji="🔔" label="Notifications" onPress={() => navigation.navigate('Notifications')} />
          <MenuItem emoji="🛡️" label="Privacy & Safety" onPress={() => {}} />
          <MenuItem emoji="❓" label="Help & Support" onPress={() => {}} />
          <MenuItem emoji="ℹ️" label="About Purano Kapada" onPress={() => {}} />
          <MenuItem emoji="🚪" label="Sign Out" onPress={handleSignOut} danger />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 50,
    paddingHorizontal: 20, paddingBottom: 24, alignItems: 'center',
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center',
    justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 10,
  },
  avatarText: { color: COLORS.white, fontSize: 28, fontWeight: '800' },
  name: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  email: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 32, marginTop: 16, marginBottom: 12 },
  stat: { alignItems: 'center' },
  statVal: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  editText: { color: COLORS.white, fontSize: 13, fontWeight: '600' },
  menu: { flex: 1, paddingHorizontal: 16 },
  section: { fontSize: 12, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 1, marginTop: 20, marginBottom: 8 },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 14, gap: 12, borderBottomWidth: 0.5, borderBottomColor: COLORS.grayBorder,
  },
  menuLabel: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
  chevron: { color: COLORS.gray, fontSize: 20 },
});