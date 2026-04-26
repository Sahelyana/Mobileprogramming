// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, TextInput, StatusBar, Image, Dimensions, RefreshControl,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'men', label: 'Men', emoji: '👔' },
  { id: 'women', label: 'Women', emoji: '👗' },
  { id: 'kids', label: 'Kids', emoji: '👕' },
  { id: 'ethnic', label: 'Ethnic', emoji: '🥻' },
  { id: 'footwear', label: 'Shoes', emoji: '👟' },
  { id: 'accessories', label: 'Accessories', emoji: '👜' },
];

const BANNERS = [
  { id: '1', title: 'Dashain Sale!', subtitle: 'Up to 70% off ethnic wear', bg: '#FF8F00', emoji: '🎊' },
  { id: '2', title: 'Sell & Earn', subtitle: 'List in 2 minutes, cash in 24hrs', bg: '#2E7D32', emoji: '💸' },
  { id: '3', title: 'Premium Verified', subtitle: 'Get the blue tick ✓', bg: '#1565C0', emoji: '🏆' },
];

export default function HomeScreen({ navigation }) {
  const { userProfile } = useAuth();
  const [category, setCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 3000);
    return () => clearInterval(interval);
  }, [category]);

  const fetchProducts = async () => {
    try {
      let q = firestore().collection('products').where('sold', '==', false).orderBy('createdAt', 'desc').limit(20);
      if (category !== 'all') q = q.where('category', '==', category);
      const snap = await q.get();
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(data);
      setFeatured(data.filter(p => p.featured).slice(0, 5));
    } catch (e) {
      console.log(e);
    }
  };

  const onRefresh = async () => { setRefreshing(true); await fetchProducts(); setRefreshing(false); };

  const ProductCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, SHADOWS.sm]}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={styles.cardImg}>
        {item.images?.[0]
          ? <Image source={{ uri: item.images[0] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          : <Text style={{ fontSize: 40 }}>👗</Text>
        }
        {item.featured && <View style={styles.featuredBadge}><Text style={styles.featuredText}>⭐ Featured</Text></View>}
        {item.sold && <View style={styles.soldOverlay}><Text style={styles.soldText}>SOLD</Text></View>}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardPrice}>Rs. {item.price?.toLocaleString()}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardLocation} numberOfLines={1}>📍 {item.location}</Text>
          <View style={[styles.conditionBadge, { backgroundColor: item.condition === 'Like New' ? '#E8F5E9' : '#FFF3E0' }]}>
            <Text style={[styles.conditionText, { color: item.condition === 'Like New' ? COLORS.success : COLORS.secondary }]}>
              {item.condition}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const banner = BANNERS[bannerIdx];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Namaste 🙏</Text>
          <Text style={styles.userName}>{userProfile?.name || 'Welcome!'}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
            <Text style={{ fontSize: 22 }}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
        <Text style={{ fontSize: 18 }}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search clothes, brands, locations...</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        {/* Banner */}
        <View style={[styles.banner, { backgroundColor: banner.bg }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>{banner.title}</Text>
            <Text style={styles.bannerSub}>{banner.subtitle}</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={[styles.bannerBtnText, { color: banner.bg }]}>Explore →</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 52 }}>{banner.emoji}</Text>
        </View>

        {/* Dot indicators */}
        <View style={styles.dots}>
          {BANNERS.map((_, i) => (
            <View key={i} style={[styles.dot, i === bannerIdx && styles.dotActive]} />
          ))}
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, category === cat.id && styles.catChipActive]}
              onPress={() => setCategory(cat.id)}
            >
              <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
              <Text style={[styles.catLabel, category === cat.id && styles.catLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          {[{ label: 'Listings', val: '5.2K+', emoji: '👗' }, { label: 'Sellers', val: '2.1K', emoji: '🧑‍💼' }, { label: 'Cities', val: '12', emoji: '🗺️' }].map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={{ fontSize: 24 }}>{s.emoji}</Text>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {category === 'all' ? 'Recent Listings' : `${CATEGORIES.find(c => c.id === category)?.label} Clothes`}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {products.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>🛍️</Text>
              <Text style={styles.emptyText}>No listings yet</Text>
              <Text style={styles.emptySubText}>Be the first to list in this category!</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {products.map(item => <ProductCard key={item.id} item={item} />)}
            </View>
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 50, paddingHorizontal: 16,
    paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  userName: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: 12,
    marginBottom: 4, borderRadius: SIZES.radius, paddingHorizontal: 14,
    paddingVertical: 12, ...SHADOWS.sm,
  },
  searchPlaceholder: { color: COLORS.gray, fontSize: 14, flex: 1 },
  banner: {
    flexDirection: 'row', alignItems: 'center', margin: 16, borderRadius: 16,
    padding: 20, overflow: 'hidden',
  },
  bannerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4, marginBottom: 12 },
  bannerBtn: {
    backgroundColor: COLORS.white, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start',
  },
  bannerBtnText: { fontSize: 13, fontWeight: '700' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: -8, marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.grayBorder },
  dotActive: { width: 18, backgroundColor: COLORS.primary },
  catScroll: { marginVertical: 10 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.grayBorder,
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catLabel: { fontSize: 13, fontWeight: '500', color: COLORS.text },
  catLabelActive: { color: COLORS.white },
  statsRow: {
    flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 8,
  },
  statBox: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    padding: 12, alignItems: 'center', ...SHADOWS.sm,
  },
  statVal: { fontSize: 16, fontWeight: '800', color: COLORS.primary, marginTop: 4 },
  statLabel: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.black },
  seeAll: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: CARD_WIDTH, backgroundColor: COLORS.white,
    borderRadius: SIZES.radius, overflow: 'hidden',
  },
  cardImg: {
    height: 150, backgroundColor: COLORS.grayLight,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  featuredBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: COLORS.secondary, borderRadius: 10,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  featuredText: { color: COLORS.white, fontSize: 9, fontWeight: '700' },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  soldText: { color: COLORS.white, fontSize: 20, fontWeight: '800', letterSpacing: 2 },
  cardBody: { padding: 10 },
  cardName: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  cardPrice: { fontSize: 15, fontWeight: '800', color: COLORS.primary, marginTop: 2 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  cardLocation: { fontSize: 10, color: COLORS.gray, flex: 1 },
  conditionBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  conditionText: { fontSize: 9, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 12 },
  emptySubText: { fontSize: 13, color: COLORS.gray, marginTop: 4 },
});