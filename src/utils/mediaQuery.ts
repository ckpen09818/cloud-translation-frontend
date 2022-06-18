import { readable, type Readable } from 'svelte/store'

const defaultQueries = {
  sm: '(min-width: 640px) and (max-width: 767.9px)',
  md: '(min-width: 768px) and (max-width: 1023.9px)',
  lg: '(min-width: 1024px) and (max-width: 1279.9px)',
  xl: '(min-width: 1280px)',
}

export let media: Readable<Dictionary<boolean>>
export const createMediaStoreInst = (queries: Dictionary<string>) => {
  let mqMap: Dictionary<boolean> = {}
  return readable(mqMap, (set) => {
    for (const [breakpoint, query] of Object.entries(queries)) {
      const mq = window.matchMedia(query)
      mqMap[breakpoint] = mq.matches

      mq.addEventListener('change', (e) => {
        mqMap[breakpoint] = e.matches
        set(mqMap)
      })
    }
    return function stop() {}
  })
}

export const setup = (queries: Dictionary<string> = defaultQueries) => {
  media = createMediaStoreInst(queries)
}
