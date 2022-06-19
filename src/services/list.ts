import { api } from '.'

type TranslationListResponse<T = Pagination> = {
  list: Array<Translation>
  paging: T
}
export type GetTranslationListParams = { pageSize: PageSize; page?: number }

export async function getTranslationHistoryList(params: GetTranslationListParams) {
  const resp = await api<TranslationListResponse>('list/translationHistory', {
    method: 'GET',
    searchParams: params,
  })

  return resp
}

export async function getSavedTranslationList(params: GetTranslationListParams) {
  const resp = await api<TranslationListResponse>('list/saved', {
    method: 'GET',
    searchParams: params,
  })

  return resp
}
