<script lang="ts">
import { onMount } from 'svelte'
import { SvgIconButton, Textarea } from '@/components'
import LanguageSelectPanel from './Components/LanguageSelectPanel.svelte'
import HistoryActionWithDrawer from './Components/HistoryActionWithDrawer.svelte'
import SavedActionWithDrawer from './Components/SavedActionWithDrawer.svelte'

import { mdiClose, mdiStarOutline, mdiStar } from '@mdi/js'
import { detectLanguage, getLanguageList, translate, changeTranslationSaveState } from '@/services'
import { getBrowserLang, isEmptyString } from '@/utils'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

import { languageOptions, languageTextMap } from '@/stores'

let originalText: string = ''
let translatedText: string = ''
let translateTo: ISO_639_1Code
let translateFrom: ISO_639_1Code
let saved = false
let historytoggle = false
let savedToggle = false

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
    $languageOptions = resp.data
    localStorage.setItem(browserDefaultLanguage, JSON.stringify(languageOptions))
  } else {
    $languageOptions = JSON.parse(languageList) as SupportLangList
  }
})
</script>

<div>
  <LanguageSelectPanel on:langChange={handleLangChange} />
  <div class="flex flex-col gap-4">
    <Textarea bind:value={originalText} on:input={handleTextChange}>
      <div class="w-full flex p-2" slot="extra">
        {#if differentLanguageTip.length > 0}
          <div class="pl-3">
            Translate from:
            <span tabindex="0" role="button" class="ml-4 text-blue-400 cursor-pointer">
              {$languageTextMap[differentLanguageTip]}
            </span>
          </div>
        {/if}
      </div>
      <SvgIconButton svgIcon={mdiClose} on:click={cleanTextareaValue} slot="corner" />
    </Textarea>

    <Textarea bind:value={translatedText} placeholder="Translation">
      <svelte:fragment slot="corner">
        {#if translatedText.length}
          <SvgIconButton
            title={saved ? 'Remove from saved' : 'Save translation'}
            svgIcon={saved ? mdiStar : mdiStarOutline}
            on:click={toggleSaveState}
          />
        {/if}
      </svelte:fragment>
    </Textarea>
  </div>
  <div class="flex justify-center items-center gap-8 mt-4">
    <HistoryActionWithDrawer bind:open={historytoggle} />
    <SavedActionWithDrawer bind:open={savedToggle} />
  </div>
</div>
