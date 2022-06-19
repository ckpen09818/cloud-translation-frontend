<script lang="ts">
import { IconButtonWithDesc, Drawer, SvgIconButton } from '@/components'
import { mdiClose } from '@mdi/js'
import List from '@smui/list'
import { getSavedTranslationList } from '@/services'
import TranslationCard from './TranslationCard.svelte'

import { mdiStar } from '@mdi/js'

export let open = false
let list: Array<Translation> = []

async function getSavedTranslation() {
  const resp = await getSavedTranslationList({ pageSize: '20' })
  list = resp.data.list
  console.log(resp.data)
}

$: if (open) {
  getSavedTranslation()
}
</script>

<IconButtonWithDesc desc="Saved" icon={mdiStar} bind:active={open} />
<Drawer bind:open width="360px">
  <div class="p-4 pb-6 border-b-1 static">
    <h1 class="text-3xl font-medium text-left">Saved</h1>
    <SvgIconButton class="absolute top-1 right-1" on:click={() => (open = false)} svgIcon={mdiClose} />
  </div>
  <List class="overflow-scroll pb-2" nonInteractive style="height:calc(100% - 80px)">
    {#each list as item (`${item.text}:${item.translateTo}`)}
      <TranslationCard {item} />
    {/each}
  </List>
</Drawer>
