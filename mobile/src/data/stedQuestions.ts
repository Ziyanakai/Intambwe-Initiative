export type StedPart = 'I' | 'II' | 'III' | 'IV' | 'V'

export interface StedQuestion {
  id: string
  text: string
  domain: 'motor' | 'sensory' | 'cognitive' | 'communication' | 'socio-emotional'
}

export interface StedSection {
  part: StedPart
  ageLabel: string
  minMonths: number
  maxMonths: number
  questions: StedQuestion[]
}

export const STED_SECTIONS: StedSection[] = [
  {
    part: 'I',
    ageLabel: '0 – 3 months',
    minMonths: 0,
    maxMonths: 3,
    questions: [
      { id: 'I-1', text: 'When the child is on his/her tummy, does he/she hold his/her head up?', domain: 'motor' },
      { id: 'I-2', text: 'Does the child grasp your finger if you touch the palm of her/his hand?', domain: 'motor' },
      { id: 'I-3', text: 'Is the baby nursing well?', domain: 'motor' },
      { id: 'I-4', text: 'Does the child respond to loud sounds?', domain: 'sensory' },
      { id: 'I-5', text: 'When you move around, does the child follow you with his/her both eyes?', domain: 'sensory' },
      { id: 'I-6', text: 'When you dangle a toy above the baby while lying on his/her back, does he/she wave arms toward it?', domain: 'cognitive' },
      { id: 'I-7', text: 'Does the child smile at you?', domain: 'socio-emotional' },
      { id: 'I-8', text: 'Does the child cry when hungry, wet, tired, or wants to be held?', domain: 'communication' },
    ],
  },
  {
    part: 'II',
    ageLabel: '4 – 6 months',
    minMonths: 4,
    maxMonths: 6,
    questions: [
      { id: 'II-1', text: 'Does the child roll side to side, and sit with forward arm support?', domain: 'motor' },
      { id: 'II-2', text: 'Can the child open and bring hands together, bring hands to mouth and palmar grasp?', domain: 'motor' },
      { id: 'II-3', text: 'Does the child turn the head to sound, and watch moving objects?', domain: 'sensory' },
      { id: 'II-4', text: 'Does the child show curiosity and try to get things that are out of reach?', domain: 'cognitive' },
      { id: 'II-5', text: 'Does the child make sounds back to you when you speak?', domain: 'communication' },
      { id: 'II-6', text: 'Does the baby smile at you, cry when hungry, wet, tired or wants to be held?', domain: 'socio-emotional' },
    ],
  },
  {
    part: 'III',
    ageLabel: '7 – 12 months',
    minMonths: 7,
    maxMonths: 12,
    questions: [
      { id: 'III-1', text: 'Does the child crawl, pull the body up to stand, walk holding onto furniture?', domain: 'motor' },
      { id: 'III-2', text: 'Does the child point with the index finger, put things in containers and take them out?', domain: 'motor' },
      { id: 'III-3', text: 'Does the child make eye contact with you and follow moving objects with their eyes?', domain: 'sensory' },
      { id: 'III-4', text: 'Does the child turn toward where a sound comes from?', domain: 'sensory' },
      { id: 'III-5', text: 'When playing with an object that drops, does the child turn their head to reach for it?', domain: 'cognitive' },
      { id: 'III-6', text: 'Does the child attempt to repeat/mimic the sounds you make when interacting?', domain: 'communication' },
      { id: 'III-7', text: 'Does the child repeat simple gestures (clapping hands, waving bye-bye)?', domain: 'communication' },
      { id: 'III-8', text: 'Does the child babble (mama, dada, baba)?', domain: 'communication' },
      { id: 'III-9', text: 'Does the child behave differently with strangers compared to familiar people?', domain: 'socio-emotional' },
      { id: 'III-10', text: 'Using hands, does the child feed him/herself with hard food (banana, potato, biscuits)?', domain: 'motor' },
    ],
  },
  {
    part: 'IV',
    ageLabel: '1 – 3 years',
    minMonths: 13,
    maxMonths: 36,
    questions: [
      { id: 'IV-1', text: 'Does the child pull to stand while picking up an object, take steps forward or walk?', domain: 'motor' },
      { id: 'IV-2', text: 'Is the child able to point at objects and place small objects into a small container?', domain: 'motor' },
      { id: 'IV-3', text: 'Does the child imitate others\' actions, enjoy looking at pictures and draw?', domain: 'cognitive' },
      { id: 'IV-4', text: 'Does the child scribble back and forth when given a pen without being shown how?', domain: 'cognitive' },
      { id: 'IV-5', text: 'Does the child seem to know the function of common household items (comb, spoon, brush)?', domain: 'cognitive' },
      { id: 'IV-6', text: 'Does the child understand simple commands or identify two body parts?', domain: 'communication' },
      { id: 'IV-7', text: 'Does the child interact and play with other children?', domain: 'socio-emotional' },
    ],
  },
  {
    part: 'V',
    ageLabel: '4 – 6 years',
    minMonths: 37,
    maxMonths: 72,
    questions: [
      { id: 'V-1', text: 'Compared to children of the same age, is the child able to walk, play, run, or climb?', domain: 'motor' },
      { id: 'V-2', text: 'Is the child able to do self-care such as feeding or dressing him/herself?', domain: 'motor' },
      { id: 'V-3', text: 'Is the child able to hear, see, or smell normally?', domain: 'sensory' },
      { id: 'V-4', text: 'Compared to children of the same age, is the child able to learn things (count to 10)?', domain: 'cognitive' },
      { id: 'V-5', text: 'Is the child able to concentrate on an activity he/she enjoys doing?', domain: 'cognitive' },
      { id: 'V-6', text: 'Does the child have self-control when angry or upset?', domain: 'socio-emotional' },
      { id: 'V-7', text: 'When the child speaks, can people inside and outside the household understand him/her?', domain: 'communication' },
      { id: 'V-8', text: 'Does the child understand people from inside and outside his/her household?', domain: 'communication' },
      { id: 'V-9', text: 'Does the child play and make friendships with other children?', domain: 'socio-emotional' },
      { id: 'V-10', text: 'Does the child know how to go to the toilet and take care of cleanliness afterwards?', domain: 'motor' },
    ],
  },
]

export function getSectionForAge(ageMonths: number): StedSection | null {
  return STED_SECTIONS.find(s => ageMonths >= s.minMonths && ageMonths <= s.maxMonths) ?? null
}

export function getAgeInMonths(dob: string): number {
  const birth = new Date(dob)
  const now = new Date()
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
}

const DOMAIN_COLORS: Record<string, string> = {
  motor: '#0369a1',
  sensory: '#7c3aed',
  cognitive: '#be185d',
  communication: '#b45309',
  'socio-emotional': '#16A34A',
}

export function getDomainColor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? '#475569'
}
