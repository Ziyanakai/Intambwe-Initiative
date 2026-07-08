import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'

const CASELOAD = [
  { id: 'c1', name: 'Uwase Teta',    initials: 'UT', age: '3 yrs',       adherence: 92, trend: 'up'   },
  { id: 'c2', name: 'Ganza Kalisa',  initials: 'GK', age: '4 yrs',       adherence: 64, trend: 'flat' },
  { id: 'c3', name: 'Ineza Mahoro',  initials: 'IM', age: '2 yrs 9 mo',  adherence: 78, trend: 'up'   },
]

const trendIcon = { up: '↑', flat: '→', down: '↓' }
const trendColor = { up: colors.green600, flat: colors.gold500, down: colors.riskHigh }

export function CasesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Active Cases</Text>
        <Text style={styles.sub}>Children with development plans</Text>

        {CASELOAD.map((c) => (
          <Card key={c.id} pad={16} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.initials}>{c.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.age}>{c.age}</Text>
                <View style={styles.barRow}>
                  <View style={styles.barTrack}>
                    <View style={[
                      styles.barFill,
                      { width: `${c.adherence}%` as any, backgroundColor: c.adherence > 80 ? colors.green600 : c.adherence > 60 ? colors.gold500 : colors.riskHigh }
                    ]} />
                  </View>
                  <Text style={styles.adherence}>{c.adherence}%</Text>
                </View>
                <Text style={styles.adherenceLabel}>Activity adherence</Text>
              </View>
              <Text style={[styles.trend, { color: trendColor[c.trend as keyof typeof trendColor] }]}>
                {trendIcon[c.trend as keyof typeof trendIcon]}
              </Text>
            </View>
          </Card>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  avatar: { width: 46, height: 46, borderRadius: 999, backgroundColor: colors.commTint, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 15, fontWeight: '800', color: colors.comm },
  name: { fontSize: 15.5, fontWeight: '700', color: colors.ink },
  age: { fontSize: 12.5, color: colors.ink2, marginBottom: 8 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barTrack: { flex: 1, height: 6, borderRadius: 999, backgroundColor: colors.paper2, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 999 },
  adherence: { fontSize: 13, fontWeight: '700', color: colors.ink, width: 36 },
  adherenceLabel: { fontSize: 11.5, color: colors.ink3, marginTop: 4 },
  trend: { fontSize: 22, fontWeight: '700' },
})
