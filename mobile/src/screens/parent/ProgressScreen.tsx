import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'

const DOMAINS = [
  { id: 'comm',   label: 'Communication',      color: colors.comm,   tint: colors.commTint,   icon: '💬', pct: 45, done: 2, total: 5 },
  { id: 'social', label: 'Social Interaction',  color: colors.social, tint: colors.socialTint, icon: '🤝', pct: 30, done: 1, total: 4 },
  { id: 'emot',   label: 'Emotional Regulation',color: colors.emot,   tint: colors.emotTint,   icon: '😊', pct: 55, done: 3, total: 5 },
  { id: 'daily',  label: 'Daily Living',         color: colors.daily,  tint: colors.dailyTint,  icon: '🌱', pct: 70, done: 4, total: 6 },
  { id: 'cog',    label: 'Cognitive Skills',     color: colors.cog,    tint: colors.cogTint,    icon: '🧠', pct: 50, done: 2, total: 5 },
  { id: 'motor',  label: 'Motor Skills',         color: colors.motor,  tint: colors.motorTint,  icon: '🤲', pct: 80, done: 5, total: 6 },
]

const MILESTONES = [
  { label: 'Responds to own name',        domain: 'comm',   done: true  },
  { label: 'Makes eye contact in play',   domain: 'social', done: true  },
  { label: 'Points to ask for things',    domain: 'comm',   done: false, current: true },
  { label: 'Copies two-word phrases',     domain: 'comm',   done: false },
  { label: 'Plays beside another child',  domain: 'social', done: false },
]

const overall = Math.round(DOMAINS.reduce((s, d) => s + d.pct, 0) / DOMAINS.length)

export function ProgressScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Progress</Text>
        <Text style={styles.sub}>Keza Ishimwe · 3 yrs 2 mo</Text>

        {/* Overall ring */}
        <Card pad={20} style={styles.overallCard}>
          <View style={styles.overallRow}>
            <View style={styles.overallRing}>
              <Text style={styles.overallPct}>{overall}%</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.overallTitle}>Steady progress</Text>
              <Text style={styles.overallSub}>Across all 6 developmental domains this month.</Text>
            </View>
          </View>
        </Card>

        {/* By domain */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By domain</Text>
          {DOMAINS.map((d, i) => (
            <Card key={d.id} pad={14} style={{ marginBottom: 10 }}>
              <View style={styles.domainRow}>
                <View style={[styles.domainBadge, { backgroundColor: d.tint }]}>
                  <Text style={{ fontSize: 18 }}>{d.icon}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={styles.domainLabelRow}>
                    <Text style={styles.domainLabel}>{d.label}</Text>
                    <Text style={[styles.domainPct, { color: d.color }]}>{d.pct}%</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${d.pct}%` as any, backgroundColor: d.color }]} />
                  </View>
                  <Text style={styles.domainGoals}>{d.done} of {d.total} goals achieved</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Milestone trail */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestone trail</Text>
          <Card pad={18}>
            {MILESTONES.map((m, i) => (
              <View key={i} style={[styles.milestone, i < MILESTONES.length - 1 && styles.milestoneNotLast]}>
                <View style={[
                  styles.milestoneDot,
                  m.done && styles.milestoneDotDone,
                  m.current && styles.milestoneDotCurrent,
                ]}>
                  {m.done && <Text style={{ fontSize: 10, color: colors.white }}>✓</Text>}
                  {m.current && <Text style={{ fontSize: 10, color: colors.green600 }}>●</Text>}
                </View>
                <Text style={[
                  styles.milestoneLabel,
                  m.done && { color: colors.ink3, textDecorationLine: 'line-through' },
                  m.current && { color: colors.green700, fontWeight: '700' },
                ]}>{m.label}</Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 18, paddingBottom: 32 },
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 13.5, color: colors.ink2, marginBottom: 16 },
  overallCard: { marginBottom: 24 },
  overallRow: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  overallRing: {
    width: 84, height: 84, borderRadius: 999,
    borderWidth: 9, borderColor: colors.green600,
    alignItems: 'center', justifyContent: 'center',
  },
  overallPct: { fontSize: 22, fontWeight: '800', color: colors.ink },
  overallTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3, color: colors.ink },
  overallSub: { fontSize: 13.5, color: colors.ink2, marginTop: 3, lineHeight: 19 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 10 },
  domainRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  domainBadge: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  domainLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  domainLabel: { fontSize: 14.5, fontWeight: '700', letterSpacing: -0.2, color: colors.ink },
  domainPct: { fontSize: 12.5, fontWeight: '700' },
  barTrack: { height: 6, borderRadius: 999, backgroundColor: colors.paper2, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 999 },
  domainGoals: { fontSize: 11.5, color: colors.ink3, marginTop: 5 },
  milestone: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 16, marginBottom: 4 },
  milestoneNotLast: { borderBottomWidth: 1, borderBottomColor: colors.paper2 },
  milestoneDot: {
    width: 24, height: 24, borderRadius: 999,
    backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  milestoneDotDone: { backgroundColor: colors.green600 },
  milestoneDotCurrent: { backgroundColor: colors.green100, borderWidth: 2, borderColor: colors.green600 },
  milestoneLabel: { fontSize: 14, color: colors.ink2, flex: 1 },
})
