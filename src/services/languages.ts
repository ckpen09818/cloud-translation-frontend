import { api } from '.'

type TranslateQuery = {
  text: string
  translateTo: ISO_639_1Code
  translateFrom: ISO_639_1Code
}
export async function translate(params: TranslateQuery) {
  const resp = await api<string>('language/translate', {
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
