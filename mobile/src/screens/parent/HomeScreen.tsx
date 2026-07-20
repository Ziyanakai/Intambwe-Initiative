import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'
import { useAuthStore } from '../../store/useAuthStore'

const QUICK_ACTIONS = [
  { icon: '🛡️', label: 'Screening', color: colors.emot, tint: colors.emotTint, tab: 'Activities' },
  { icon: '🎯', label: 'Activities', color: colors.comm, tint: colors.commTint, tab: 'Activities' },
  { icon: '📈', label: 'Progress',   color: colors.social, tint: colors.socialTint, tab: 'Progress' },
  { icon: '📋', label: 'Plan',       color: colors.cog, tint: colors.cogTint, tab: 'Plan' },
]

export function HomeScreen({ navigation }: any) {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.email?.split('@')[0] ?? 'Parent'

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Green hero header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.bellBtn}>
              <Text style={{ fontSize: 20 }}>🔔</Text>
            </View>
          </View>
        </View>

        {/* Child card inside header */}
        <View style={styles.headerCard}>
          <Card pad={15} style={styles.childCard}>
            <View style={styles.childRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>KI</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.childName}>Keza Ishimwe</Text>
                <Text style={styles.childAge}>3 yrs 2 mo · with Dr. Jean Habimana</Text>
              </View>
              <View style={styles.stageChip}>
                <Text style={styles.stageChipText}>Stage 2/4</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.addChildBtn}
              onPress={() => navigation.navigate('AddChild')}
            >
              <Text style={styles.addChildBtnText}>+ Add a child</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.body}>
          {/* Journey */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Keza's journey</Text>
            <Card pad={16}>
              <Text style={styles.stageName}>Building Foundations</Text>
              <Text style={styles.stageNote}>Every small step counts.</Text>
              <View style={styles.stagePath}>
                {['Start', 'Foundations', 'Connecting', 'Flourishing'].map((s, i) => (
                  <View key={s} style={styles.stageStep}>
                    <View style={[styles.stageDot, i <= 1 && styles.stageDotActive]}>
                      {i <= 1 && <Text style={{ fontSize: 10, color: colors.white }}>✓</Text>}
                    </View>
                    <Text style={[styles.stageLabel, i <= 1 && { color: colors.green600 }]}>{s}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>

          {/* Quick actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick actions</Text>
            <Card pad={16}>
              <View style={styles.quickActions}>
                {QUICK_ACTIONS.map((a) => (
                  <TouchableOpacity key={a.label} style={styles.quickAction} onPress={() => navigation.navigate(a.tab)}>
                    <View style={[styles.quickIcon, { backgroundColor: a.tint }]}>
                      <Text style={{ fontSize: 22 }}>{a.icon}</Text>
                    </View>
                    <Text style={styles.quickLabel}>{a.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </View>

          {/* Specialist feedback */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>From your specialist</Text>
            <Card pad={16} style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <View style={[styles.avatar, { width: 32, height: 32, borderRadius: 999 }]}>
                  <Text style={[styles.avatarText, { fontSize: 11 }]}>JH</Text>
                </View>
                <Text style={styles.feedbackDoc}>Dr. Jean Habimana</Text>
                <Text style={styles.feedbackWhen}>2 days ago</Text>
              </View>
              <Text style={styles.feedbackText}>"Keza responded to her name 3 of 5 times this week — a lovely step up from last week."</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  header: {
    backgroundColor: colors.green700,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: { fontSize: 13.5, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  name: { fontSize: 23, fontWeight: '800', color: colors.white, letterSpacing: -0.4 },
  headerRight: { flexDirection: 'row', gap: 10 },
  bellBtn: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCard: { paddingHorizontal: 18, marginTop: -52 },
  childCard: { shadowColor: colors.ink, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 6 },
  childRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  avatar: {
    width: 50, height: 50, borderRadius: 999,
    backgroundColor: colors.clay100, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: colors.clay600 },
  childName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3, color: colors.ink },
  childAge: { fontSize: 12.5, color: colors.ink2, marginTop: 1 },
  stageChip: { backgroundColor: colors.green100, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  stageChipText: { fontSize: 12, fontWeight: '700', color: colors.green700 },
  body: { padding: 18, paddingTop: 22, gap: 26 },
  section: { gap: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.ink, letterSpacing: -0.2 },
  stageName: { fontSize: 13.5, fontWeight: '700', color: colors.green700, marginBottom: 2 },
  stageNote: { fontSize: 12.5, color: colors.ink2, marginBottom: 12 },
  stagePath: { flexDirection: 'row', justifyContent: 'space-between' },
  stageStep: { alignItems: 'center', gap: 4, flex: 1 },
  stageDot: {
    width: 26, height: 26, borderRadius: 999,
    backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center',
  },
  stageDotActive: { backgroundColor: colors.green600 },
  stageLabel: { fontSize: 10, fontWeight: '600', color: colors.ink3, textAlign: 'center' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', gap: 8, flex: 1 },
  quickIcon: { width: 54, height: 54, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 11.5, fontWeight: '600', color: colors.ink2, textAlign: 'center' },
  feedbackCard: { borderLeftWidth: 3, borderLeftColor: colors.green500 },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 },
  feedbackDoc: { fontSize: 13, fontWeight: '700', color: colors.ink, flex: 1 },
  feedbackWhen: { fontSize: 11.5, color: colors.ink3 },
  feedbackText: { fontSize: 14.5, lineHeight: 22, color: colors.ink },
  addChildBtn: {
    marginTop: 12, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: colors.green600,
    alignItems: 'center', borderStyle: 'dashed',
  },
  addChildBtnText: { fontSize: 13.5, fontWeight: '700', color: colors.green600 },
})
