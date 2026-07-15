import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp } from '@react-navigation/native'
import { colors as COLORS } from '../../theme/colors'

type Props = {
  navigation: NativeStackNavigationProp<any>
  route: RouteProp<any>
}

export default function StedResultScreen({ navigation, route }: Props) {
  const { childName, ageLabel, stedPart, totalQuestions, noCount, refer } = route.params as {
    childName: string
    ageLabel: string
    stedPart: string
    totalQuestions: number
    noCount: number
    refer: boolean
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Result banner */}
        <View style={[styles.banner, refer ? styles.bannerRefer : styles.bannerClear]}>
          <Text style={styles.bannerIcon}>{refer ? '⚠️' : '✅'}</Text>
          <Text style={styles.bannerTitle}>
            {refer ? 'Refer to Health Centre' : 'No Concerns Detected'}
          </Text>
          <Text style={styles.bannerSub}>
            {refer
              ? `${noCount} concern${noCount > 1 ? 's' : ''} flagged — STED protocol requires referral`
              : 'All questions answered positively. Schedule next screening in 6 months.'}
          </Text>
        </View>

        {/* Summary card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Screening Summary</Text>
          <Row label="Child" value={childName} />
          <Row label="Age group" value={ageLabel} />
          <Row label="STED Part" value={`Part ${stedPart}`} />
          <Row label="Questions answered" value={`${totalQuestions}`} />
          <Row label="Concerns flagged" value={`${noCount}`} highlight={noCount > 0} />
        </View>

        {/* Action card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommended Action</Text>
          {refer ? (
            <>
              <Text style={styles.actionText}>
                Per the Rwanda MoH STED protocol, one or more "No" answers requires immediate referral to the nearest health centre for professional assessment.
              </Text>
              <View style={styles.referSteps}>
                <Step n="1" text="Inform the child's caregiver of the referral" />
                <Step n="2" text="Document the referral in the child's record" />
                <Step n="3" text="Follow up within 2 weeks to confirm attendance" />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.actionText}>
                All developmental milestones appear on track for this age group. Continue monitoring and schedule the next STED screening in 6 months.
              </Text>
              <View style={styles.referSteps}>
                <Step n="1" text="Share positive result with the caregiver" />
                <Step n="2" text="Advise on age-appropriate stimulation activities" />
                <Step n="3" text="Set a reminder for the 6-month follow-up" />
              </View>
            </>
          )}
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('StedScreening')}
        >
          <Text style={styles.primaryBtnText}>Screen Another Child</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Referrals')}
        >
          <Text style={styles.secondaryBtnText}>View All Referrals</Text>
        </TouchableOpacity>

        <Text style={styles.footnote}>
          Source: STED — Rwanda Biomedical Centre / Ministry of Health, February 2023
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowValueRed]}>{value}</Text>
    </View>
  )
}

function Step({ n, text }: { n: string; text: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNum}><Text style={styles.stepNumText}>{n}</Text></View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  container: { padding: 20 },

  banner: { borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20 },
  bannerRefer: { backgroundColor: '#fef2f2' },
  bannerClear: { backgroundColor: '#f0fdf4' },
  bannerIcon: { fontSize: 40, marginBottom: 8 },
  bannerTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 6, textAlign: 'center' },
  bannerSub: { fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 20 },

  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 2 } }),
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 14 },

  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  rowLabel: { fontSize: 13, color: '#64748b' },
  rowValue: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  rowValueRed: { color: '#ef4444' },

  actionText: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 16 },
  referSteps: { gap: 10 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.green600, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 13, color: '#475569', lineHeight: 18, paddingTop: 3 },

  primaryBtn: { backgroundColor: COLORS.green600, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryBtn: { borderWidth: 1.5, borderColor: COLORS.green600, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  secondaryBtnText: { color: COLORS.green600, fontSize: 15, fontWeight: '600' },

  footnote: { fontSize: 10, color: '#94a3b8', textAlign: 'center', marginBottom: 20 },
})
