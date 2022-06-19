<script lang="ts">
import { IconButtonWithDesc, Drawer, SvgIconButton } from '@/components'
import { mdiHistory, mdiClose } from '@mdi/js'
import List from '@smui/list'
import { getTranslationHistoryList } from '@/services'
import TranslationCard from './TranslationCard.svelte'

export let open = false
let list: Array<Translation> = []

async function getTranslationHistory() {
  const resp = await getTranslationHistoryList({ pageSize: 20 })
  list = resp.data.list
  console.log(resp.data)
}

$: if (open) {
  getTranslationHistory()
}
</script>

<IconButtonWithDesc desc="History" icon={mdiHistory} bind:active={open} />
<Drawer bind:open width="360px">
  <div class="p-4 pb-6 border-b-1 static">
    <h1 class="text-3xl font-medium text-left">Translation History</h1>
    <SvgIconButton class="absolute top-1 right-1" on:click={() => (open = false)} svgIcon={mdiClose} />
  </div>
  <List class="overflow-scroll pb-2" nonInteractive style="height:calc(100% - 80px)">
    {#each list as item (`${item.text}:${item.translateTo}`)}
      <TranslationCard {item} />
    {/each}
  </List>
</Drawer>
