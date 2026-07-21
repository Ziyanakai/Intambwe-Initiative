import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'
import api from '../../api/client'

const DOMAIN_META: Record<string, { icon: string; label: string; color: string; tint: string; duration: string; verb: string }> = {
  communication: { icon: '💬', label: 'Communication', color: colors.comm,   tint: colors.commTint,   duration: '10 min', verb: 'Practise talking' },
  social:        { icon: '🤝', label: 'Social',        color: colors.social, tint: colors.socialTint, duration: '10 min', verb: 'Play together' },
  motor:         { icon: '🤲', label: 'Motor Skills',  color: colors.motor,  tint: colors.motorTint,  duration: '12 min', verb: 'Move & grip' },
  cognitive:     { icon: '🧠', label: 'Thinking',      color: colors.cog,    tint: colors.cogTint,    duration: '10 min', verb: 'Explore & discover' },
  emotional:     { icon: '😊', label: 'Emotion',       color: colors.emot,   tint: colors.emotTint,   duration: '8 min',  verb: 'Feel & express' },
}

interface Activity {
  id: string
  title: string
  domainKey: string
  goal: string
  done: boolean
}

function goalsToActivities(goals: Record<string, string>): Activity[] {
  return Object.entries(goals).map(([domain, goal]) => ({
    id: domain,
    title: DOMAIN_META[domain]?.verb ?? domain,
    domainKey: domain,
    goal,
    done: false,
  }))
}

export function ActivitiesScreen() {
  const [acts, setActs] = useState<Activity[]>([])
  const [childName, setChildName] = useState('your child')
  const [childId, setChildId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [emptyReason, setEmptyReason] = useState<'no-child' | 'no-diagnosis' | 'failed' | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setEmptyReason(null)
    try {
      const childRes = await api.get('/children')
      const children = childRes.data
      if (!children?.length) { setEmptyReason('no-child'); return }
      const child = children[0]
      setChildName(child.name ?? 'your child')
      setChildId(child.id)

      const diagRes = await api.get(`/doctor/diagnosis/${child.id}`)
      const diagnoses = diagRes.data
      if (!diagnoses?.length) { setEmptyReason('no-diagnosis'); return }

      const goals: Record<string, string> = diagnoses[0]?.carePlan?.goals ?? {}
      if (!Object.keys(goals).length) { setEmptyReason('no-diagnosis'); return }

      const logRes = await api.get(`/children/${child.id}/activity-log`)
      const logs: { exerciseType: string; completedAt: string }[] = logRes.data ?? []
      const today = new Date().toDateString()
      const doneToday = new Set(
        logs
          .filter(l => new Date(l.completedAt).toDateString() === today)
          .map(l => l.exerciseType)
      )

      setActs(goalsToActivities(goals).map(a => ({ ...a, done: doneToday.has(a.id) })))
    } catch {
      setEmptyReason('failed')
    } finally {
      setLoading(false)
    }
  }

  async function toggle(id: string) {
    const act = acts.find(a => a.id === id)
    if (!act) return
    const nowDone = !act.done
    setActs(prev => prev.map(a => a.id === id ? { ...a, done: nowDone } : a))
    if (nowDone && childId) {
      try {
        await api.post(`/children/${childId}/activity-log`, { exerciseType: id })
      } catch {
        // non-blocking — local state already updated
      }
    }
  }

  const todo = acts.filter(a => !a.done)
  const done = acts.filter(a => a.done)

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.green600} size="large" />
          <Text style={styles.loadingText}>Loading activities…</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (emptyReason) {
    const msg =
      emptyReason === 'no-child'
        ? { icon: '👶', title: 'No child registered', sub: "Add your child's profile from the Home screen to get started." }
        : emptyReason === 'no-diagnosis'
        ? { icon: '⏳', title: 'Awaiting care plan', sub: 'Once your specialist completes the assessment, daily activities will appear here.' }
        : { icon: '⚠️', title: 'Could not load', sub: 'Check your connection and pull down to refresh.' }
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.heading}>Activities</Text>
          <Text style={styles.sub}>Assigned by your specialist</Text>
          <Card pad={28} style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>{msg.icon}</Text>
            <Text style={styles.emptyTitle}>{msg.title}</Text>
            <Text style={styles.emptySub}>{msg.sub}</Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }

  const ActivityRow = ({ act }: { act: Activity }) => {
    const meta = DOMAIN_META[act.domainKey] ?? { icon: '🎯', label: act.domainKey, color: colors.green600, tint: colors.green100, duration: '10 min' }
    return (
      <Card pad={14} style={styles.actRow}>
        <View style={styles.actRowInner}>
          <View style={[styles.domainBadge, { backgroundColor: meta.tint }]}>
            <Text style={{ fontSize: 20 }}>{meta.icon}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[styles.actTitle, act.done && styles.actDone]}>{act.title}</Text>
            <Text style={styles.actGoal} numberOfLines={2}>{act.goal}</Text>
            <View style={styles.actMeta}>
              <Text style={[styles.actDomain, { color: meta.color }]}>{meta.label}</Text>
              <View style={styles.dot} />
              <Text style={styles.actDuration}>{meta.duration}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => toggle(act.id)}
            style={[styles.checkBtn, act.done && styles.checkBtnDone]}
          >
            {act.done
              ? <Text style={{ fontSize: 14, color: colors.white }}>✓</Text>
              : <Text style={{ fontSize: 12, color: colors.green600 }}>▶</Text>
            }
          </TouchableOpacity>
        </View>
      </Card>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Activities</Text>
        <Text style={styles.sub}>Assigned by your specialist</Text>

        <Card pad={16} style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.ring}>
              <Text style={styles.ringText}>{done.length}/{acts.length}</Text>
            </View>
            <View>
              <Text style={styles.summaryTitle}>{done.length === acts.length ? 'All done today! 🎉' : 'Keep going'}</Text>
              <Text style={styles.summarySub}>
                {todo.length} activit{todo.length === 1 ? 'y' : 'ies'} left for {childName} today
              </Text>
            </View>
          </View>
        </Card>

        {todo.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>To do</Text>
            {todo.map(a => <ActivityRow key={a.id} act={a} />)}
          </View>
        )}

        {done.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed</Text>
            {done.map(a => <ActivityRow key={a.id} act={a} />)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 18, paddingBottom: 32, gap: 8 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { marginTop: 12, color: colors.ink2, fontSize: 14 },
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 13.5, color: colors.ink2, marginBottom: 12 },
  emptyCard: { alignItems: 'center' },
  emptyIcon: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, textAlign: 'center', marginBottom: 6 },
  emptySub: { fontSize: 13, color: colors.ink2, textAlign: 'center', lineHeight: 20 },
  summaryCard: { backgroundColor: colors.green100, shadowOpacity: 0, marginBottom: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  ring: {
    width: 56, height: 56, borderRadius: 999,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: colors.green600,
  },
  ringText: { fontSize: 13, fontWeight: '800', color: colors.green700 },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: colors.green800 },
  summarySub: { fontSize: 13, color: colors.ink2, marginTop: 2 },
  section: { gap: 10, marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.ink },
  actRow: { marginBottom: 0 },
  actRowInner: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  domainBadge: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actTitle: { fontSize: 15.5, fontWeight: '700', letterSpacing: -0.2, color: colors.ink },
  actDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  actGoal: { fontSize: 12, color: colors.ink2, lineHeight: 17, marginTop: 2 },
  actMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  actDomain: { fontSize: 12, fontWeight: '600' },
  dot: { width: 3, height: 3, borderRadius: 99, backgroundColor: colors.ink4 },
  actDuration: { fontSize: 12, color: colors.ink3 },
  checkBtn: {
    width: 34, height: 34, borderRadius: 999,
    backgroundColor: colors.card, borderWidth: 2, borderColor: colors.paper2,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  checkBtnDone: { backgroundColor: colors.green600, borderWidth: 0 },
})
