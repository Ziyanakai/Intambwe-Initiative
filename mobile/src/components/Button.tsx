import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native'
import { colors } from '../theme/colors'

interface Props {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  style?: ViewStyle
}

export function Button({ label, onPress, variant = 'primary', loading, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[styles.base, styles[variant], style]}
      activeOpacity={0.85}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? colors.white : colors.green600} />
        : <Text style={[styles.label, variant !== 'primary' && styles.labelDark]}>{label}</Text>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: colors.green600,
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.green600,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.2,
  },
  labelDark: {
    color: colors.green700,
  },
})
