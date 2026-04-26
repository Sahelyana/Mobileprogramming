// src/screens/PhoneAuthScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES } from '../config/theme';

export default function PhoneAuthScreen({ navigation }) {
  const { sendPhoneOTP } = useAuth();
  const [phone, setPhone] = useState('+977 ');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length < 10) return Alert.alert('Error', 'Enter a valid phone number');
    setLoading(true);
    try {
      await sendPhoneOTP(cleaned);
      navigation.navigate('OTP', { phone: cleaned });
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.icon}>📱</Text>
        <Text style={styles.title}>Phone Verification</Text>
        <Text style={styles.subtitle}>We'll send a 6-digit OTP to your Nepali mobile number</Text>

        <View style={styles.inputWrap}>
          <View style={styles.flagBox}>
            <Text style={{ fontSize: 22 }}>🇳🇵</Text>
          </View>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+977 98XXXXXXXX"
            placeholderTextColor={COLORS.gray}
            maxLength={15}
          />
        </View>

        <Text style={styles.hint}>Supports NTC, Ncell, and Smart Cell numbers</Text>

        <TouchableOpacity style={styles.btn} onPress={handleSendOTP} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.btnText}>Send OTP →</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const pStyles = StyleSheet.create({});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 40 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '500' },
  icon: { fontSize: 60, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.black, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginTop: 8, lineHeight: 20, marginBottom: 32 },
  inputWrap: {
    flexDirection: 'row', borderWidth: 1.5, borderColor: COLORS.grayBorder,
    borderRadius: SIZES.radiusSm, overflow: 'hidden', backgroundColor: COLORS.grayLight,
  },
  flagBox: {
    paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.grayLight, borderRightWidth: 1, borderRightColor: COLORS.grayBorder,
  },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 14, fontSize: 16, color: COLORS.text },
  hint: { color: COLORS.gray, fontSize: 12, marginTop: 8, textAlign: 'center' },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    paddingVertical: 16, alignItems: 'center', marginTop: 28,
  },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});