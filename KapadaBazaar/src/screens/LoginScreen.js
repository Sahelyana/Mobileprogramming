// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, StatusBar, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES } from '../config/theme';

export default function LoginScreen({ navigation }) {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      navigation.replace('App');
    } catch (e) {
      Alert.alert('Login Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigation.replace('App');
    } catch (e) {
      Alert.alert('Google Sign-In Failed', e.message);
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

        <View style={styles.header}>
          <Text style={styles.logoEmoji}>👘</Text>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to your Purano Kapada account</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={COLORS.gray}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              placeholderTextColor={COLORS.gray}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
              <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.primaryBtnText}>Sign In</Text>}
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle} disabled={loading}>
            <Text style={{ fontSize: 20 }}>🔵</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.phoneBtn} onPress={() => navigation.navigate('PhoneAuth')}>
            <Text style={{ fontSize: 20 }}>📱</Text>
            <Text style={styles.phoneText}>Continue with Phone</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.bottomLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 16 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '500' },
  header: { alignItems: 'center', marginBottom: 32 },
  logoEmoji: { fontSize: 50, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.black },
  subtitle: { fontSize: 14, color: COLORS.gray, marginTop: 6 },
  form: { gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.grayBorder,
    borderRadius: SIZES.radiusSm, paddingHorizontal: 14,
    paddingVertical: 14, fontSize: 15, color: COLORS.text,
    backgroundColor: COLORS.grayLight,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 14, borderWidth: 1.5, borderColor: COLORS.grayBorder, borderRadius: SIZES.radiusSm, backgroundColor: COLORS.grayLight },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 8 },
  forgotText: { color: COLORS.primary, fontSize: 13, fontWeight: '500' },
  primaryBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    paddingVertical: 16, alignItems: 'center', marginTop: 20,
  },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 12 },
  orLine: { flex: 1, height: 1, backgroundColor: COLORS.grayBorder },
  orText: { color: COLORS.gray, fontSize: 13, fontWeight: '500' },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.grayBorder,
    borderRadius: SIZES.radius, paddingVertical: 14, gap: 10,
  },
  googleText: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  phoneBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.primary,
    borderRadius: SIZES.radius, paddingVertical: 14, gap: 10, marginTop: 10,
  },
  phoneText: { fontSize: 15, fontWeight: '600', color: COLORS.primary },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 28, paddingBottom: 20 },
  bottomText: { color: COLORS.gray, fontSize: 14 },
  bottomLink: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
});