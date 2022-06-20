<script lang="ts">
import { IconButtonWithDesc, Drawer, SvgIconButton } from '@/components'
import { mdiChevronLeft, mdiChevronRight, mdiClose } from '@mdi/js'
import List from '@smui/list'
import TranslationCard from './TranslationCard.svelte'

import type { GetTranslationListFn, GetTranslationListParams } from '@/services'

export let open = false
export let desc = ''
export let svgIcon: string
export let getTranslationListFn: GetTranslationListFn

let list: Array<Translation> = []
let curPage = 1
let pagination: Pagination = {
  pageSize: 10,
  next: null,
  hasMore: false,
  total: 0,
}

async function getTranslationList(params: GetTranslationListParams = { pageSize: pagination.pageSize }) {
  const resp = await getTranslationListFn(params)
  list = resp.data.list
  pagination = resp.data.paging
}

const changePage = (page: number) => getTranslationList({ pageSize: pagination.pageSize, page })
const nextPage = () => changePage(++curPage)
const prevPage = () => changePage(--curPage)

$: if (open) {
  getTranslationList()
} else {
  curPage = 1
}
</script>

<IconButtonWithDesc {desc} icon={svgIcon} bind:active={open} />
<Drawer bind:open width="360px">
  <div class="p-4 pb-6 border-b-1 static">
    <h1 class="text-3xl font-medium text-left">{desc}</h1>
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
