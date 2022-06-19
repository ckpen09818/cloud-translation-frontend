import { api } from '.'

type TranslationListResponse = {
  list: Array<Translation>
  page: {
    pageSize: PageSize
    nextCursor: null | string
    hasMore: boolean
  }
}

export async function getTranslationHistoryList(params: { pageSize: PageSize; cursor?: string }) {
  const resp = await api<TranslationListResponse>('list/translationHistory', {
    method: 'GET',
    searchParams: params,
  })

  return resp
}

export async function getSavedTranslationList(params: { pageSize: PageSize; cursor?: string }) {
  const resp = await api<TranslationListResponse>('list/saved', {
    method: 'GET',
    searchParams: params,
  })

  return resp
}
