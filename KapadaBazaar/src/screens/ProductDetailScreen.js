// src/screens/ProductDetailScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Image, Dimensions, Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { user } = useAuth();
  const [imgIdx, setImgIdx] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleContact = async () => {
    if (!user) return navigation.navigate('Auth');
    // Create or get existing chat
    const chatId = [user.uid, product.sellerId].sort().join('_') + '_' + product.id;
    await firestore().collection('chats').doc(chatId).set({
      chatId,
      participants: [user.uid, product.sellerId],
      productId: product.id,
      productTitle: product.title,
      productImage: product.images?.[0] || '',
      productPrice: product.price,
      buyerId: user.uid,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      lastMessage: `Hi! Is this still available? 😊`,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    navigation.navigate('Chat', { chatId, sellerName: product.sellerName, product });
  };

  const handleBuyNow = () => {
    if (!user) return navigation.navigate('Auth');
    navigation.navigate('Checkout', { product });
  };

  const toggleLike = () => setLiked(!liked);

  const images = product.images?.length ? product.images : [null];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Image gallery */}
      <View style={styles.gallery}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setImgIdx(Math.round(e.nativeEvent.contentOffset.x / width))}>
          {images.map((uri, i) => (
            <View key={i} style={{ width, height: 300, backgroundColor: COLORS.grayLight, alignItems: 'center', justifyContent: 'center' }}>
              {uri ? <Image source={{ uri }} style={{ width, height: 300 }} resizeMode="cover" />
                : <Text style={{ fontSize: 80 }}>👗</Text>}
            </View>
          ))}
        </ScrollView>

        {/* Controls */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeBtn} onPress={toggleLike}>
          <Text style={{ fontSize: 22 }}>{liked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {/* Dots */}
        {images.length > 1 && (
          <View style={styles.galleryDots}>
            {images.map((_, i) => (
              <View key={i} style={[styles.galleryDot, i === imgIdx && styles.galleryDotActive]} />
            ))}
          </View>
        )}
      </View>

      <ScrollView style={styles.details} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Text style={styles.price}>Rs. {product.price?.toLocaleString()}</Text>
          {product.negotiable && <View style={styles.negBadge}><Text style={styles.negText}>Negotiable</Text></View>}
        </View>
        <Text style={styles.title}>{product.title}</Text>

        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.badgeText, { color: COLORS.success }]}>✓ {product.condition}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#E3F2FD' }]}>
            <Text style={[styles.badgeText, { color: '#1565C0' }]}>📍 {product.location}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#FFF3E0' }]}>
            <Text style={[styles.badgeText, { color: COLORS.secondary }]}>👗 {product.category}</Text>
          </View>
        </View>

        {product.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}

        {/* Seller info */}
        <View style={[styles.section, styles.sellerCard, SHADOWS.sm]}>
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Text style={{ fontSize: 24 }}>{product.sellerName?.[0]?.toUpperCase() || '👤'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sellerName}>{product.sellerName}</Text>
              <Text style={styles.sellerMeta}>⭐ 4.8 · Kathmandu</Text>
            </View>
            <TouchableOpacity style={styles.viewProfileBtn}
              onPress={() => navigation.navigate('SellerProfile', { sellerId: product.sellerId })}>
              <Text style={styles.viewProfileText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety tips */}
        <View style={styles.safetyBox}>
          <Text style={styles.safetyTitle}>🛡️ Safety Tips</Text>
          <Text style={styles.safetyText}>• Meet in a public place in your city</Text>
          <Text style={styles.safetyText}>• Inspect the item before paying</Text>
          <Text style={styles.safetyText}>• Don't share personal bank details</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom actions */}
      {product.sellerId !== user?.uid && !product.sold && (
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.chatBtn} onPress={handleContact}>
            <Text style={styles.chatBtnText}>💬 Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
            <Text style={styles.buyBtnText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {product.sold && (
        <View style={[styles.bottomActions, { justifyContent: 'center' }]}>
          <Text style={{ color: COLORS.error, fontWeight: '700', fontSize: 16 }}>This item has been sold</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  gallery: { position: 'relative' },
  backBtn: {
    position: 'absolute', top: 48, left: 16, width: 38, height: 38,
    borderRadius: 19, backgroundColor: COLORS.white, alignItems: 'center',
    justifyContent: 'center', ...SHADOWS.md,
  },
  likeBtn: {
    position: 'absolute', top: 48, right: 16, width: 38, height: 38,
    borderRadius: 19, backgroundColor: COLORS.white, alignItems: 'center',
    justifyContent: 'center', ...SHADOWS.md,
  },
  galleryDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 8 },
  galleryDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.grayBorder },
  galleryDotActive: { width: 18, backgroundColor: COLORS.primary },
  details: { flex: 1, paddingHorizontal: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  price: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  negBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  negText: { color: COLORS.secondary, fontSize: 12, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.black, marginTop: 4, lineHeight: 24 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.black, marginBottom: 6 },
  description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  sellerCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 14, borderWidth: 1, borderColor: COLORS.grayBorder },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sellerAvatar: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.primaryLight + '40',
    alignItems: 'center', justifyContent: 'center',
  },
  sellerName: { fontSize: 15, fontWeight: '700', color: COLORS.black },
  sellerMeta: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  viewProfileBtn: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8 },
  viewProfileText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  safetyBox: {
    backgroundColor: '#FFF8E1', borderRadius: SIZES.radiusSm, padding: 14,
    marginTop: 16, borderLeftWidth: 3, borderLeftColor: COLORS.secondary,
  },
  safetyTitle: { fontSize: 14, fontWeight: '700', color: COLORS.secondary, marginBottom: 6 },
  safetyText: { fontSize: 12, color: COLORS.text, marginBottom: 3 },
  bottomActions: {
    flexDirection: 'row', padding: 16, gap: 12, backgroundColor: COLORS.white,
    borderTopWidth: 1, borderTopColor: COLORS.grayBorder,
  },
  chatBtn: {
    flex: 1, borderWidth: 2, borderColor: COLORS.primary,
    borderRadius: SIZES.radius, paddingVertical: 14, alignItems: 'center',
  },
  chatBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
  buyBtn: {
    flex: 2, backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius, paddingVertical: 14, alignItems: 'center',
  },
  buyBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
});