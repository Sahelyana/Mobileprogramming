// src/screens/SearchScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  TouchableOpacity, StatusBar, Image, Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState(['Jacket', 'Saree', 'Jeans', 'Kids dress']);

  useEffect(() => {
    if (query.length > 1) searchProducts();
    else setResults([]);
  }, [query]);

  const searchProducts = async () => {
    try {
      const snap = await firestore().collection('products')
        .where('sold', '==', false)
        .orderBy('title')
        .startAt(query)
        .endAt(query + '\uf8ff')
        .limit(20)
        .get();
      setResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.log(e); }
  };

  const ProductItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, SHADOWS.sm]}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}>
      <View style={styles.cardImg}>
        {item.images?.[0]
          ? <Image source={{ uri: item.images[0] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          : <Text style={{ fontSize: 36 }}>👗</Text>}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardPrice}>Rs. {item.price?.toLocaleString()}</Text>
        <Text style={styles.cardLoc} numberOfLines={1}>📍 {item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22, color: COLORS.primary }}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search clothes, brands..."
          value={query}
          onChangeText={setQuery}
          autoFocus
          placeholderTextColor={COLORS.gray}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={{ fontSize: 18, color: COLORS.gray }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {query.length === 0 ? (
        <View style={styles.recent}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.tags}>
            {recent.map(r => (
              <TouchableOpacity key={r} style={styles.tag} onPress={() => setQuery(r)}>
                <Text style={styles.tagText}>🕐 {r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={i => i.id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => <ProductItem item={item} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ fontSize: 48 }}>🔍</Text>
              <Text style={{ color: COLORS.gray, marginTop: 12, fontSize: 15 }}>No results for "{query}"</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.grayBorder,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  recent: { padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.black, marginBottom: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: COLORS.grayLight, borderWidth: 1, borderColor: COLORS.grayBorder },
  tagText: { fontSize: 13, color: COLORS.text },
  card: { width: CARD_W, backgroundColor: COLORS.white, borderRadius: SIZES.radius, overflow: 'hidden' },
  cardImg: { height: 140, backgroundColor: COLORS.grayLight, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cardBody: { padding: 8 },
  cardTitle: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  cardPrice: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginTop: 2 },
  cardLoc: { fontSize: 10, color: COLORS.gray, marginTop: 2 },
});