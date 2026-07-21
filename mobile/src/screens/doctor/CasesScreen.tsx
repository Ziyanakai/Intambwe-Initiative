import React, { useEffect, useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'
import api from '../../api/client'

interface Case {
  id: string
  severity: string
  createdAt: string
  child: {
    id: string
    name: string
    dateOfBirth: string
    parent: { email: string }
  }
  doctor: { email: string }
}

const SEVERITY_COLOR: Record<string, string> = {
  Mild: colors.riskLow,
  Moderate: colors.riskMod,
  Severe: colors.riskHigh,
}

function ageLabel(dob: string): string {
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return ''
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (months < 12) return `${months} mo`
  return `${Math.floor(months / 12)} yr${Math.floor(months / 12) !== 1 ? 's' : ''} ${months % 12} mo`
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export function CasesScreen() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const res = await api.get('/doctor/cases')
      setCases(res.data)
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.comm} size="large" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.comm} />}
      >
        <Text style={styles.heading}>Active Cases</Text>
        <Text style={styles.sub}>{cases.length} child{cases.length !== 1 ? 'ren' : ''} with care plans</Text>

        {cases.length === 0 ? (
          <Card pad={28} style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No cases yet</Text>
            <Text style={styles.emptySub}>Diagnose a referral to start a care plan and it will appear here.</Text>
          </Card>
        ) : (
          cases.map((c) => {
            const sevColor = SEVERITY_COLOR[c.severity] ?? colors.ink2
            return (
              <Card key={c.id} pad={16} style={styles.card}>
                <View style={styles.row}>
                  <View style={[styles.avatar, { backgroundColor: sevColor + '20' }]}>
                    <Text style={[styles.initials, { color: sevColor }]}>{initials(c.child.name)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{c.child.name}</Text>
                    <Text style={styles.age}>{ageLabel(c.child.dateOfBirth)} · {c.child.parent.email}</Text>
                    <Text style={styles.doctor}>Dr. {c.doctor.email}</Text>
                  </View>
                  <View style={[styles.sevChip, { backgroundColor: sevColor + '20' }]}>
                    <Text style={[styles.sevText, { color: sevColor }]}>{c.severity}</Text>
                  </View>
                </View>
              </Card>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 18, paddingBottom: 32, gap: 10 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 13.5, color: colors.ink2, marginBottom: 8 },
  emptyCard: { alignItems: 'center', marginTop: 16 },
  emptyIcon: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 6 },
  emptySub: { fontSize: 13, color: colors.ink2, textAlign: 'center', lineHeight: 20 },
  card: {},
  row: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  avatar: { width: 46, height: 46, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 15, fontWeight: '800' },
  name: { fontSize: 15.5, fontWeight: '700', color: colors.ink },
  age: { fontSize: 12.5, color: colors.ink2, marginTop: 2 },
  doctor: { fontSize: 11.5, color: colors.ink3, marginTop: 2 },
  sevChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  sevText: { fontSize: 12, fontWeight: '700' },
})
