// src/screens/ChatListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

export default function ChatListScreen({ navigation }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsub = firestore().collection('chats')
      .where('participants', 'array-contains', user.uid)
      .orderBy('updatedAt', 'desc')
      .onSnapshot(snap => setChats(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, [user]);

  const renderChat = ({ item }) => {
    const otherName = item.buyerId === user?.uid ? item.sellerName : item.buyerName || 'User';
    return (
      <TouchableOpacity style={[styles.chatItem, SHADOWS.sm]}
        onPress={() => navigation.navigate('Chat', { chatId: item.chatId, sellerName: otherName, product: { title: item.productTitle, images: [item.productImage], price: item.productPrice } })}>
        <View style={styles.avatar}><Text style={{ fontSize: 22 }}>{otherName?.[0]?.toUpperCase() || '👤'}</Text></View>
        <View style={{ flex: 1 }}>
          <View style={styles.chatRow}>
            <Text style={styles.chatName}>{otherName}</Text>
            <Text style={styles.chatTime}>{item.updatedAt?.toDate?.()?.toLocaleDateString?.() || ''}</Text>
          </View>
          <Text style={styles.chatMsg} numberOfLines={1}>{item.lastMessage}</Text>
          <Text style={styles.productTitle} numberOfLines={1}>📦 {item.productTitle} · Rs.{item.productPrice}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.header}><Text style={styles.headerTitle}>Messages 💬</Text></View>
      {chats.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 56 }}>💬</Text>
          <Text style={styles.emptyText}>No messages yet</Text>
          <Text style={styles.emptySubText}>Start chatting with sellers!</Text>
        </View>
      ) : (
        <FlatList data={chats} renderItem={renderChat} keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 16, gap: 10 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { color: COLORS.white, fontSize: 22, fontWeight: '800' },
  chatItem: { flexDirection: 'row', gap: 12, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 14 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.primaryLight + '40', alignItems: 'center', justifyContent: 'center' },
  chatRow: { flexDirection: 'row', justifyContent: 'space-between' },
  chatName: { fontSize: 15, fontWeight: '700', color: COLORS.black },
  chatTime: { fontSize: 11, color: COLORS.gray },
  chatMsg: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  productTitle: { fontSize: 11, color: COLORS.gray, marginTop: 3 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, fontWeight: '700', color: COLORS.black, marginTop: 12 },
  emptySubText: { color: COLORS.gray, marginTop: 4 },
});