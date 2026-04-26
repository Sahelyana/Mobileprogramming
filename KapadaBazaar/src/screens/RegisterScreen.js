// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES } from '../config/theme';

const DISTRICTS = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal', 'Dharan', 'Biratnagar', 'Birgunj', 'Janakpur'];

export default function RegisterScreen({ navigation }) {
  const { signUpWithEmail } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [location, setLocation] = useState('');
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPass)
      return Alert.alert('Error', 'Please fill all required fields');
    if (password !== confirmPass)
      return Alert.alert('Error', 'Passwords do not match');
    if (password.length < 6)
      return Alert.alert('Error', 'Password must be at least 6 characters');

    setLoading(true);
    try {
      await signUpWithEmail(email.trim(), password, name, phone);
      navigation.replace('App');
    } catch (e) {
      Alert.alert('Registration Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Nepal's clothing marketplace</Text>

        {[
          { label: 'Full Name *', value: name, set: setName, placeholder: 'Ram Bahadur Thapa' },
          { label: 'Email Address *', value: email, set: setEmail, placeholder: 'ram@example.com', keyboard: 'email-address', auto: 'none' },
          { label: 'Phone Number', value: phone, set: setPhone, placeholder: '+977 98XXXXXXXX', keyboard: 'phone-pad' },
        ].map((field) => (
          <View key={field.label}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              value={field.value}
              onChangeText={field.set}
              keyboardType={field.keyboard || 'default'}
              autoCapitalize={field.auto || 'words'}
              placeholderTextColor={COLORS.gray}
            />
          </View>
        ))}

        <Text style={styles.label}>City / District</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDistrictPicker(!showDistrictPicker)}>
          <Text style={{ color: location ? COLORS.text : COLORS.gray, fontSize: 15 }}>
            {location || 'Select your district...'}
          </Text>
        </TouchableOpacity>
        {showDistrictPicker && (
          <View style={styles.districtList}>
            {DISTRICTS.map((d) => (
              <TouchableOpacity key={d} style={styles.districtItem} onPress={() => { setLocation(d); setShowDistrictPicker(false); }}>
                <Text style={[styles.districtText, location === d && { color: COLORS.primary, fontWeight: '700' }]}>📍 {d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Password *</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Min 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            placeholderTextColor={COLORS.gray}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
            <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter password"
          value={confirmPass}
          onChangeText={setConfirmPass}
          secureTextEntry={!showPass}
          placeholderTextColor={COLORS.gray}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.primaryBtnText}>Create Account 🎉</Text>}
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.bottomLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: { marginBottom: 20 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '500' },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.black },
  subtitle: { fontSize: 14, color: COLORS.gray, marginTop: 4, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.grayBorder, borderRadius: SIZES.radiusSm,
    paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, color: COLORS.text,
    backgroundColor: COLORS.grayLight, justifyContent: 'center',
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 14, borderWidth: 1.5, borderColor: COLORS.grayBorder, borderRadius: SIZES.radiusSm, backgroundColor: COLORS.grayLight },
  districtList: {
    borderWidth: 1, borderColor: COLORS.grayBorder, borderRadius: SIZES.radiusSm,
    marginTop: 4, backgroundColor: COLORS.white, maxHeight: 200, overflow: 'hidden',
  },
  districtItem: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: COLORS.grayBorder },
  districtText: { fontSize: 14, color: COLORS.text },
  primaryBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    paddingVertical: 16, alignItems: 'center', marginTop: 24,
  },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  bottomText: { color: COLORS.gray, fontSize: 14 },
  bottomLink: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
});