import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'
import { useAuthStore } from '../../store/useAuthStore'
import api from '../../api/client'

const QUICK_ACTIONS = [
  { icon: '🎯', label: 'Activities', color: colors.comm,   tint: colors.commTint,   tab: 'Activities' },
  { icon: '📈', label: 'Progress',   color: colors.social, tint: colors.socialTint, tab: 'Progress'   },
  { icon: '📋', label: 'Plan',       color: colors.cog,    tint: colors.cogTint,    tab: 'Plan'        },
]

interface Child {
  id: string
  name: string
  dateOfBirth: string
}

function ageLabel(dob: string): string {
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return ''
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (months < 12) return `${months} mo`
  return `${Math.floor(months / 12)} yr${Math.floor(months / 12) !== 1 ? 's' : ''} ${months % 12} mo`
}

function childInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export function HomeScreen({ navigation }: any) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const firstName = user?.email?.split('@')[0] ?? 'Parent'

  const [child, setChild] = useState<Child | null>(null)
  const [diagnosis, setDiagnosis] = useState<{ severity: string; doctor: { email: string } } | null>(null)
  const [loadingChild, setLoadingChild] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const childRes = await api.get('/children')
      const children: Child[] = childRes.data
      if (!children?.length) return
      const c = children[0]
      setChild(c)
      const diagRes = await api.get(`/doctor/diagnosis/${c.id}`)
      if (diagRes.data?.length) setDiagnosis(diagRes.data[0])
    } catch {
      // non-blocking — show empty states gracefully
    } finally {
      setLoadingChild(false)
    }
  }

  function confirmLogout() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ])
  }

  const doctorLabel = diagnosis?.doctor?.email
    ? `with ${diagnosis.doctor.email}`
    : 'Awaiting specialist'

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
            <TouchableOpacity style={styles.bellBtn} onPress={confirmLogout}>
              <Text style={{ fontSize: 20 }}>🚪</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Child card */}
        <View style={styles.headerCard}>
          <Card pad={15} style={styles.childCard}>
            {loadingChild ? (
              <ActivityIndicator color={colors.green600} style={{ paddingVertical: 8 }} />
            ) : child ? (
              <View style={styles.childRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{childInitials(child.name)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childAge}>{ageLabel(child.dateOfBirth)} · {doctorLabel}</Text>
                </View>
                {diagnosis && (
                  <View style={styles.stageChip}>
                    <Text style={styles.stageChipText}>{diagnosis.severity}</Text>
                  </View>
                )}
              </View>
            ) : (
              <View>
                <Text style={styles.noChildText}>No child registered yet</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.addChildBtn}
              onPress={() => navigation.navigate('AddChild')}
            >
              <Text style={styles.addChildBtnText}>+ Add a child</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.body}>
          {/* Journey — shown only when child + diagnosis exist */}
          {child && diagnosis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{child.name}'s journey</Text>
              <Card pad={16}>
                <Text style={styles.stageName}>
                  {diagnosis.severity === 'Mild' ? 'Building Foundations' : diagnosis.severity === 'Moderate' ? 'Making Connections' : 'Intensive Support'}
                </Text>
                <Text style={styles.stageNote}>Every small step counts.</Text>
                <View style={styles.stagePath}>
                  {['Start', 'Foundations', 'Connecting', 'Flourishing'].map((s, i) => (
                    <View key={s} style={styles.stageStep}>
                      <View style={[styles.stageDot, i === 0 && styles.stageDotActive]}>
                        {i === 0 && <Text style={{ fontSize: 10, color: colors.white }}>✓</Text>}
                      </View>
                      <Text style={[styles.stageLabel, i === 0 && { color: colors.green600 }]}>{s}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          )}

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

          {/* Specialist notes — shown when diagnosis exists */}
          {diagnosis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>From your specialist</Text>
              <Card pad={16} style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                  <View style={[styles.avatar, { width: 32, height: 32, borderRadius: 999 }]}>
                    <Text style={[styles.avatarText, { fontSize: 11 }]}>
                      {diagnosis.doctor?.email?.slice(0, 2).toUpperCase() ?? 'DR'}
                    </Text>
                  </View>
                  <Text style={styles.feedbackDoc}>{diagnosis.doctor?.email ?? 'Your specialist'}</Text>
                </View>
                <Text style={styles.feedbackText}>
                  Severity: <Text style={{ fontWeight: '700' }}>{diagnosis.severity}</Text>. View the full care plan in the Plan tab.
                </Text>
              </Card>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  header: {
    backgroundColor: colors.green700,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 80,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  greeting: { fontSize: 13.5, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  name: { fontSize: 23, fontWeight: '800', color: colors.white, letterSpacing: -0.4 },
  headerRight: { flexDirection: 'row', gap: 10 },
  bellBtn: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center',
  },
  headerCard: { paddingHorizontal: 18, marginTop: -52 },
  childCard: { shadowColor: colors.ink, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 6 },
  childRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  avatar: { width: 50, height: 50, borderRadius: 999, backgroundColor: colors.clay100, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '800', color: colors.clay600 },
  childName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3, color: colors.ink },
  childAge: { fontSize: 12.5, color: colors.ink2, marginTop: 1 },
  noChildText: { fontSize: 14, color: colors.ink3, textAlign: 'center', paddingVertical: 6 },
  stageChip: { backgroundColor: colors.green100, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  stageChipText: { fontSize: 12, fontWeight: '700', color: colors.green700 },
  addChildBtn: {
    marginTop: 12, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: colors.green600, alignItems: 'center', borderStyle: 'dashed',
  },
  addChildBtnText: { fontSize: 13.5, fontWeight: '700', color: colors.green600 },
  body: { padding: 18, paddingTop: 22, gap: 26 },
  section: { gap: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.ink, letterSpacing: -0.2 },
  stageName: { fontSize: 13.5, fontWeight: '700', color: colors.green700, marginBottom: 2 },
  stageNote: { fontSize: 12.5, color: colors.ink2, marginBottom: 12 },
  stagePath: { flexDirection: 'row', justifyContent: 'space-between' },
  stageStep: { alignItems: 'center', gap: 4, flex: 1 },
  stageDot: { width: 26, height: 26, borderRadius: 999, backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center' },
  stageDotActive: { backgroundColor: colors.green600 },
  stageLabel: { fontSize: 10, fontWeight: '600', color: colors.ink3, textAlign: 'center' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around' },
  quickAction: { alignItems: 'center', gap: 8, flex: 1 },
  quickIcon: { width: 54, height: 54, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 11.5, fontWeight: '600', color: colors.ink2, textAlign: 'center' },
  feedbackCard: { borderLeftWidth: 3, borderLeftColor: colors.green500 },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 },
  feedbackDoc: { fontSize: 13, fontWeight: '700', color: colors.ink, flex: 1 },
  feedbackText: { fontSize: 14, lineHeight: 21, color: colors.ink2 },
})
