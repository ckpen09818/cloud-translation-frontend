import ky, { type Options } from 'ky'

const apiPath = `${import.meta.env.VITE_API_BASE_URL}/api`

const baseApi = ky.create({ prefixUrl: apiPath })

export async function api<T>(url: string, options?: Options) {
  try {
    const resp = await baseApi(url, { ...options })
    if (!resp.ok) {
      throw new HttpError(`Fetch error: ${resp.statusText}`)
    }
    return (await resp.json()) as Promise<ApiResponse<T>>
  } catch (error) {
    console.log('error', error)
  }
}

// const refreshToken: BeforeRetryHook = async ({ request, options, error, retryCount }) => {}

class HttpError extends Error {}
export async function translate(params: { text: string; language: ISO_639_1Code }) {
  const resp = await api<string>('language/translate', {
    method: 'GET',
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
    method: 'GET',
    searchParams: { text: language },
  })
  return resp
}
