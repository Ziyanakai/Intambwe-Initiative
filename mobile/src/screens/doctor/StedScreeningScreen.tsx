import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Alert, Platform,
} from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { colors as COLORS } from '../../theme/colors'
import { getSectionForAge, getAgeInMonths, StedSection } from '../../data/stedQuestions'
import api from '../../api/client'

type Props = { navigation: NativeStackNavigationProp<any> }

type Step = 'child-info' | 'questions' | 'submitting'

export default function StedScreeningScreen({ navigation }: Props) {
  const [step, setStep] = useState<Step>('child-info')
  const [childName, setChildName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState<'M' | 'F' | ''>('')
  const [section, setSection] = useState<StedSection | null>(null)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [ageError, setAgeError] = useState('')

  function handleStartScreening() {
    if (!childName.trim()) { Alert.alert('Required', 'Please enter the child\'s name.'); return }
    if (!dob.trim()) { Alert.alert('Required', 'Please enter the date of birth.'); return }
    if (!gender) { Alert.alert('Required', 'Please select gender.'); return }

    const ageMonths = getAgeInMonths(dob)
    if (ageMonths < 0 || ageMonths > 72) {
      setAgeError('STED screening covers children aged 0–6 years.')
      return
    }
    const found = getSectionForAge(ageMonths)
    if (!found) {
      setAgeError('No STED section available for this age.')
      return
    }
    setAgeError('')
    setSection(found)
    setAnswers({})
    setCurrentQ(0)
    setStep('questions')
  }

  function answer(value: boolean) {
    if (!section) return
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
    setStep('submitting')
    const anyNo = Object.values(finalAnswers).some(v => v === false)
    const noCount = Object.values(finalAnswers).filter(v => v === false).length

    try {
      await api.post('/screening', {
        childName,
        dob,
        gender,
        stedPart: section?.part,
        answers: finalAnswers,
        result: anyNo ? 'REFER' : 'FOLLOW_UP',
      })
    } catch (_) {
      // continue to result even if save fails
    }

    navigation.replace('StedResult', {
      childName,
      ageLabel: section?.ageLabel,
      stedPart: section?.part,
      totalQuestions: section?.questions.length,
      noCount,
      refer: anyNo,
    })
  }

  if (step === 'child-info') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>STED Screening</Text>
            <Text style={styles.headerSub}>Simplified Tool for Early Detection (Rwanda MoH, 2023)</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Child Information</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Child's full name"
              value={childName}
              onChangeText={setChildName}
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={dob}
              onChangeText={setDob}
              keyboardType="numbers-and-punctuation"
              placeholderTextColor="#94a3b8"
            />
            {ageError ? <Text style={styles.error}>{ageError}</Text> : null}

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {(['M', 'F'] as const).map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                    {g === 'M' ? 'Male' : 'Female'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              The app will automatically select the correct STED section based on the child's age.
              One "No" answer triggers a referral to the nearest health centre.
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleStartScreening}>
            <Text style={styles.primaryBtnText}>Start Screening →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }

  if (step === 'submitting') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Saving result…</Text>
        </View>
      </SafeAreaView>
    )
  }

  // step === 'questions'
  const q = section!.questions[currentQ]
  const progress = (currentQ / section!.questions.length) * 100

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.qHeader}>
          <Text style={styles.qPart}>STED Part {section!.part} · {section!.ageLabel}</Text>
          <Text style={styles.qChild}>{childName}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          Question {currentQ + 1} of {section!.questions.length}
        </Text>

        {/* Domain badge */}
        <View style={[styles.domainBadge, { backgroundColor: getDomainBg(q.domain) }]}>
          <Text style={styles.domainText}>{q.domain.toUpperCase()}</Text>
        </View>

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{q.text}</Text>
        </View>

        {/* Yes / No */}
        <View style={styles.answerRow}>
          <TouchableOpacity style={[styles.answerBtn, styles.yesBtn]} onPress={() => answer(true)}>
            <Text style={styles.answerBtnText}>✓  Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.answerBtn, styles.noBtn]} onPress={() => answer(false)}>
            <Text style={styles.answerBtnText}>✗  No</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          Answer based on what the caregiver/parent reports about the child.
        </Text>
      </View>
    </SafeAreaView>
  )
}

function getDomainBg(domain: string): string {
  const map: Record<string, string> = {
    motor: '#0369a1',
    sensory: '#7c3aed',
    cognitive: '#be185d',
    communication: '#b45309',
    'socio-emotional': '#16A34A',
  }
  return map[domain] ?? '#475569'
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  container: { padding: 20, flexGrow: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, color: COLORS.green600 },

  header: { marginBottom: 24 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1e293b' },
  headerSub: { fontSize: 12, color: '#64748b', marginTop: 4 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 2 } }),
  },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 16 },
  label: { fontSize: 13, color: '#475569', fontWeight: '500', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,
    color: '#1e293b', marginBottom: 14, backgroundColor: '#f8fafc',
  },
  error: { color: '#ef4444', fontSize: 12, marginBottom: 10 },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', backgroundColor: '#f8fafc',
  },
  genderBtnActive: { borderColor: COLORS.green600, backgroundColor: '#dcfce7' },
  genderText: { fontSize: 14, color: '#64748b' },
  genderTextActive: { color: COLORS.green600, fontWeight: '600' },

  infoBox: { backgroundColor: '#eff6ff', borderRadius: 8, padding: 12, marginBottom: 20 },
  infoText: { fontSize: 12, color: '#1d4ed8', lineHeight: 18 },

  primaryBtn: {
    backgroundColor: COLORS.green600, borderRadius: 10,
    paddingVertical: 14, alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Question step
  qHeader: { marginBottom: 8 },
  qPart: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  qChild: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginTop: 2 },
  progressBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, marginBottom: 6 },
  progressFill: { height: 6, backgroundColor: COLORS.green600, borderRadius: 3 },
  progressLabel: { fontSize: 12, color: '#64748b', marginBottom: 16 },
  domainBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 16 },
  domainText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  questionCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 32,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 2 } }),
  },
  questionText: { fontSize: 17, color: '#1e293b', lineHeight: 26, fontWeight: '500' },
  answerRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  answerBtn: { flex: 1, paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  yesBtn: { backgroundColor: COLORS.green600 },
  noBtn: { backgroundColor: '#ef4444' },
  answerBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  hint: { fontSize: 12, color: '#94a3b8', textAlign: 'center' },
})
