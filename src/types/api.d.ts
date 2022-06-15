type ApiResponse<T> = {
  data: T
}

type SupportLangItem = { code: ISO_639_1Code; name: string }
type SupportLangList = Array<SupportLangItem>
