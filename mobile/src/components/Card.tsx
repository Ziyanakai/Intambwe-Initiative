import React from 'react'
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native'
import { colors } from '../theme/colors'

interface Props {
  children: React.ReactNode
  style?: ViewStyle
  onPress?: () => void
  pad?: number
}

export function Card({ children, style, onPress, pad = 16 }: Props) {
  const inner = (
    <View style={[styles.card, { padding: pad }, style]}>
      {children}
    </View>
  )
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {inner}
      </TouchableOpacity>
    )
  }
  return inner
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
})
