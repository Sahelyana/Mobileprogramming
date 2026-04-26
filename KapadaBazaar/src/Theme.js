// src/config/theme.js
export const COLORS = {
  primary: '#C62828',
  primaryDark: '#8B1A1A',
  primaryLight: '#EF9A9A',
  secondary: '#FF8F00',
  accent: '#FFC107',
  background: '#F5F5F5',
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray: '#9E9E9E',
  grayLight: '#F0F0F0',
  grayBorder: '#E0E0E0',
  success: '#2E7D32',
  error: '#C62828',
  warning: '#F57F17',
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#BDBDBD',
  overlay: 'rgba(0,0,0,0.5)',
  cardBg: '#FFFFFF',
};

export const FONTS = {
  regular: { fontFamily: 'System', fontWeight: '400' },
  medium: { fontFamily: 'System', fontWeight: '500' },
  semiBold: { fontFamily: 'System', fontWeight: '600' },
  bold: { fontFamily: 'System', fontWeight: '700' },
  extraBold: { fontFamily: 'System', fontWeight: '800' },
};

export const SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  giant: 40,
  padding: 16,
  radius: 12,
  radiusSm: 8,
  radiusLg: 20,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};