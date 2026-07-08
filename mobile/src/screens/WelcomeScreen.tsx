import React from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button } from '../components/Button'
import { colors } from '../theme/colors'

type Props = { navigation: NativeStackNavigationProp<any> }

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>👣 INTAMBWE</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.illustration}>
          <Text style={styles.illustrationIcon}>👶</Text>
          <Text style={styles.illustrationSub}>Parent & child, every step together</Text>
        </View>
        <Text style={styles.heading}>Every child deserves the right support at the right time.</Text>
      </View>

      <View style={styles.actions}>
        <Button label="Get Started" onPress={() => navigation.navigate('RoleSelect')} />
        <Button label="Sign In" variant="ghost" onPress={() => navigation.navigate('Login')} style={{ marginTop: 4 }} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    padding: 20,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordmark: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.green700,
    letterSpacing: 1,
  },
  hero: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  illustration: {
    height: 240,
    borderRadius: 28,
    backgroundColor: colors.green50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  illustrationIcon: { fontSize: 72, marginBottom: 12 },
  illustrationSub: {
    fontSize: 13,
    color: colors.green700,
    fontWeight: '500',
    opacity: 0.7,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.8,
    color: colors.ink,
  },
  actions: {
    padding: 24,
    paddingBottom: 36,
    gap: 4,
  },
})
