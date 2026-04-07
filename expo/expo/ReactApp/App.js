import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';

const categories = ['Men', 'Women', 'Kids'];

const featured = [
  {
    id: '1',
    name: 'Denim Jacket',
    price: 'NPR 1200',
    tag: 'HOT',
    image: 'https://via.placeholder.com/150/3b82f6'
  },
  {
    id: '2',
    name: 'Summer Dress',
    price: 'NPR 900',
    tag: 'NEW',
    image: 'https://via.placeholder.com/150/ef4444'
  },
  {
    id: '3',
    name: 'Casual T-Shirt',
    price: 'NPR 500',
    tag: 'TRENDING',
    image: 'https://via.placeholder.com/150/f59e0b'
  },
];

const products = [
  { id: '1', name: 'Women white shirt', price: 'NPR 300' },
  { id: '2', name: 'Men black vest', price: 'NPR 250' },
  { id: '3', name: 'Frock for girl', price: 'NPR 350' },
];

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState('Men');

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: 'https://via.placeholder.com/80' }}
        style={styles.productImg}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>

      <View style={styles.icons}>
        <Text>🛒</Text>
        <Text>♡</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Nepali Thrift Bazar</Text>
          <Text style={styles.subtitle}>Find your style ♻️</Text>
        </View>
        <Text style={styles.search}>🔍</Text>
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[
              styles.categoryBtn,
              activeCategory === cat && styles.activeCategory
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === cat && { color: '#fff' }
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured */}
      <Text style={styles.section}>🔥 Featured</Text>
      <FlatList
        horizontal
        data={featured}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.featuredCard}>

            <Image source={{ uri: item.image }} style={styles.featuredImg} />

            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>

            <Text style={styles.featuredName}>{item.name}</Text>
            <Text style={styles.featuredPrice}>{item.price}</Text>

          </View>
        )}
      />

      {/* Products */}
      <Text style={styles.section}>Recently Added</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
      />

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Text style={styles.navIcon}>🏠</Text>
        <Text style={styles.navIcon}>➕</Text>
        <Text style={styles.navIcon}>👤</Text>
      </View>

    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3fb',
    paddingHorizontal: 15,
    paddingTop: 20
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a'
  },

  subtitle: {
    fontSize: 12,
    color: '#64748b'
  },

  search: {
    fontSize: 22,
    color: '#ef4444'
  },

  categories: {
    flexDirection: 'row',
    marginVertical: 15
  },

  categoryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    marginRight: 10
  },

  activeCategory: {
    backgroundColor: '#ef4444'
  },

  categoryText: {
    fontSize: 13,
    color: '#1e3a8a'
  },

  section: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#1e3a8a'
  },

  featuredCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    marginRight: 12,
    elevation: 5
  },

  featuredImg: {
    width: '100%',
    height: 100,
    borderRadius: 15
  },

  tag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10
  },

  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },

  featuredName: {
    marginTop: 8,
    fontSize: 13
  },

  featuredPrice: {
    color: '#3b82f6',
    fontWeight: 'bold'
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 4
  },

  productImg: {
    width: 65,
    height: 65,
    borderRadius: 12,
    marginRight: 10
  },

  name: {
    fontSize: 14
  },

  price: {
    fontWeight: 'bold',
    marginTop: 5,
    color: '#ef4444'
  },

  icons: {
    alignItems: 'center'
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 25,
    marginVertical: 10,
    elevation: 6
  },

  navIcon: {
    fontSize: 22
  }
});