<script lang="ts">
import IconButtonWithDesc from '@/components/IconButtonWithDesc.svelte'
import Drawer from '@/components/Drawer.svelte'

import { mdiHistory } from '@mdi/js'

export let open = false
</script>

<IconButtonWithDesc desc="History" icon={mdiHistory} bind:active={open} />
<Drawer bind:open>
  <div>hehexd</div>
</Drawer>
