<script lang="ts">
import { Item } from '@smui/list'
import { mdiStar, mdiStarOutline } from '@mdi/js'

import { SvgIconButton } from '@/components'
import { languageTextMap } from '@/stores'
import { changeTranslationSaveState } from '@/services'

export let item: Translation

async function toggleSaveState() {
  const { originalText, translateTo, saved } = item
  const newSaveState = !saved
  const resp = await changeTranslationSaveState({ text: originalText, translateTo, saved: newSaveState })
  if (resp.success) {
    item = { ...item, saved: newSaveState }
  }
}
</script>

<Item class="p-3 flex flex-col items-start gap-1 h-auto hover:bg-gray-100 text-sm" ripple={false}>
  <div class="border rounded-xl border-gray-300 py-1 px-3 cursor-pointer hover:bg-gray-200">
    {$languageTextMap[item.translateFrom]}
    <span class="r-arrow mx-1" />
    {$languageTextMap[item.translateTo]}
  </div>
  <p>{item.originalText}</p>
  <p>{item.text}</p>
  <SvgIconButton
    title={item.saved ? 'Remove from saved' : 'Save translation'}
    class="absolute top-1 right-1"
    svgIcon={item.saved ? mdiStar : mdiStarOutline}
    on:click={toggleSaveState}
  />
</Item>

<style>
.r-arrow::after {
  content: '\002192';
}
</style>
