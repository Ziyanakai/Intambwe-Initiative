import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button } from '../../components/Button'
import { colors } from '../../theme/colors'
import { useAuthStore } from '../../store/useAuthStore'
import api from '../../api/client'

type Props = { navigation: NativeStackNavigationProp<any>; route: any }

export function RegisterScreen({ navigation, route }: Props) {
  const role = route.params?.role ?? 'PARENT'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)

  const register = async () => {
    if (!email || !password) { Alert.alert('Please fill in all fields'); return }
    if (password.length < 6) { Alert.alert('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { email, password, role })
      setAuth(data.token, data.user)
    } catch (e: any) {
      Alert.alert('Registration failed', e?.response?.data?.error ?? 'Please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.sub}>Joining as {role === 'PARENT' ? 'Parent / Caregiver' : 'Doctor / Specialist'}</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.ink4}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Min 6 characters"
                placeholderTextColor={colors.ink4}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <Button label="Create Account" onPress={register} loading={loading} style={{ marginTop: 8 }} />

          <TouchableOpacity onPress={() => navigation.navigate('Login', { role })} style={styles.login}>
            <Text style={styles.loginText}>Already have an account? <Text style={{ color: colors.green600, fontWeight: '700' }}>Sign In</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 24, paddingTop: 16, flexGrow: 1 },
  backBtn: {
    width: 40, height: 40, borderRadius: 999, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center', marginBottom: 28,
    shadowColor: colors.ink, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  backText: { fontSize: 28, color: colors.ink, lineHeight: 34 },
  heading: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8, color: colors.ink },
  sub: { fontSize: 14.5, color: colors.ink2, marginTop: 4, marginBottom: 32 },
  form: { gap: 18, marginBottom: 24 },
  field: { gap: 6 },
  label: { fontSize: 13.5, fontWeight: '600', color: colors.ink2 },
  input: {
    backgroundColor: colors.card, borderRadius: 14,
    paddingHorizontal: 16, height: 50,
    fontSize: 15.5, color: colors.ink,
    shadowColor: colors.ink, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  login: { alignItems: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: colors.ink2 },
})
