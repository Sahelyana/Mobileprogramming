// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID_FROM_FIREBASE', // Replace this
});

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const doc = await firestore().collection('users').doc(uid).get();
      if (doc.exists) setUserProfile(doc.data());
    } catch (e) {
      console.log('fetchUserProfile error:', e);
    }
  };

  // Email & Password Sign Up
  const signUpWithEmail = async (email, password, name, phone) => {
    const cred = await auth().createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });
    await firestore().collection('users').doc(cred.user.uid).set({
      uid: cred.user.uid,
      name,
      email,
      phone: phone || '',
      avatar: '',
      location: '',
      totalSales: 0,
      totalPurchases: 0,
      rating: 0,
      reviewCount: 0,
      verified: false,
      premium: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return cred.user;
  };

  // Email Sign In
  const signInWithEmail = async (email, password) => {
    return auth().signInWithEmailAndPassword(email, password);
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const cred = await auth().signInWithCredential(googleCredential);
    // Create user doc if new
    const doc = await firestore().collection('users').doc(cred.user.uid).get();
    if (!doc.exists) {
      await firestore().collection('users').doc(cred.user.uid).set({
        uid: cred.user.uid,
        name: cred.user.displayName || '',
        email: cred.user.email || '',
        phone: cred.user.phoneNumber || '',
        avatar: cred.user.photoURL || '',
        location: '',
        totalSales: 0,
        totalPurchases: 0,
        rating: 0,
        reviewCount: 0,
        verified: false,
        premium: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
    return cred.user;
  };

  // Phone Sign In - Step 1: Send OTP
  const sendPhoneOTP = async (phoneNumber) => {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
    return confirmation;
  };

  // Phone Sign In - Step 2: Verify OTP
  const verifyPhoneOTP = async (code, name) => {
    const cred = await confirm.confirm(code);
    // Create user doc if new
    const doc = await firestore().collection('users').doc(cred.user.uid).get();
    if (!doc.exists) {
      await firestore().collection('users').doc(cred.user.uid).set({
        uid: cred.user.uid,
        name: name || 'User',
        email: '',
        phone: cred.user.phoneNumber || '',
        avatar: '',
        location: '',
        totalSales: 0,
        totalPurchases: 0,
        rating: 0,
        reviewCount: 0,
        verified: false,
        premium: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
    return cred.user;
  };

  const signOut = async () => {
    await auth().signOut();
    try { await GoogleSignin.signOut(); } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{
      user, userProfile, loading,
      signUpWithEmail, signInWithEmail,
      signInWithGoogle, sendPhoneOTP, verifyPhoneOTP,
      signOut, fetchUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);