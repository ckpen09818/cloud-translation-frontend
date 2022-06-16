import { api } from '.'

export async function getHistorySearchList(params: { pageSize: PageSize; cursor: string }) {
  const resp = await api<string>('list/searchHistory', {
    method: 'GET',
    searchParams: params,
  })

  return resp
}
