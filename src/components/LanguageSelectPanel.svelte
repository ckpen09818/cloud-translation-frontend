<script lang="ts">
import { onMount, createEventDispatcher, tick } from 'svelte'
import Tab, { Label } from '@smui/tab'
import TabBar from '@smui/tab-bar'
import Button from '@smui/button'
import IconButton, { Icon } from '@smui/icon-button'
import MenuSurface from '@smui/menu-surface'
import { Svg } from '@smui/common/elements'
import { mdiChevronUp, mdiChevronDown, mdiCheck } from '@mdi/js'
import debounce from 'lodash/debounce'

import type { MenuSurfaceComponentDev } from '@smui/menu-surface'

const MAX_FREQUENTLY_LANG_SHOW = 4
const dispatch = createEventDispatcher()

export let list: SupportLangList = []
export let lanCodeMap: Record<ISO_639_1Code, string>
let frequentlyUsedLangs: ISO_639_1Code[] = ['en']
let selected: ISO_639_1Code
let surface: MenuSurfaceComponentDev
let toggle: boolean = false
let searchLanguageKeyword: string = ''
let searchLangInputElem: HTMLInputElement

$: dispatch('langChange', selected)
$: toggle, (searchLanguageKeyword = '')

const handleSearchLangChange = debounce((e: Event) => {
  const value = (e.target as HTMLInputElement).value
  searchLanguageKeyword = value
}, 500)

async function handleLanguageChange(lang: ISO_639_1Code) {
  toggle = false
  if (frequentlyUsedLangs.includes(lang)) {
    selected = lang
    return
  }
  if (frequentlyUsedLangs.length >= MAX_FREQUENTLY_LANG_SHOW) frequentlyUsedLangs.pop()
  frequentlyUsedLangs = [lang, ...frequentlyUsedLangs]
  await tick()
  selected = lang
}

function handleLanguageSelectMenuToggle(event: CustomEvent<PointerEvent>) {
  event.stopPropagation()
  toggle = !toggle
  if (toggle) {
    requestAnimationFrame(() => {
      searchLangInputElem.focus()
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
        <Label>{lanCodeMap?.[tab]}</Label>
      </Tab>
    </TabBar>
  </div>
  <div>
    <IconButton class="material-icons" on:click={(e) => handleLanguageSelectMenuToggle(e)}>
      <Icon component={Svg} viewBox="0 0 24 24">
        <path d={toggle ? mdiChevronUp : mdiChevronDown} />
      </Icon>
    </IconButton>
  </div>
  <MenuSurface bind:this={surface} anchorCorner="BOTTOM_LEFT" class="w-full" open={toggle}>
    <div class="p-2">
      <input
        bind:this={searchLangInputElem}
        class="w-full p-3 outline-none"
        type="text"
        placeholder="Search languages"
        value={searchLanguageKeyword}
        on:input={(e) => handleSearchLangChange(e)}
      />
    </div>
    <div class="grid grid-cols-4 gap-2 p-3">
      {#each list.filter(({ name }) => name
          .toLowerCase()
          .includes(searchLanguageKeyword.toLowerCase())) as option (option.code)}
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
