// src/screens/OTPScreen.js
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES } from '../config/theme';

export default function OTPScreen({ route, navigation }) {
  const { phone } = route.params;
  const { verifyPhoneOTP } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

  const handleChange = (val, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
    if (!val && idx > 0) refs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) return Alert.alert('Error', 'Enter the 6-digit OTP');
    setLoading(true);
    try {
      await verifyPhoneOTP(code, name);
      navigation.replace('App');
    } catch (e) {
      Alert.alert('Invalid OTP', 'Please check the code and try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.icon}>🔐</Text>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        We sent a 6-digit code to{'\n'}
        <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{phone}</Text>
      </Text>

      <View style={styles.otpRow}>
        {otp.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={(r) => (refs.current[idx] = r)}
            style={[styles.otpBox, digit && styles.otpBoxFilled]}
            value={digit}
            onChangeText={(v) => handleChange(v.replace(/[^0-9]/g, ''), idx)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <Text style={styles.label}>Your Name (first time only)</Text>
      <TextInput
        style={styles.nameInput}
        placeholder="Ram Bahadur Thapa"
        value={name}
        onChangeText={setName}
        placeholderTextColor={COLORS.gray}
      />

      <TouchableOpacity style={styles.btn} onPress={handleVerify} disabled={loading}>
        {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.btnText}>Verify & Continue ✓</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendBtn}>
        <Text style={styles.resendText}>Didn't receive? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Resend OTP</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 32 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '500' },
  icon: { fontSize: 60, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.black, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginTop: 8, lineHeight: 22, marginBottom: 32 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 28 },
  otpBox: {
    width: 46, height: 56, borderWidth: 1.5, borderColor: COLORS.grayBorder,
    borderRadius: SIZES.radiusSm, fontSize: 22, fontWeight: '700', color: COLORS.text,
    backgroundColor: COLORS.grayLight, textAlign: 'center',
  },
  otpBoxFilled: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight + '20' },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  nameInput: {
    borderWidth: 1.5, borderColor: COLORS.grayBorder, borderRadius: SIZES.radiusSm,
    paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, color: COLORS.text,
    backgroundColor: COLORS.grayLight,
  },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    paddingVertical: 16, alignItems: 'center', marginTop: 24,
  },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  resendBtn: { alignItems: 'center', marginTop: 20 },
  resendText: { color: COLORS.gray, fontSize: 14 },
});