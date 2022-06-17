import { api } from '.'

type TranslateQuery = {
  text: string
  translateTo: ISO_639_1Code
  translateFrom: ISO_639_1Code
}
type TranslateResponse = {
  saved: boolean
  text: string
  translateTo: ISO_639_1Code
}
export async function translate(params: TranslateQuery) {
  const resp = await api<TranslateResponse>('language/translate', {
    method: 'POST',
    searchParams: params,
  })

  return resp
}

export async function getLanguageList(language: ISO_639_1Code) {
  const resp = await api<SupportLangList>(`language/list/${language}`, {
    method: 'GET',
  })
  return resp
}

export type DetectLanguageResponse = {
  confidence: number
  input: string
  language: ISO_639_1Code
}
export async function detectLanguage(language: string) {
  const resp = await api<DetectLanguageResponse>('language/detect', {
    method: 'POST',
    searchParams: { text: language },
  })
  return resp
}

export async function changeTranslationSaveState(params: { text: string; translateTo: ISO_639_1Code; saved: boolean }) {
  const resp = await api<string>('language/saved', {
    method: 'PATCH',
    json: params,
  })

  return resp
}
