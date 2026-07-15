import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'
import api from '../../api/client'

const DOMAIN_META: Record<string, { icon: string; color: string; tint: string }> = {
  communication: { icon: '💬', color: colors.comm,   tint: colors.commTint },
  social:        { icon: '🤝', color: colors.social, tint: colors.socialTint },
  motor:         { icon: '🤲', color: colors.motor,  tint: colors.motorTint },
  cognitive:     { icon: '🧠', color: colors.cog,    tint: colors.cogTint },
  emotional:     { icon: '😊', color: colors.emot,   tint: colors.emotTint },
}

const SEVERITY_COLOR: Record<string, string> = {
  Mild: colors.riskLow,
  Moderate: colors.riskMod,
  Severe: colors.riskHigh,
}

interface Diagnosis {
  id: string
  severity: string
  notes: string
  carePlan: { goals: Record<string, string> }
  createdAt: string
  doctor: { email: string }
}

export function PlanScreen() {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDiagnosis()
  }, [])

  async function fetchDiagnosis() {
    try {
      // fetch child first, then diagnosis
      const childRes = await api.get('/children')
      const children = childRes.data
      if (!children || children.length === 0) {
        setError('no-child')
        return
      }
      const childId = children[0].id
      const diagRes = await api.get(`/doctor/diagnosis/${childId}`)
      const diagnoses: Diagnosis[] = diagRes.data
      if (diagnoses.length === 0) {
        setError('no-diagnosis')
        return
      }
      setDiagnosis(diagnoses[0])
    } catch {
      setError('failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.green600} size="large" />
          <Text style={styles.loadingText}>Loading your care plan…</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error === 'no-child') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>👶</Text>
          <Text style={styles.emptyTitle}>No child registered</Text>
          <Text style={styles.emptySub}>Add your child's profile to get started.</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error === 'no-diagnosis' || !diagnosis) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.heading}>Development Plan</Text>
          <Text style={styles.sub}>Created by your specialist</Text>
          <View style={styles.pendingCard}>
            <Text style={styles.pendingIcon}>⏳</Text>
            <Text style={styles.pendingTitle}>Awaiting your specialist's assessment</Text>
            <Text style={styles.pendingSub}>
              After your child's STED screening is reviewed by a specialist, their care plan will appear here.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  const goals = Object.entries(diagnosis.carePlan?.goals ?? {})
  const doctorInitials = diagnosis.doctor?.email?.slice(0, 2).toUpperCase() ?? 'DR'
  const date = new Date(diagnosis.createdAt).toLocaleDateString('en-RW', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Development Plan</Text>
        <Text style={styles.sub}>Created by your specialist</Text>

        {/* Specialist card */}
        <Card pad={14} style={styles.specialistCard}>
          <View style={styles.specialistRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{doctorInitials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.specName}>{diagnosis.doctor?.email ?? 'Your Specialist'}</Text>
              <Text style={styles.specClinic}>Plan created {date}</Text>
            </View>
            <View style={[styles.severityChip, { backgroundColor: (SEVERITY_COLOR[diagnosis.severity] ?? colors.riskMod) + '20' }]}>
              <Text style={[styles.severityText, { color: SEVERITY_COLOR[diagnosis.severity] ?? colors.riskMod }]}>
                {diagnosis.severity}
              </Text>
            </View>
          </View>
        </Card>

        {/* Clinical notes */}
        <Card pad={14}>
          <Text style={styles.notesLabel}>Specialist Notes</Text>
          <Text style={styles.notesText}>{diagnosis.notes}</Text>
        </Card>

        {/* Goals */}
        {goals.map(([domain, goal]) => {
          const meta = DOMAIN_META[domain] ?? { icon: '🎯', color: colors.green600, tint: colors.green100 }
          return (
            <Card key={domain} pad={16} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={[styles.domainBadge, { backgroundColor: meta.tint }]}>
                  <Text style={{ fontSize: 16 }}>{meta.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.domainShort, { color: meta.color }]}>{domain.toUpperCase()}</Text>
                  <Text style={styles.goalTitle}>{goal}</Text>
                </View>
              </View>
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>
                  <Text style={{ fontWeight: '700', color: colors.ink }}>Goal: </Text>
                  Work on this daily with your child's activities.
                </Text>
              </View>
            </Card>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 18, paddingBottom: 32, gap: 14 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { marginTop: 12, color: colors.ink2, fontSize: 14 },

  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 13.5, color: colors.ink2 },

  pendingCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 28,
    alignItems: 'center', marginTop: 8,
  },
  pendingIcon: { fontSize: 40, marginBottom: 12 },
  pendingTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, textAlign: 'center', marginBottom: 8 },
  pendingSub: { fontSize: 13, color: colors.ink2, textAlign: 'center', lineHeight: 20 },

  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: 6 },
  emptySub: { fontSize: 13, color: colors.ink2, textAlign: 'center' },

  specialistCard: { backgroundColor: colors.commTint, shadowOpacity: 0 },
  specialistRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 999, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontWeight: '800', color: colors.comm },
  specName: { fontSize: 14, fontWeight: '700', color: colors.ink },
  specClinic: { fontSize: 12, color: colors.ink2 },
  severityChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  severityText: { fontSize: 12, fontWeight: '700' },

  notesLabel: { fontSize: 13, fontWeight: '700', color: colors.ink, marginBottom: 6 },
  notesText: { fontSize: 13, color: colors.ink2, lineHeight: 20 },

  goalCard: {},
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  domainBadge: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  domainShort: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  goalTitle: { fontSize: 15.5, fontWeight: '700', letterSpacing: -0.2, lineHeight: 20, color: colors.ink },
  noteBox: { backgroundColor: colors.paper, borderRadius: 12, padding: 12 },
  noteText: { fontSize: 13, lineHeight: 19, color: colors.ink2 },
})
