export * from './getBrowserLang'
export * from './mediaQuery'

export function isEmptyString(str: string) {
  return !/.+/.test(str)
}
