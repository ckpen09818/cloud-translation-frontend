export * from './getBrowserLang'

export function isEmptyString(str: string) {
  return !/.+/.test(str)
}
