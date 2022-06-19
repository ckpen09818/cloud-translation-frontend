<script lang="ts">
import List from '@smui/list'
import { mdiHistory, mdiClose, mdiChevronLeft, mdiChevronRight } from '@mdi/js'

import { IconButtonWithDesc, Drawer, SvgIconButton } from '@/components'
import { getTranslationHistoryList, type GetTranslationListParams } from '@/services'
import TranslationCard from './TranslationCard.svelte'

export let open = false

let list: Array<Translation> = []
let curPage = 1
let pagination: Pagination = {
  pageSize: 10,
  next: null,
  hasMore: false,
  total: 0,
}

async function getTranslationHistory(params: GetTranslationListParams = { pageSize: pagination.pageSize }) {
  const resp = await getTranslationHistoryList(params)
  list = resp.data.list
  pagination = resp.data.paging
}

const changePage = (page: number) => getTranslationHistory({ pageSize: pagination.pageSize, page })
const nextPage = () => changePage(++curPage)
const prevPage = () => changePage(--curPage)

$: if (open) {
  getTranslationHistory()
} else {
  curPage = 1
}
</script>

<IconButtonWithDesc desc="History" icon={mdiHistory} bind:active={open} />
<Drawer bind:open width="360px">
  <div class="p-4 pb-6 border-b-1 static">
    <h1 class="text-3xl font-medium text-left">Translation History</h1>
    <SvgIconButton class="absolute top-1 right-1" on:click={() => (open = false)} svgIcon={mdiClose} />
  </div>
  <div class="border-b-1 p-1 flex justify-between items-center">
    <span class="px-5 text-gray-700 text-sm">
      {pagination.pageSize * (curPage - 1) + 1} - {curPage * pagination.pageSize} of {pagination.total}
      phrases
    </span>
    <div>
      <SvgIconButton svgIcon={mdiChevronLeft} size="button" on:click={prevPage} disabled={curPage === 1} />
      <SvgIconButton svgIcon={mdiChevronRight} size="button" on:click={nextPage} disabled={!pagination.hasMore} />
    </div>
  </div>
  <List class="overflow-scroll pb-2" nonInteractive style="height:calc(100% - 125px)">
    {#each list as item (`${item.text}:${item.translateTo}`)}
      <TranslationCard {item} />
    {/each}
  </List>
</Drawer>
