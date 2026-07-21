import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Platform, ActivityIndicator, RefreshControl,
} from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { colors as COLORS } from '../../theme/colors'
import { getSectionForAge, StedSection } from '../../data/stedQuestions'
import api from '../../api/client'

type Props = { navigation: NativeStackNavigationProp<any> }
type Step = 'pick-child' | 'questions' | 'submitting'

interface Child {
  id: string
  name: string
  dateOfBirth: string
  parent: { email: string }
  screenings: { riskLevel: string; createdAt: string }[]
}

function ageLabel(dob: string): string {
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return ''
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (months < 12) return `${months} mo`
  return `${Math.floor(months / 12)} yr ${months % 12} mo`
}

function ageMonths(dob: string): number {
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return -1
  const now = new Date()
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function StedScreeningScreen({ navigation }: Props) {
  const [step, setStep] = useState<Step>('pick-child')
  const [children, setChildren] = useState<Child[]>([])
  const [loadingChildren, setLoadingChildren] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [section, setSection] = useState<StedSection | null>(null)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [currentQ, setCurrentQ] = useState(0)

  useEffect(() => { loadChildren() }, [])

  async function loadChildren(isRefresh = false) {
    if (isRefresh) setRefreshing(true)
    try {
      const res = await api.get('/doctor/children')
      setChildren(res.data)
    } catch {
      // show empty state
    } finally {
      setLoadingChildren(false)
      setRefreshing(false)
    }
  }

  function selectChild(child: Child) {
    const months = ageMonths(child.dateOfBirth)
    const found = getSectionForAge(months)
    if (!found) {
      // outside STED range — still let them proceed, show warning handled below
      return
    }
    setSelectedChild(child)
    setSection(found)
    setAnswers({})
    setCurrentQ(0)
    setStep('questions')
  }

  function answer(value: boolean) {
    if (!section || !selectedChild) return
    const qId = section.questions[currentQ].id
    const updated = { ...answers, [qId]: value }
    setAnswers(updated)
    if (currentQ < section.questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      submitScreening(updated)
    }
  }

  async function submitScreening(finalAnswers: Record<string, boolean>) {
    if (!selectedChild || !section) return
    setStep('submitting')
    const anyNo = Object.values(finalAnswers).some(v => v === false)
    const noCount = Object.values(finalAnswers).filter(v => v === false).length

    try {
      await api.post('/doctor/screen', {
        childId: selectedChild.id,
        answers: finalAnswers,
      })
    } catch {
      // continue to result screen regardless
    }

    navigation.replace('StedResult', {
      childId: selectedChild.id,
      childName: selectedChild.name,
      ageLabel: section.ageLabel,
      stedPart: section.part,
      totalQuestions: section.questions.length,
      noCount,
      refer: anyNo,
    })
  }

  // ── Pick child step ──────────────────────────────────────────────
  if (step === 'pick-child') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadChildren(true)} tintColor={COLORS.comm} />}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>STED Screening</Text>
            <Text style={styles.headerSub}>Select a registered child to begin</Text>
          </View>

          {loadingChildren ? (
            <ActivityIndicator color={COLORS.comm} style={{ marginTop: 40 }} />
          ) : children.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>👶</Text>
              <Text style={styles.emptyTitle}>No registered children</Text>
              <Text style={styles.emptySub}>Parents must register and add their child before a screening can be performed.</Text>
            </View>
          ) : (
            children.map(child => {
              const months = ageMonths(child.dateOfBirth)
              const outOfRange = months < 0 || months > 72
              const lastScreen = child.screenings[0]
              return (
                <TouchableOpacity
                  key={child.id}
                  style={[styles.childCard, outOfRange && styles.childCardDisabled]}
                  onPress={() => !outOfRange && selectChild(child)}
                  activeOpacity={outOfRange ? 1 : 0.8}
                >
                  <View style={styles.childRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{initials(child.name)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childMeta}>{ageLabel(child.dateOfBirth)} · {child.parent.email}</Text>
                      {lastScreen && (
                        <Text style={styles.lastScreen}>
                          Last: {lastScreen.riskLevel} · {new Date(lastScreen.createdAt).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                    {outOfRange
                      ? <Text style={styles.outOfRange}>Out of range</Text>
                      : <Text style={styles.chevron}>›</Text>
                    }
                  </View>
                </TouchableOpacity>
              )
            })
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              STED covers children aged 0–6 years. One "No" answer triggers a referral.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // ── Submitting ───────────────────────────────────────────────────
  if (step === 'submitting') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.green600} size="large" />
          <Text style={styles.loadingText}>Saving result…</Text>
        </View>
      </SafeAreaView>
    )
  }

  // ── Questions ────────────────────────────────────────────────────
  const q = section!.questions[currentQ]
  const progress = (currentQ / section!.questions.length) * 100

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.qHeader}>
          <Text style={styles.qPart}>STED Part {section!.part} · {section!.ageLabel}</Text>
          <Text style={styles.qChild}>{selectedChild!.name}</Text>
        </View>

        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
        </View>
        <Text style={styles.progressLabel}>Question {currentQ + 1} of {section!.questions.length}</Text>

        <View style={[styles.domainBadge, { backgroundColor: getDomainBg(q.domain) }]}>
          <Text style={styles.domainText}>{q.domain.toUpperCase()}</Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{q.text}</Text>
        </View>

        <View style={styles.answerRow}>
          <TouchableOpacity style={[styles.answerBtn, styles.yesBtn]} onPress={() => answer(true)}>
            <Text style={styles.answerBtnText}>✓  Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.answerBtn, styles.noBtn]} onPress={() => answer(false)}>
            <Text style={styles.answerBtnText}>✗  No</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>Answer based on what the caregiver/parent reports.</Text>
      </View>
    </SafeAreaView>
  )
}

function getDomainBg(domain: string): string {
  const map: Record<string, string> = {
    motor: '#0369a1', sensory: '#7c3aed', cognitive: '#be185d',
    communication: '#b45309', 'socio-emotional': '#16A34A',
  }
  return map[domain] ?? '#475569'
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  container: { padding: 20, flexGrow: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 15, color: COLORS.green600 },

  header: { marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.ink },
  headerSub: { fontSize: 13, color: COLORS.ink2, marginTop: 3 },

  emptyBox: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.ink, marginBottom: 6 },
  emptySub: { fontSize: 13, color: COLORS.ink2, textAlign: 'center', lineHeight: 20 },

  childCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 15, marginBottom: 10,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 2 } }),
  },
  childCardDisabled: { opacity: 0.5 },
  childRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 999, backgroundColor: COLORS.commTint, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '800', color: COLORS.comm },
  childName: { fontSize: 15, fontWeight: '700', color: COLORS.ink },
  childMeta: { fontSize: 12, color: COLORS.ink2, marginTop: 2 },
  lastScreen: { fontSize: 11, color: COLORS.ink3, marginTop: 2 },
  outOfRange: { fontSize: 11, color: COLORS.riskMod, fontWeight: '600' },
  chevron: { fontSize: 22, color: COLORS.ink3 },

  infoBox: { backgroundColor: '#eff6ff', borderRadius: 10, padding: 12, marginTop: 16 },
  infoText: { fontSize: 12, color: '#1d4ed8', lineHeight: 18 },

  qHeader: { marginBottom: 8 },
  qPart: { fontSize: 12, color: COLORS.ink2, fontWeight: '500' },
  qChild: { fontSize: 16, fontWeight: '700', color: COLORS.ink, marginTop: 2 },
  progressBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, marginBottom: 6 },
  progressFill: { height: 6, backgroundColor: COLORS.green600, borderRadius: 3 },
  progressLabel: { fontSize: 12, color: COLORS.ink2, marginBottom: 16 },
  domainBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 16 },
  domainText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  questionCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 32,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 2 } }),
  },
  questionText: { fontSize: 17, color: COLORS.ink, lineHeight: 26, fontWeight: '500' },
  answerRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  answerBtn: { flex: 1, paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  yesBtn: { backgroundColor: COLORS.green600 },
  noBtn: { backgroundColor: '#ef4444' },
  answerBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  hint: { fontSize: 12, color: COLORS.ink3, textAlign: 'center' },
})
