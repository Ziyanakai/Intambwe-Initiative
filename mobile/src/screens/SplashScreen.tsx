import React, { useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from '../theme/colors'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <TouchableOpacity style={styles.container} onPress={onDone} activeOpacity={1}>
      <View style={styles.logoBox}>
        <Text style={styles.footprint}>👣</Text>
      </View>
      <Text style={styles.name}>INTAMBWE</Text>
      <Text style={styles.tagline}>Guiding Every Child Forward</Text>
      <Text style={styles.tap}>Tap to continue</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  footprint: { fontSize: 44 },
  name: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.white,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  tap: {
    position: 'absolute',
    bottom: 54,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },
})
