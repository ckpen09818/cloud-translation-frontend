import { api } from '.'

type TranslationListResponse<T = Pagination> = {
  list: Array<Translation>
  paging: T
}

export async function getTranslationHistoryList(params: { pageSize: PageSize; cursor?: string }) {
  const resp = await api<TranslationListResponse>('list/translationHistory', {
    method: 'GET',
    searchParams: params,
  })

  return resp
}

export async function getSavedTranslationList(params: { pageSize: PageSize; page?: number }) {
  const resp = await api<TranslationListResponse<SavedPagination>>('list/saved', {
    method: 'GET',
    searchParams: params,
  })

  return resp
}
