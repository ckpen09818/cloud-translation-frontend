<script lang="ts">
import { onMount } from 'svelte'
import IconButton, { Icon } from '@smui/icon-button'
import { Svg } from '@smui/common/elements'
import Textarea from '@/components/Textarea.svelte'
import LanguageSelectPanel from '@/components/LanguageSelectPanel.svelte'
import { mdiClose, mdiStarOutline, mdiStar, mdiHistory } from '@mdi/js'
import IconButtonWithDesc from '@/components/IconButtonWithDesc.svelte'
import { detectLanguage, getLanguageList, translate, changeTranslationSaveState } from '@/services'
import { getBrowserLang, isEmptyString } from '@/utils'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

let originalText: string = ''
let translatedText: string = ''
let translateTo: ISO_639_1Code
let translateFrom: ISO_639_1Code
let saved = false

let languageOptions: SupportLangList = []
let languageCodeMap: Record<ISO_639_1Code, string>
let differentLanguageTip: string = ''

const ThrottledDetectLanguage = throttle(async (lang: ISO_639_1Code) => {
  const resp = await detectLanguage(originalText)
  translateFrom = resp.data.language
  differentLanguageTip = lang !== translateFrom ? translateFrom : ''
}, 2000)

const handleLangChange = debounce(async ({ detail: lang }: CustomEvent<ISO_639_1Code>) => {
  translateTo = lang
  if (isEmptyString(originalText)) return
  ThrottledDetectLanguage(lang)
  throttledTranslate()
}, 800)

async function translateText() {
  if (isEmptyString(originalText)) return
  const resp = await translate({ text: originalText, translateTo, translateFrom })
  translatedText = resp.data.text
  saved = resp.data.saved
}
const throttledTranslate = throttle(translateText, 2000)

const handleTextChange = debounce(async () => {
  if (isEmptyString(originalText)) return
  await ThrottledDetectLanguage(translateTo)
  await throttledTranslate()
}, 1000)

function cleanTextareaValue() {
  originalText = ''
  translatedText = ''
}

function toggleSaveState() {
  saved = !saved
  changeTranslationSaveState({ text: originalText, translateTo, saved })
}

onMount(async () => {
  const browserDefaultLanguage = getBrowserLang()
  const languageList = localStorage.getItem(browserDefaultLanguage)
  if (!languageList) {
    const resp = await getLanguageList(browserDefaultLanguage)
    languageOptions = resp.data
    localStorage.setItem(browserDefaultLanguage, JSON.stringify(languageOptions))
  } else {
    languageOptions = JSON.parse(languageList) as SupportLangList
  }

  languageCodeMap = languageOptions.reduce((map, item) => {
    map[item.code] = item.name
    return map
  }, {} as Record<ISO_639_1Code, string>)
})
</script>

<div>
  <LanguageSelectPanel list={languageOptions} lanCodeMap={languageCodeMap} on:langChange={handleLangChange} />
  <div class="flex flex-col gap-4">
    <Textarea bind:value={originalText} on:input={handleTextChange}>
      <div class="w-full flex p-2" slot="extra">
        {#if differentLanguageTip.length > 0}
          <div class="pl-3">
            Translate from:
            <span tabindex="0" role="button" class="ml-4 text-blue-400 cursor-pointer"
              >{languageCodeMap[differentLanguageTip]}</span
            >
          </div>
        {/if}
      </div>
      <IconButton on:click={cleanTextareaValue} slot="corner">
        <Icon component={Svg} viewBox="0 0 24 24">
          <path d={mdiClose} />
        </Icon>
      </IconButton>
    </Textarea>

    <Textarea bind:value={translatedText} placeholder="Translation">
      <IconButton on:click={toggleSaveState} slot="corner">
        {#if translatedText.length}
          <Icon component={Svg} viewBox="0 0 24 24">
            <path d={saved ? mdiStar : mdiStarOutline} />
          </Icon>
        {/if}
      </IconButton>
    </Textarea>
  </div>
  <div class="flex justify-center items-center gap-8 mt-4">
    <IconButtonWithDesc desc="History" icon={mdiHistory} />
    <IconButtonWithDesc desc="Saved" icon={mdiStar} />
  </div>
</div>
