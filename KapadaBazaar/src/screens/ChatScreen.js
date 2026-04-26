// src/screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES } from '../config/theme';

const QUICK_REPLIES = ['Is it available?', 'Can you lower price?', 'Where to meet?', 'I\'ll take it!'];

export default function ChatScreen({ route, navigation }) {
  const { chatId, sellerName, product } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatRef = useRef(null);

  useEffect(() => {
    const unsub = firestore()
      .collection('chats').doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snap => {
        setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
      });
    return unsub;
  }, [chatId]);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    setInput('');
    const msg = { text: text.trim(), senderId: user.uid, createdAt: firestore.FieldValue.serverTimestamp() };
    await firestore().collection('chats').doc(chatId).collection('messages').add(msg);
    await firestore().collection('chats').doc(chatId).update({ lastMessage: text.trim(), updatedAt: firestore.FieldValue.serverTimestamp() });
  };

  const renderMsg = ({ item }) => {
    const isMe = item.senderId === user?.uid;
    return (
      <View style={[styles.msgWrap, isMe && styles.msgWrapMe]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 22, color: COLORS.white }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerName}>{sellerName}</Text>
            <Text style={styles.headerProduct} numberOfLines={1}>📦 {product?.title} · Rs.{product?.price}</Text>
          </View>
        </View>

        <FlatList
          ref={flatRef}
          data={messages}
          renderItem={renderMsg}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 8 }}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Quick replies */}
        <View style={styles.quickRow}>
          {QUICK_REPLIES.map(q => (
            <TouchableOpacity key={q} style={styles.quickBtn} onPress={() => sendMessage(q)}>
              <Text style={styles.quickText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            multiline
            placeholderTextColor={COLORS.gray}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()}>
            <Text style={{ color: COLORS.white, fontSize: 18 }}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary, paddingTop: 50,
    paddingHorizontal: 16, paddingBottom: 14,
  },
  headerName: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  headerProduct: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 1 },
  msgWrap: { alignItems: 'flex-start' },
  msgWrapMe: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 18, borderBottomLeftRadius: 4,
    backgroundColor: COLORS.white,
  },
  bubbleMe: { backgroundColor: COLORS.primary, borderBottomLeftRadius: 18, borderBottomRightRadius: 4 },
  bubbleThem: {},
  bubbleText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  bubbleTextMe: { color: COLORS.white },
  quickRow: { paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 6, backgroundColor: COLORS.white, borderTopWidth: 0.5, borderTopColor: COLORS.grayBorder },
  quickBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: COLORS.grayLight, borderRadius: 14, borderWidth: 1, borderColor: COLORS.grayBorder },
  quickText: { fontSize: 12, color: COLORS.text },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, gap: 8, backgroundColor: COLORS.white, borderTopWidth: 0.5, borderTopColor: COLORS.grayBorder },
  input: { flex: 1, backgroundColor: COLORS.grayLight, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: COLORS.text, maxHeight: 100 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
});