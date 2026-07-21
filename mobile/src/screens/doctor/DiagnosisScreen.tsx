import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Alert, Platform, ActivityIndicator,
} from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp } from '@react-navigation/native'
import { colors } from '../../theme/colors'
import api from '../../api/client'

type Props = {
  navigation: NativeStackNavigationProp<any>
  route: RouteProp<any>
}

const SEVERITY_OPTIONS = ['Mild', 'Moderate', 'Severe'] as const
const DOMAIN_GOALS = [
  { key: 'communication', label: 'Communication', icon: '💬', color: colors.comm },
  { key: 'social',        label: 'Social',         icon: '🤝', color: colors.social },
  { key: 'motor',         label: 'Motor',           icon: '🤲', color: colors.motor },
  { key: 'cognitive',     label: 'Cognitive',       icon: '🧠', color: colors.cog },
  { key: 'emotional',     label: 'Emotional',       icon: '😊', color: colors.emot },
]

export default function DiagnosisScreen({ navigation, route }: Props) {
  const { childId, childName, stedPart, noCount } = (route.params ?? {}) as {
    childId?: string
    childName: string
    stedPart?: string
    noCount?: number
  }

  const [severity, setSeverity] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [goals, setGoals] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  function setGoal(domain: string, text: string) {
    setGoals(prev => ({ ...prev, [domain]: text }))
  }

  async function handleSubmit() {
    if (!childId) { Alert.alert('Error', 'No child selected. Please go back and select a child.'); return }
    if (!severity) { Alert.alert('Required', 'Please select a severity level.'); return }
    if (!notes.trim()) { Alert.alert('Required', 'Please add your clinical notes.'); return }
    const filledGoals = Object.entries(goals).filter(([, v]) => v.trim())
    if (filledGoals.length === 0) { Alert.alert('Required', 'Add at least one care plan goal.'); return }

    setSaving(true)
    try {
      await api.post('/doctor/diagnosis', {
        childId,
        severity,
        notes,
        carePlan: { goals: Object.fromEntries(filledGoals) },
      })
      Alert.alert(
        'Diagnosis Saved',
        `Care plan for ${childName} has been saved. The parent will see it in their Plan screen.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      )
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Write Diagnosis</Text>
        <Text style={styles.sub}>{childName}</Text>

        {/* STED summary banner */}
        {stedPart && (
          <View style={styles.stedBanner}>
            <Text style={styles.stedBannerTitle}>STED Part {stedPart} — Referral</Text>
            <Text style={styles.stedBannerSub}>
              {noCount} concern{(noCount ?? 0) > 1 ? 's' : ''} flagged · Child requires formal assessment
            </Text>
          </View>
        )}

        {/* Severity */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Severity Level</Text>
          <View style={styles.severityRow}>
            {SEVERITY_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.severityBtn, severity === opt && styles.severityBtnActive(opt)]}
                onPress={() => setSeverity(opt)}
              >
                <Text style={[styles.severityText, severity === opt && styles.severityTextActive]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Clinical notes */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Clinical Notes</Text>
          <Text style={styles.sectionHint}>Observations, developmental history, key findings</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={5}
            placeholder="Describe your clinical observations..."
            value={notes}
            onChangeText={setNotes}
            placeholderTextColor="#94a3b8"
            textAlignVertical="top"
          />
        </View>

        {/* Care plan goals */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Care Plan Goals</Text>
          <Text style={styles.sectionHint}>Fill in goals for the domains you want to target</Text>
          {DOMAIN_GOALS.map(d => (
            <View key={d.key} style={styles.goalRow}>
              <View style={[styles.domainIcon, { backgroundColor: d.color + '20' }]}>
                <Text style={{ fontSize: 16 }}>{d.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.domainLabel, { color: d.color }]}>{d.label}</Text>
                <TextInput
                  style={styles.goalInput}
                  placeholder={`e.g. Use 5 words to request needs`}
                  value={goals[d.key] ?? ''}
                  onChangeText={t => setGoal(d.key, t)}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, saving && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitText}>Save Diagnosis & Care Plan</Text>
          }
        </TouchableOpacity>

        <Text style={styles.footnote}>
          Once saved, the parent will see this plan in their app immediately.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

function severityColor(opt: string) {
  if (opt === 'Mild') return colors.riskLow
  if (opt === 'Moderate') return colors.riskMod
  return colors.riskHigh
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  container: { padding: 20, paddingBottom: 40 },

  backBtn: { marginBottom: 12 },
  backText: { color: colors.comm, fontSize: 14, fontWeight: '600' },

  title: { fontSize: 22, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: colors.ink2, marginBottom: 16 },

  stedBanner: {
    backgroundColor: '#fef2f2', borderRadius: 10, padding: 12,
    marginBottom: 16, borderLeftWidth: 3, borderLeftColor: colors.riskHigh,
  },
  stedBannerTitle: { fontSize: 13, fontWeight: '700', color: colors.riskHigh },
  stedBannerSub: { fontSize: 12, color: '#64748b', marginTop: 2 },

  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 14,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 2 } }),
  },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  sectionHint: { fontSize: 12, color: colors.ink3, marginBottom: 12 },

  severityRow: { flexDirection: 'row', gap: 10 },
  severityBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    borderWidth: 1.5, borderColor: '#e2e8f0', alignItems: 'center', backgroundColor: '#f8fafc',
  },
  severityBtnActive: (opt: string) => ({
    borderColor: severityColor(opt),
    backgroundColor: severityColor(opt) + '15',
  }),
  severityText: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  severityTextActive: { color: colors.ink, fontWeight: '700' },

  notesInput: {
    borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8,
    padding: 12, fontSize: 14, color: colors.ink,
    backgroundColor: '#f8fafc', minHeight: 110,
  },

  goalRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  domainIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  domainLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 },
  goalInput: {
    borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8, fontSize: 13,
    color: colors.ink, backgroundColor: '#f8fafc',
  },

  submitBtn: {
    backgroundColor: colors.green600, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footnote: { fontSize: 11, color: '#94a3b8', textAlign: 'center' },
})
