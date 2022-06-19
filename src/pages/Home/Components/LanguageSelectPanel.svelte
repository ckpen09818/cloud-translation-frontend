<script lang="ts">
import { onMount, createEventDispatcher, tick } from 'svelte'
import Tab, { Label } from '@smui/tab'
import TabBar from '@smui/tab-bar'
import Button from '@smui/button'
import MenuSurface from '@smui/menu-surface'
import { Icon } from '@smui/icon-button'
import { Svg } from '@smui/common/elements'
import { mdiChevronUp, mdiChevronDown, mdiCheck } from '@mdi/js'

import { SvgIconButton } from '@/components'
import { languageOptions, languageTextMap } from '@/stores'
import { media } from '@/utils'
import debounce from 'lodash/debounce'

import type { MenuSurfaceComponentDev } from '@smui/menu-surface'

const dispatch = createEventDispatcher()

let numberOfFrequentlyLangShow = 4
let frequentlyUsedLangs: ISO_639_1Code[] = ['en']
let selected: ISO_639_1Code
let surface: MenuSurfaceComponentDev
let toggle: boolean = false
let translationLangKeyword: string = ''
let translationLangInputElem: HTMLInputElement

$: dispatch('langChange', selected)
$: toggle, (translationLangKeyword = '')

$: {
  if ($media.lg || $media.xl) numberOfFrequentlyLangShow = 4
  else if ($media.md) numberOfFrequentlyLangShow = 3
  else if ($media.sm) numberOfFrequentlyLangShow = 2
  else numberOfFrequentlyLangShow = 1

  if (frequentlyUsedLangs.length > numberOfFrequentlyLangShow) {
    frequentlyUsedLangs.pop()
    frequentlyUsedLangs = frequentlyUsedLangs
  }
}

const handleSearchLangChange = debounce((e: Event) => {
  const value = (e.target as HTMLInputElement).value
  translationLangKeyword = value
}, 500)

async function handleLanguageChange(lang: ISO_639_1Code) {
  toggle = false
  if (frequentlyUsedLangs.includes(lang)) {
    selected = lang
    return
  }
  if (frequentlyUsedLangs.length >= numberOfFrequentlyLangShow) frequentlyUsedLangs.pop()
  frequentlyUsedLangs = [lang, ...frequentlyUsedLangs]
  await tick()
  selected = lang
}

function handleLanguageSelectMenuToggle(event: CustomEvent<PointerEvent>) {
  event.stopPropagation()
  toggle = !toggle
  if (toggle) {
    requestAnimationFrame(() => {
      translationLangInputElem.focus()
    })
  }
}

function handleSurfaceStateSync() {
  if (!surface.isOpen()) toggle = false
}

const recentlyUsedLangs = localStorage.getItem('recentlyUsedLangs')
if (recentlyUsedLangs) {
  frequentlyUsedLangs = JSON.parse(recentlyUsedLangs)

  const lastTimeUsedLang = localStorage.getItem('lastTimeUsedLang') as ISO_639_1Code
  selected = lastTimeUsedLang || frequentlyUsedLangs[0]
}
onMount(() => {
  /**
   * Add window click event to control when click outside of surface cause surface open state not successly work issue.
   */
  window.addEventListener('click', handleSurfaceStateSync)
  window.onbeforeunload = () => {
    localStorage.setItem('recentlyUsedLangs', JSON.stringify(frequentlyUsedLangs))
    localStorage.setItem('lastTimeUsedLang', selected || frequentlyUsedLangs[0])
  }
  // Trigger init language event because dispatch event happen in mount hook
  dispatch('langChange', selected)
  return () => {
    window.removeEventListener('click', handleSurfaceStateSync)
  }
})
</script>

<div class="p-4 flex flex-row justify-start items-center">
  <div class="flex mr-4">
    <TabBar tabs={frequentlyUsedLangs} let:tab bind:active={selected}>
      <Tab {tab} minWidth>
        <Label>{$languageTextMap?.[tab]}</Label>
      </Tab>
    </TabBar>
  </div>
  <SvgIconButton svgIcon={toggle ? mdiChevronUp : mdiChevronDown} on:click={(e) => handleLanguageSelectMenuToggle(e)} />
  <MenuSurface bind:this={surface} anchorCorner="BOTTOM_LEFT" class="w-full" open={toggle}>
    <div class="p-2">
      <input
        bind:this={translationLangInputElem}
        class="w-full p-3 outline-none"
        type="text"
        placeholder="Search languages"
        value={translationLangKeyword}
        on:input={(e) => handleSearchLangChange(e)}
      />
    </div>
    <div class="grid grid-cols-4 <sm:grid-cols-2 <md:grid-cols-3 gap-2 p-3">
      {#each $languageOptions.filter(({ name }) => name
          .toLowerCase()
          .includes(translationLangKeyword.toLowerCase())) as option (option.code)}
        {@const isActive = selected === option.code}
        <Button on:click={() => handleLanguageChange(option.code)} variant={isActive ? 'unelevated' : 'text'}>
          {#if isActive}
            <Icon component={Svg} viewBox="0 0 24 24">
              <path d={mdiCheck} />
            </Icon>
          {/if}
          <span class={`${isActive ? 'text-light-100' : 'text-dark-900'}`}>{option.name}</span>
        </Button>
      {/each}
    </div>
  </MenuSurface>
</div>
