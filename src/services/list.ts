import { api } from '.'

type TranslationListResponse<T = Pagination> = {
  list: Array<Translation>
  paging: T
}
export type GetTranslationListParams = { pageSize: PageSize; page?: number }
const translationListPathMap = {
  history: 'translationHistory',
  saved: 'saved',
  hot: 'hot',
}
export type Action = keyof typeof translationListPathMap
export type GetTranslationListFn = typeof getHistoryTranslationList

export const getTranslationListFactory = (action: Action) => async (params: GetTranslationListParams) => {
  const path = translationListPathMap[action]
  const resp = await api<TranslationListResponse>(`list/${path}`, {
    method: 'GET',
    searchParams: params,
  })
  return resp
}

export const getHistoryTranslationList = getTranslationListFactory('history')
export const getSavedTranslationList = getTranslationListFactory('saved')
export const getHotTranslationList = getTranslationListFactory('hot')
