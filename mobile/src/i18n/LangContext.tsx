import React, { createContext, useContext, useState } from 'react'
import { strings, Lang, Strings } from './strings'

interface LangContextValue {
  lang: Lang
  t: Strings
  toggleLang: () => void
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  t: strings.en,
  toggleLang: () => {},
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const toggleLang = () => setLang(l => l === 'en' ? 'rw' : 'en')

  return (
    <LangContext.Provider value={{ lang, t: strings[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
