import React, { useEffect, useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Card } from '../../components/Card'
import { colors } from '../../theme/colors'
import { useAuthStore } from '../../store/useAuthStore'
import api from '../../api/client'

interface Referral {
  id: string
  riskLevel: 'MODERATE' | 'HIGH'
  createdAt: string
  child: {
    id: string
    name: string
    dateOfBirth: string
    parent: { email: string }
  }
}

const riskColor = { HIGH: colors.riskHigh, MODERATE: colors.riskMod }
const riskLabel = { HIGH: 'High Risk', MODERATE: 'Moderate' }
const riskTint  = { HIGH: '#FEF0EE', MODERATE: '#FEF9EC' }

function ageLabel(dob: string): string {
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return ''
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (months < 12) return `${months} mo`
  return `${Math.floor(months / 12)} yr${Math.floor(months / 12) !== 1 ? 's' : ''} ${months % 12} mo`
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 36e5)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return 'Yesterday'
  return `${d} days ago`
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export function ReferralsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const logout = useAuthStore((s) => s.logout)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const res = await api.get('/doctor/referrals')
      setReferrals(res.data)
    } catch {
      Alert.alert('Error', 'Could not load referrals.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function confirmLogout() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ])
  }

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
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.heading}>Referrals</Text>
            <Text style={styles.sub}>{referrals.length} child{referrals.length !== 1 ? 'ren' : ''} awaiting review</Text>
          </View>
          <TouchableOpacity onPress={confirmLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>🚪</Text>
          </TouchableOpacity>
        </View>

        {referrals.length === 0 ? (
          <Card pad={28} style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>All clear</Text>
            <Text style={styles.emptySub}>No pending referrals right now. Pull down to refresh.</Text>
          </Card>
        ) : (
          referrals.map((r) => (
            <TouchableOpacity
              key={r.id}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Diagnosis', { childId: r.child.id, childName: r.child.name })}
            >
              <Card pad={15} style={styles.card}>
                <View style={styles.row}>
                  <View style={[styles.avatar, { backgroundColor: riskTint[r.riskLevel] }]}>
                    <Text style={[styles.initials, { color: riskColor[r.riskLevel] }]}>{initials(r.child.name)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>{r.child.name}</Text>
                    </View>
                    <Text style={styles.age}>{ageLabel(r.child.dateOfBirth)} · {r.child.parent.email}</Text>
                  </View>
                  <View style={styles.rightCol}>
                    <View style={[styles.riskChip, { backgroundColor: riskTint[r.riskLevel] }]}>
                      <Text style={[styles.riskText, { color: riskColor[r.riskLevel] }]}>{riskLabel[r.riskLevel]}</Text>
                    </View>
                    <Text style={styles.when}>{timeAgo(r.createdAt)}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 18, paddingBottom: 32, gap: 10 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headingRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 },
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 13.5, color: colors.ink2 },
  logoutBtn: { padding: 6, marginTop: 4 },
  logoutText: { fontSize: 22 },
  emptyCard: { alignItems: 'center', marginTop: 16 },
  emptyIcon: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 6 },
  emptySub: { fontSize: 13, color: colors.ink2, textAlign: 'center', lineHeight: 20 },
  card: {},
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 15, fontWeight: '800' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  name: { fontSize: 15.5, fontWeight: '700', color: colors.ink },
  age: { fontSize: 12.5, color: colors.ink2, marginTop: 2 },
  rightCol: { alignItems: 'flex-end', gap: 6 },
  riskChip: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  riskText: { fontSize: 12, fontWeight: '700' },
  when: { fontSize: 11.5, color: colors.ink3 },
})
