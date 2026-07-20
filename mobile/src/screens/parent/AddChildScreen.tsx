import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator, Alert, Platform,
} from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { colors } from '../../theme/colors'
import api from '../../api/client'

type Props = { navigation: NativeStackNavigationProp<any> }

const GENDER_OPTIONS = [
  { label: 'Boy', value: 'M', icon: '👦' },
  { label: 'Girl', value: 'F', icon: '👧' },
]

export default function AddChildScreen({ navigation }: Props) {
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState<'M' | 'F' | ''>('')
  const [saving, setSaving] = useState(false)

  function formatDob(text: string) {
    const digits = text.replace(/\D/g, '')
    if (digits.length <= 4) return digits
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
  }

  async function handleSave() {
    if (!name.trim()) { Alert.alert('Required', 'Please enter your child\'s name.'); return }
    if (!dob || dob.length < 10) { Alert.alert('Required', 'Please enter a valid date of birth (YYYY-MM-DD).'); return }
    if (!gender) { Alert.alert('Required', 'Please select your child\'s gender.'); return }

    setSaving(true)
    try {
      await api.post('/children', { name: name.trim(), dateOfBirth: dob })
      Alert.alert(
        '🎉 Child Added!',
        `${name} has been added to your profile.`,
        [{ text: 'Continue', onPress: () => navigation.goBack() }],
      )
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Failed to add child. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const ageMonths = dob.length === 10 ? calcAgeMonths(dob) : null

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>👶</Text>
          <Text style={styles.title}>Add Your Child</Text>
          <Text style={styles.sub}>We'll use this to select the right developmental screening for their age.</Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.label}>Child's Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Amani Kagabo"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#94a3b8"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={dob}
            onChangeText={t => setDob(formatDob(t))}
            keyboardType="number-pad"
            maxLength={10}
            placeholderTextColor="#94a3b8"
          />
          {ageMonths !== null && ageMonths >= 0 && ageMonths <= 72 && (
            <View style={styles.agePill}>
              <Text style={styles.agePillText}>
                {ageMonths < 12
                  ? `${ageMonths} month${ageMonths !== 1 ? 's' : ''} old`
                  : `${Math.floor(ageMonths / 12)} yr${Math.floor(ageMonths / 12) !== 1 ? 's' : ''} ${ageMonths % 12} mo`}
              </Text>
            </View>
          )}
          {ageMonths !== null && ageMonths > 72 && (
            <Text style={styles.ageWarning}>STED screening covers children aged 0–6 years.</Text>
          )}

          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map(g => (
              <TouchableOpacity
                key={g.value}
                style={[styles.genderBtn, gender === g.value && styles.genderBtnActive]}
                onPress={() => setGender(g.value as 'M' | 'F')}
              >
                <Text style={styles.genderIcon}>{g.icon}</Text>
                <Text style={[styles.genderLabel, gender === g.value && styles.genderLabelActive]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Your child's information is private and only shared with the specialist you connect with.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveBtnText}>Add Child</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function calcAgeMonths(dob: string): number {
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return -1
  const now = new Date()
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  container: { padding: 20, paddingBottom: 40 },

  backBtn: { marginBottom: 16 },
  backText: { color: colors.green600, fontSize: 14, fontWeight: '600' },

  hero: { alignItems: 'center', marginBottom: 24 },
  heroIcon: { fontSize: 52, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink, letterSpacing: -0.5, marginBottom: 6 },
  sub: { fontSize: 13, color: colors.ink2, textAlign: 'center', lineHeight: 19 },

  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 18, marginBottom: 14,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 2 } }),
  },
  label: { fontSize: 13, fontWeight: '600', color: colors.ink2, marginBottom: 6, marginTop: 4 },
  input: {
    borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 11, fontSize: 15,
    color: colors.ink, backgroundColor: '#f8fafc', marginBottom: 6,
  },

  agePill: {
    alignSelf: 'flex-start', backgroundColor: colors.green100,
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 14,
  },
  agePillText: { fontSize: 12, color: colors.green700, fontWeight: '600' },
  ageWarning: { fontSize: 12, color: colors.riskMod, marginBottom: 14 },

  genderRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  genderBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    alignItems: 'center', backgroundColor: '#f8fafc',
  },
  genderBtnActive: { borderColor: colors.green600, backgroundColor: colors.green50 },
  genderIcon: { fontSize: 26, marginBottom: 4 },
  genderLabel: { fontSize: 14, color: colors.ink2, fontWeight: '600' },
  genderLabelActive: { color: colors.green700 },

  infoBox: { backgroundColor: '#eff6ff', borderRadius: 10, padding: 12, marginBottom: 20 },
  infoText: { fontSize: 12, color: '#1d4ed8', lineHeight: 18 },

  saveBtn: {
    backgroundColor: colors.green600, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
