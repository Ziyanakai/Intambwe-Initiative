import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { colors } from '../theme/colors'

type Props = { navigation: NativeStackNavigationProp<any> }

function RoleCard({ icon, title, desc, features, cta, accent, tint, onPress }: any) {
  return (
    <View style={[styles.roleCard, { shadowColor: colors.ink }]}>
      <View style={styles.roleCardTop}>
        <View style={[styles.roleIcon, { backgroundColor: tint }]}>
          <Text style={{ fontSize: 28 }}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.roleTitle}>{title}</Text>
          <Text style={styles.roleDesc}>{desc}</Text>
        </View>
      </View>
      <View style={styles.features}>
        {features.map((f: string) => (
          <View key={f} style={[styles.featureTag, { backgroundColor: tint }]}>
            <Text style={[styles.featureText, { color: accent }]}>{f}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={[styles.roleCta, { backgroundColor: accent }]} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.roleCtaText}>{cta} →</Text>
      </TouchableOpacity>
    </View>
  )
}

export function RoleSelectScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>How will you use Intambwe?</Text>
        <Text style={styles.sub}>You can switch roles anytime.</Text>

        <RoleCard
          icon="❤️"
          title="Parent / Caregiver"
          desc="Track your child's development, complete guided activities, and work with specialists."
          features={['Add Child', 'Screening', 'Daily Activities', 'Progress']}
          cta="Continue as Parent"
          accent={colors.green600}
          tint={colors.green100}
          onPress={() => navigation.navigate('Login', { role: 'PARENT' })}
        />

        <RoleCard
          icon="🩺"
          title="Doctor / Specialist"
          desc="Assess children, assign development plans, and monitor progress."
          features={['Referrals', 'Assessments', 'Diagnosis', 'Plans']}
          cta="Continue as Specialist"
          accent={colors.comm}
          tint={colors.commTint}
          onPress={() => navigation.navigate('Login', { role: 'DOCTOR' })}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  header: { padding: 16, paddingTop: 8 },
  backBtn: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.ink, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  backText: { fontSize: 28, color: colors.ink, lineHeight: 34 },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  heading: { fontSize: 27, fontWeight: '800', letterSpacing: -0.6, color: colors.ink, marginBottom: 4 },
  sub: { fontSize: 14.5, color: colors.ink2, marginBottom: 8 },
  roleCard: {
    backgroundColor: colors.card, borderRadius: 22,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  roleCardTop: { flexDirection: 'row', gap: 14, padding: 18, alignItems: 'flex-start' },
  roleIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  roleTitle: { fontSize: 19, fontWeight: '800', letterSpacing: -0.4, color: colors.ink },
  roleDesc: { fontSize: 13.5, lineHeight: 20, color: colors.ink2, marginTop: 4 },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 18, paddingBottom: 16 },
  featureTag: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  featureText: { fontSize: 12, fontWeight: '600' },
  roleCta: {
    paddingVertical: 15, alignItems: 'center',
  },
  roleCtaText: { fontSize: 15.5, fontWeight: '700', color: colors.white, letterSpacing: -0.2 },
})
