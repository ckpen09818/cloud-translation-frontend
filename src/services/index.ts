import ky, { type Options } from 'ky'

const apiPath = `${import.meta.env.VITE_API_BASE_URL}/api`

const baseApi = ky.create({ prefixUrl: apiPath })

class HttpError extends Error {}
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
export * from './languages'
export * from './list'
