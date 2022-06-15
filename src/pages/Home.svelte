<script lang="ts">
import { onMount } from 'svelte'
import IconButton, { Icon } from '@smui/icon-button'
import { Svg } from '@smui/common/elements'
import Textarea from '@/components/Textarea.svelte'
import LanguageSelectPanel from '@/components/LanguageSelectPanel.svelte'
import { mdiClose, mdiStarOutline, mdiStar, mdiHistory } from '@mdi/js'
import IconButtonWithDesc from '@/components/IconButtonWithDesc.svelte'
import { detectLanguage, getLanguageList, translate } from '@/services'
import { getBrowserLang, isEmptyString } from '@/utils'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

let rawText: string = ''
let translatedText: string = ''
let languageOptions: SupportLangList = []
let languageCodeMap: Record<ISO_639_1Code, string>
let differentLanguageTip: string = ''
let activeLanguage: ISO_639_1Code

const ThrottledDetectLanguage = throttle(async () => {
  const resp = await detectLanguage(rawText)
  return resp.data.language
}, 2000)

const handleLangChange = debounce(async ({ detail: lang }: CustomEvent<ISO_639_1Code>) => {
  activeLanguage = lang
  if (isEmptyString(rawText)) return
  const originalLanguage = await ThrottledDetectLanguage()
  differentLanguageTip = lang !== originalLanguage ? originalLanguage : ''
  //translate
  throttledTranslate({ text: rawText, language: activeLanguage })
}, 800)

async function translateText(params: { text: string; language: ISO_639_1Code }) {
  if (isEmptyString(params.text)) return
  const resp = await translate(params)
  translatedText = resp.data
}
const throttledTranslate = throttle(translateText, 2000)

const handleTextChange = debounce(() => {
  throttledTranslate({ text: rawText, language: activeLanguage })
}, 1000)

function cleanTextareaValue() {
  rawText = ''
  translatedText = ''
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
    <Textarea bind:value={rawText} on:input={handleTextChange}>
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
      // TODO: saved translation
      <IconButton on:click={cleanTextareaValue} slot="corner">
        <Icon component={Svg} viewBox="0 0 24 24">
          <path d={mdiStarOutline} />
        </Icon>
      </IconButton>
    </Textarea>
  </div>
  <div class="flex justify-center items-center gap-8 mt-4">
    <IconButtonWithDesc desc="History" icon={mdiHistory} />
    <IconButtonWithDesc desc="Saved" icon={mdiStar} />
  </div>
</div>
