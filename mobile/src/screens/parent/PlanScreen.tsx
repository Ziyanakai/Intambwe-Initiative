import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'

const PLAN_GOALS = [
  { domain: 'comm',   icon: '💬', color: colors.comm,   tint: colors.commTint,   title: 'Use 5 single words to request',  pct: 40, target: '30 Jun', note: 'Focus on high-motivation words: milk, more, up.' },
  { domain: 'social', icon: '🤝', color: colors.social, tint: colors.socialTint, title: 'Take turns in a simple game',     pct: 25, target: '15 Jul', note: 'Start with 1 exchange, build slowly.' },
  { domain: 'emot',   icon: '😊', color: colors.emot,   tint: colors.emotTint,   title: 'Calm with a soothing routine',    pct: 60, target: '30 Jun', note: 'Deep-pressure hug + counting works well.' },
  { domain: 'motor',  icon: '🤲', color: colors.motor,  tint: colors.motorTint,  title: 'Stack 4 blocks independently',    pct: 85, target: 'Achieved soon', note: 'Almost there — celebrate the win!' },
]

export function PlanScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Development Plan</Text>
        <Text style={styles.sub}>Created by your specialist</Text>

        {/* Specialist card */}
        <Card pad={14} style={styles.specialistCard}>
          <View style={styles.specialistRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JH</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.specName}>Dr. Jean Habimana</Text>
              <Text style={styles.specClinic}>Kigali Child Development Centre</Text>
            </View>
            <View style={styles.readOnlyChip}>
              <Text style={styles.readOnlyText}>🔒 Read-only</Text>
            </View>
          </View>
        </Card>

        {/* Plan goals */}
        {PLAN_GOALS.map((g) => (
          <Card key={g.domain} pad={16} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={[styles.domainBadge, { backgroundColor: g.tint }]}>
                <Text style={{ fontSize: 16 }}>{g.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.domainShort, { color: g.color }]}>{g.domain.toUpperCase()}</Text>
                <Text style={styles.goalTitle}>{g.title}</Text>
              </View>
            </View>

            <View style={styles.barRow}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${g.pct}%` as any, backgroundColor: g.color }]} />
              </View>
              <Text style={[styles.pct, { color: g.color }]}>{g.pct}%</Text>
            </View>

            <View style={styles.targetRow}>
              <Text style={styles.targetIcon}>📅</Text>
              <Text style={styles.targetText}>Target: {g.target}</Text>
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}><Text style={{ fontWeight: '700', color: colors.ink }}>Note: </Text>{g.note}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 18, paddingBottom: 32, gap: 14 },
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 13.5, color: colors.ink2 },
  specialistCard: { backgroundColor: colors.commTint, shadowOpacity: 0 },
  specialistRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 999, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontWeight: '800', color: colors.comm },
  specName: { fontSize: 14, fontWeight: '700', color: colors.ink },
  specClinic: { fontSize: 12, color: colors.ink2 },
  readOnlyChip: { backgroundColor: colors.white, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  readOnlyText: { fontSize: 11, fontWeight: '600', color: colors.ink2 },
  goalCard: {},
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  domainBadge: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  domainShort: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  goalTitle: { fontSize: 15.5, fontWeight: '700', letterSpacing: -0.2, lineHeight: 20, color: colors.ink },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 },
  barTrack: { flex: 1, height: 6, borderRadius: 999, backgroundColor: colors.paper2, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 999 },
  pct: { fontSize: 12.5, fontWeight: '700', width: 36, textAlign: 'right' },
  targetRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  targetIcon: { fontSize: 14 },
  targetText: { fontSize: 12.5, color: colors.ink2, fontWeight: '600' },
  noteBox: { backgroundColor: colors.paper, borderRadius: 12, padding: 12 },
  noteText: { fontSize: 13, lineHeight: 19, color: colors.ink2 },
})
