import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'

const REFERRALS = [
  { id: 'r1', name: 'Keza Ishimwe',   initials: 'KI', age: '3 yrs 2 mo', risk: 'high', score: '5 / 7 flags', when: 'Today, 09:14', parent: 'Aline Mukamana', isNew: true },
  { id: 'r2', name: 'Manzi Hirwa',    initials: 'MH', age: '2 yrs 8 mo', risk: 'mod',  score: '3 / 7 flags', when: 'Today, 08:02', parent: 'Eric Hirwa',     isNew: true },
  { id: 'r3', name: 'Iza Gatete',     initials: 'IG', age: '4 yrs 1 mo', risk: 'mod',  score: '3 / 7 flags', when: 'Yesterday',    parent: 'Diane Gatete' },
  { id: 'r4', name: 'Shema Rugwiro',  initials: 'SR', age: '2 yrs 5 mo', risk: 'low',  score: '1 / 7 flags', when: '2 days ago',   parent: 'Claude Rugwiro' },
]

const riskColor = { high: colors.riskHigh, mod: colors.riskMod, low: colors.riskLow }
const riskLabel = { high: 'High Risk', mod: 'Moderate', low: 'Low Risk' }
const riskTint  = { high: '#FEF0EE', mod: '#FEF9EC', low: colors.green50 }

export function ReferralsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Referrals</Text>
        <Text style={styles.sub}>Children awaiting your review</Text>

        {REFERRALS.map((r) => (
          <TouchableOpacity
            key={r.id}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Diagnosis', {
              childId: r.id,
              childName: r.name,
            })}
          >
            <Card pad={15} style={styles.card}>
              <View style={styles.row}>
                <View style={[styles.avatar, { backgroundColor: riskTint[r.risk as keyof typeof riskTint] }]}>
                  <Text style={[styles.initials, { color: riskColor[r.risk as keyof typeof riskColor] }]}>{r.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{r.name}</Text>
                    {r.isNew && <View style={styles.newBadge}><Text style={styles.newBadgeText}>New</Text></View>}
                  </View>
                  <Text style={styles.age}>{r.age} · {r.parent}</Text>
                  <Text style={styles.score}>{r.score}</Text>
                </View>
                <View style={styles.rightCol}>
                  <View style={[styles.riskChip, { backgroundColor: riskTint[r.risk as keyof typeof riskTint] }]}>
                    <Text style={[styles.riskText, { color: riskColor[r.risk as keyof typeof riskColor] }]}>{riskLabel[r.risk as keyof typeof riskLabel]}</Text>
                  </View>
                  <Text style={styles.when}>{r.when}</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 18, paddingBottom: 32, gap: 10 },
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 13.5, color: colors.ink2, marginBottom: 8 },
  card: {},
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 15, fontWeight: '800' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  name: { fontSize: 15.5, fontWeight: '700', color: colors.ink },
  newBadge: { backgroundColor: colors.green100, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999 },
  newBadgeText: { fontSize: 11, fontWeight: '700', color: colors.green700 },
  age: { fontSize: 12.5, color: colors.ink2, marginTop: 2 },
  score: { fontSize: 12, color: colors.ink3, marginTop: 2 },
  rightCol: { alignItems: 'flex-end', gap: 6 },
  riskChip: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  riskText: { fontSize: 12, fontWeight: '700' },
  when: { fontSize: 11.5, color: colors.ink3 },
})
