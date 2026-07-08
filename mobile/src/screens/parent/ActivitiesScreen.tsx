import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'

const ACTIVITIES = [
  { id: 'a1', title: 'Name & Point',     domain: 'comm',   domainLabel: 'Communication',  color: colors.comm,   tint: colors.commTint,   goal: 'Build first words by naming everyday objects', duration: '10 min', done: false },
  { id: 'a2', title: 'Mirror Faces',     domain: 'emot',   domainLabel: 'Emotion',         color: colors.emot,   tint: colors.emotTint,   goal: 'Recognise and copy simple emotions',           duration: '8 min',  done: false },
  { id: 'a3', title: 'Stacking Cups',    domain: 'motor',  domainLabel: 'Motor Skills',    color: colors.motor,  tint: colors.motorTint,  goal: 'Strengthen grasp and hand control',            duration: '12 min', done: true  },
  { id: 'a4', title: 'Turn-Taking Game', domain: 'social', domainLabel: 'Social',          color: colors.social, tint: colors.socialTint, goal: 'Practise waiting and sharing with a partner',  duration: '10 min', done: false },
]

export function ActivitiesScreen() {
  const [acts, setActs] = useState(ACTIVITIES)
  const todo = acts.filter(a => !a.done)
  const done = acts.filter(a => a.done)

  const toggle = (id: string) => setActs(acts.map(a => a.id === id ? { ...a, done: !a.done } : a))

  const ActivityRow = ({ act }: { act: typeof ACTIVITIES[0] }) => (
    <Card pad={14} style={styles.actRow}>
      <View style={styles.actRowInner}>
        <View style={[styles.domainBadge, { backgroundColor: act.tint }]}>
          <Text style={{ fontSize: 20 }}>
            {act.domain === 'comm' ? '💬' : act.domain === 'emot' ? '😊' : act.domain === 'motor' ? '🤲' : '🤝'}
          </Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.actTitle, act.done && styles.actDone]}>{act.title}</Text>
          <View style={styles.actMeta}>
            <Text style={[styles.actDomain, { color: act.color }]}>{act.domainLabel}</Text>
            <View style={styles.dot} />
            <Text style={styles.actDuration}>{act.duration}</Text>
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Activities</Text>
        <Text style={styles.sub}>Assigned by your specialist</Text>

        {/* Progress ring summary */}
        <Card pad={16} style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.ring}>
              <Text style={styles.ringText}>{done.length}/{acts.length}</Text>
            </View>
            <View>
              <Text style={styles.summaryTitle}>{done.length === acts.length ? 'All done today! 🎉' : 'Keep going'}</Text>
              <Text style={styles.summarySub}>{todo.length} activit{todo.length === 1 ? 'y' : 'ies'} left for Keza today</Text>
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
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 13.5, color: colors.ink2, marginBottom: 12 },
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
  actMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
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
