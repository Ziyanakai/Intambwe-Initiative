import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'
import api from '../../api/client'

const DOMAIN_META: Record<string, { icon: string; label: string; color: string; tint: string }> = {
  communication: { icon: '💬', label: 'Communication',       color: colors.comm,   tint: colors.commTint   },
  social:        { icon: '🤝', label: 'Social Interaction',  color: colors.social, tint: colors.socialTint },
  motor:         { icon: '🤲', label: 'Motor Skills',        color: colors.motor,  tint: colors.motorTint  },
  cognitive:     { icon: '🧠', label: 'Cognitive Skills',    color: colors.cog,    tint: colors.cogTint    },
  emotional:     { icon: '😊', label: 'Emotional Regulation',color: colors.emot,   tint: colors.emotTint   },
}

interface Diagnosis {
  carePlan: { goals: Record<string, string> }
}

export function ProgressScreen() {
  const [childName, setChildName] = useState('your child')
  const [childId, setChildId] = useState<string | null>(null)
  const [goals, setGoals] = useState<Record<string, string>>({})
  const [logs, setLogs] = useState<{ exerciseType: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [emptyReason, setEmptyReason] = useState<'no-child' | 'no-diagnosis' | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const childRes = await api.get('/children')
      const children = childRes.data
      if (!children?.length) { setEmptyReason('no-child'); return }
      const child = children[0]
      setChildName(child.name)
      setChildId(child.id)

      const [diagRes, logRes] = await Promise.all([
        api.get(`/doctor/diagnosis/${child.id}`),
        api.get(`/children/${child.id}/activity-log`),
      ])

      const diagnoses: Diagnosis[] = diagRes.data
      if (!diagnoses?.length) { setEmptyReason('no-diagnosis'); return }
      setGoals(diagnoses[0].carePlan?.goals ?? {})
      setLogs(logRes.data ?? [])
    } catch {
      setEmptyReason('no-diagnosis')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.green600} size="large" />
        </View>
      </SafeAreaView>
    )
  }

  if (emptyReason) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.heading}>Progress</Text>
          <Card pad={28} style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>{emptyReason === 'no-child' ? '👶' : '⏳'}</Text>
            <Text style={styles.emptyTitle}>
              {emptyReason === 'no-child' ? 'No child registered' : 'No care plan yet'}
            </Text>
            <Text style={styles.emptySub}>
              {emptyReason === 'no-child'
                ? 'Add your child from the Home screen to track progress.'
                : 'Progress will appear here once your specialist creates a care plan.'}
            </Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }

  const domainKeys = Object.keys(goals)
  const logCountByDomain: Record<string, number> = {}
  logs.forEach(l => {
    logCountByDomain[l.exerciseType] = (logCountByDomain[l.exerciseType] ?? 0) + 1
  })

  const totalActivities = domainKeys.length
  const completedDomains = domainKeys.filter(d => (logCountByDomain[d] ?? 0) > 0).length
  const overallPct = totalActivities > 0 ? Math.round((completedDomains / totalActivities) * 100) : 0

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Progress</Text>
        <Text style={styles.sub}>{childName}</Text>

        {/* Overall ring */}
        <Card pad={20} style={styles.overallCard}>
          <View style={styles.overallRow}>
            <View style={styles.overallRing}>
              <Text style={styles.overallPct}>{overallPct}%</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.overallTitle}>
                {overallPct === 0 ? 'Getting started' : overallPct < 50 ? 'Building momentum' : overallPct < 100 ? 'Steady progress' : 'All goals active! 🎉'}
              </Text>
              <Text style={styles.overallSub}>
                {completedDomains} of {totalActivities} domains with completed activities.
              </Text>
              <Text style={styles.overallSub}>{logs.length} total sessions logged.</Text>
            </View>
          </View>
        </Card>

        {/* By domain */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By domain</Text>
          {domainKeys.map(domain => {
            const meta = DOMAIN_META[domain] ?? { icon: '🎯', label: domain, color: colors.green600, tint: colors.green100 }
            const count = logCountByDomain[domain] ?? 0
            const pct = Math.min(count * 10, 100)
            return (
              <Card key={domain} pad={14} style={{ marginBottom: 10 }}>
                <View style={styles.domainRow}>
                  <View style={[styles.domainBadge, { backgroundColor: meta.tint }]}>
                    <Text style={{ fontSize: 18 }}>{meta.icon}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={styles.domainLabelRow}>
                      <Text style={styles.domainLabel}>{meta.label}</Text>
                      <Text style={[styles.domainPct, { color: meta.color }]}>{count} session{count !== 1 ? 's' : ''}</Text>
                    </View>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: meta.color }]} />
                    </View>
                    <Text style={styles.domainGoal} numberOfLines={2}>{goals[domain]}</Text>
                  </View>
                </View>
              </Card>
            )
          })}
        </View>

        {/* Goal trail */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care plan goals</Text>
          <Card pad={18}>
            {domainKeys.map((domain, i) => {
              const meta = DOMAIN_META[domain] ?? { icon: '🎯', color: colors.green600 }
              const done = (logCountByDomain[domain] ?? 0) > 0
              return (
                <View key={domain} style={[styles.milestone, i < domainKeys.length - 1 && styles.milestoneNotLast]}>
                  <View style={[styles.milestoneDot, done && styles.milestoneDotDone]}>
                    {done
                      ? <Text style={{ fontSize: 10, color: colors.white }}>✓</Text>
                      : <Text style={{ fontSize: 13 }}>{meta.icon}</Text>
                    }
                  </View>
                  <Text style={[styles.milestoneLabel, done && styles.milestoneLabelDone]}>
                    {goals[domain]}
                  </Text>
                </View>
              )
            })}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 18, paddingBottom: 32 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 13.5, color: colors.ink2, marginBottom: 16 },
  emptyCard: { alignItems: 'center', marginTop: 8 },
  emptyIcon: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 6 },
  emptySub: { fontSize: 13, color: colors.ink2, textAlign: 'center', lineHeight: 20 },
  overallCard: { marginBottom: 24 },
  overallRow: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  overallRing: {
    width: 84, height: 84, borderRadius: 999,
    borderWidth: 9, borderColor: colors.green600,
    alignItems: 'center', justifyContent: 'center',
  },
  overallPct: { fontSize: 22, fontWeight: '800', color: colors.ink },
  overallTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3, color: colors.ink },
  overallSub: { fontSize: 13, color: colors.ink2, marginTop: 3, lineHeight: 19 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 10 },
  domainRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  domainBadge: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  domainLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  domainLabel: { fontSize: 14.5, fontWeight: '700', letterSpacing: -0.2, color: colors.ink },
  domainPct: { fontSize: 12.5, fontWeight: '700' },
  barTrack: { height: 6, borderRadius: 999, backgroundColor: colors.paper2, overflow: 'hidden', marginBottom: 6 },
  barFill: { height: 6, borderRadius: 999 },
  domainGoal: { fontSize: 12, color: colors.ink3, lineHeight: 17 },
  milestone: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 16, marginBottom: 4 },
  milestoneNotLast: { borderBottomWidth: 1, borderBottomColor: colors.paper2 },
  milestoneDot: {
    width: 28, height: 28, borderRadius: 999,
    backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  milestoneDotDone: { backgroundColor: colors.green600 },
  milestoneLabel: { fontSize: 14, color: colors.ink2, flex: 1, lineHeight: 20 },
  milestoneLabelDone: { color: colors.ink3, textDecorationLine: 'line-through' },
})
