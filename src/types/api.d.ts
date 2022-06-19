type ApiBaseResponse = {
  code: number
  message: string
  success: boolean
}
type ApiResponse<T = null> = T extends null ? ApiBaseResponse : ApiBaseResponse & { data: T }

type SupportLangItem = { code: ISO_639_1Code; name: string }
type SupportLangList = Array<SupportLangItem>

type PageSize = '10' | '20' | '50'
