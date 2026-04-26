// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES } from '../config/theme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PhoneAuthScreen from '../screens/PhoneAuthScreen';
import OTPScreen from '../screens/OTPScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SellScreen from '../screens/SellScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MyListingsScreen from '../screens/MyListingsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import FilterScreen from '../screens/FilterScreen';
import SellerProfileScreen from '../screens/SellerProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  const icons = {
    Home: focused ? '🏠' : '🏡',
    Search: focused ? '🔍' : '🔎',
    Sell: '➕',
    Chats: focused ? '💬' : '🗨️',
    Profile: focused ? '👤' : '👥',
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{icons[name]}</Text>
      <Text style={{
        fontSize: 10,
        color: focused ? COLORS.primary : COLORS.gray,
        fontWeight: focused ? '600' : '400',
        marginTop: 2,
      }}>{name}</Text>
    </View>
  );
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        height: 65,
        backgroundColor: COLORS.white,
        borderTopWidth: 0.5,
        borderTopColor: COLORS.grayBorder,
        paddingBottom: 8,
      },
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} /> }} />
    <Tab.Screen name="Search" component={SearchScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="Search" focused={focused} /> }} />
    <Tab.Screen name="Sell" component={SellScreen}
      options={{
        tabBarIcon: () => (
          <View style={{
            width: 52, height: 52, borderRadius: 26,
            backgroundColor: COLORS.primary, alignItems: 'center',
            justifyContent: 'center', marginBottom: 20,
            shadowColor: COLORS.primary, shadowOpacity: 0.4,
            shadowRadius: 8, elevation: 8,
          }}>
            <Text style={{ fontSize: 26, color: 'white' }}>＋</Text>
          </View>
        ),
      }} />
    <Tab.Screen name="Chats" component={ChatListScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="Chats" focused={focused} /> }} />
    <Tab.Screen name="Profile" component={ProfileScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} /> }} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
    <Stack.Screen name="OTP" component={OTPScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="MyListings" component={MyListingsScreen} />
    <Stack.Screen name="Orders" component={OrdersScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Filter" component={FilterScreen} />
    <Stack.Screen name="SellerProfile" component={SellerProfileScreen} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        {user ? (
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}