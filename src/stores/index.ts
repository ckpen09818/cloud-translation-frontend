import { derived, writable } from 'svelte/store'

export const languageOptions = writable<SupportLangList>([])

export const languageTextMap = derived(languageOptions, ($langOptions) =>
  $langOptions.reduce((map, item) => {
    map[item.code] = item.name
    return map
  }, {} as Record<ISO_639_1Code, string>),
)
