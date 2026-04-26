// src/screens/SellScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  StatusBar, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES } from '../config/theme';

const CATEGORIES = ['Men', 'Women', 'Kids', 'Ethnic', 'Footwear', 'Accessories'];
const CONDITIONS = ['Like New', 'Good', 'Fair', 'Worn'];
const DISTRICTS = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal', 'Dharan', 'Biratnagar', 'Birgunj', 'Janakpur'];

export default function SellScreen({ navigation }) {
  const { user, userProfile } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [negotiable, setNegotiable] = useState(false);

  const pickImages = async () => {
    if (images.length >= 4) return Alert.alert('Max 4 images allowed');
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 4 - images.length, quality: 0.7 });
    if (!result.didCancel && result.assets) {
      setImages([...images, ...result.assets]);
    }
  };

  const uploadImages = async () => {
    const urls = [];
    for (const img of images) {
      const ref = storage().ref(`products/${user.uid}/${Date.now()}_${Math.random()}`);
      await ref.putFile(img.uri);
      const url = await ref.getDownloadURL();
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!title || !price || !category || !condition || !location)
      return Alert.alert('Error', 'Please fill all required fields');
    if (images.length === 0)
      return Alert.alert('Error', 'Please add at least one photo');

    setLoading(true);
    try {
      const imageUrls = await uploadImages();
      await firestore().collection('products').add({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.toLowerCase(),
        condition,
        location,
        negotiable,
        images: imageUrls,
        sellerId: user.uid,
        sellerName: userProfile?.name || user.displayName || 'Seller',
        sellerAvatar: userProfile?.avatar || '',
        featured: false,
        sold: false,
        views: 0,
        likes: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Success! 🎉', 'Your item is now listed!', [
        { text: 'View Listings', onPress: () => navigation.navigate('MyListings') },
        { text: 'List Another', onPress: () => { setTitle(''); setDescription(''); setPrice(''); setCategory(''); setCondition(''); setLocation(''); setImages([]); } },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>List an Item</Text>
          <Text style={styles.headerSub}>Sell your clothes and earn money 💰</Text>
        </View>

        <ScrollView style={styles.form} contentContainerStyle={{ padding: 16, gap: 4, paddingBottom: 80 }} keyboardShouldPersistTaps="handled">

          {/* Photos */}
          <Text style={styles.label}>Photos * (up to 4)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {images.map((img, i) => (
              <View key={i} style={styles.imgThumb}>
                <Image source={{ uri: img.uri }} style={styles.imgPreview} />
                <TouchableOpacity style={styles.removeImg} onPress={() => setImages(images.filter((_, idx) => idx !== i))}>
                  <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: '700' }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 4 && (
              <TouchableOpacity style={styles.addPhoto} onPress={pickImages}>
                <Text style={{ fontSize: 32, color: COLORS.gray }}>📷</Text>
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Title */}
          <Text style={styles.label}>Item Title *</Text>
          <TextInput style={styles.input} placeholder="e.g. Blue Denim Jacket, Size M" value={title} onChangeText={setTitle} placeholderTextColor={COLORS.gray} />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
            placeholder="Describe the item, brand, size, reason for selling..."
            value={description} onChangeText={setDescription}
            multiline placeholderTextColor={COLORS.gray}
          />

          {/* Price */}
          <Text style={styles.label}>Price (Rs.) *</Text>
          <View style={styles.priceRow}>
            <View style={styles.pricePrefix}><Text style={styles.pricePrefixText}>Rs.</Text></View>
            <TextInput style={[styles.input, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
              placeholder="500" value={price} onChangeText={setPrice} keyboardType="number-pad" placeholderTextColor={COLORS.gray} />
          </View>
          <TouchableOpacity style={styles.checkRow} onPress={() => setNegotiable(!negotiable)}>
            <View style={[styles.checkbox, negotiable && styles.checkboxActive]}>
              {negotiable && <Text style={{ color: COLORS.white, fontSize: 10 }}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>Price is negotiable</Text>
          </TouchableOpacity>

          {/* Category */}
          <Text style={styles.label}>Category *</Text>
          <View style={styles.chips}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Condition */}
          <Text style={styles.label}>Condition *</Text>
          <View style={styles.chips}>
            {CONDITIONS.map((c) => (
              <TouchableOpacity key={c} style={[styles.chip, condition === c && styles.chipActive]} onPress={() => setCondition(c)}>
                <Text style={[styles.chipText, condition === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Location */}
          <Text style={styles.label}>Your Location *</Text>
          <View style={styles.chips}>
            {DISTRICTS.map((d) => (
              <TouchableOpacity key={d} style={[styles.chip, location === d && styles.chipActive]} onPress={() => setLocation(d)}>
                <Text style={[styles.chipText, location === d && styles.chipTextActive]}>📍 {d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>List Item 🚀</Text>}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { color: COLORS.white, fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  form: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginTop: 14, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.grayBorder, borderRadius: SIZES.radiusSm,
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  pricePrefix: {
    backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 14,
    borderTopLeftRadius: SIZES.radiusSm, borderBottomLeftRadius: SIZES.radiusSm,
  },
  pricePrefixText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: COLORS.grayBorder, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkLabel: { fontSize: 14, color: COLORS.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.grayBorder, backgroundColor: COLORS.white,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  chipTextActive: { color: COLORS.white },
  addPhoto: {
    width: 100, height: 100, borderRadius: SIZES.radiusSm, borderWidth: 2,
    borderColor: COLORS.grayBorder, borderStyle: 'dashed', alignItems: 'center',
    justifyContent: 'center', backgroundColor: COLORS.grayLight,
  },
  addPhotoText: { fontSize: 11, color: COLORS.gray, marginTop: 4 },
  imgThumb: { width: 100, height: 100, borderRadius: SIZES.radiusSm, overflow: 'hidden' },
  imgPreview: { width: 100, height: 100 },
  removeImg: {
    position: 'absolute', top: 4, right: 4,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center',
  },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    paddingVertical: 16, alignItems: 'center', marginTop: 28,
  },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});