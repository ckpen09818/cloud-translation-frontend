export function getBrowserLang() {
  const sysLang = navigator.language
  return transformLangToISO639(sysLang)
}

const omitList = ['zh-TW', 'zh-CN']
function transformLangToISO639(lang: string): ISO_639_1Code {
  if (omitList.includes(lang)) return lang as ISO_639_1Code
  return lang.split('-')[0] as ISO_639_1Code
}
