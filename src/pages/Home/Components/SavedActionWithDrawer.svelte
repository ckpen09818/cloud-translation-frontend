<script lang="ts">
import IconButtonWithDesc from '@/components/IconButtonWithDesc.svelte'
import Drawer from '@/components/Drawer.svelte'

import { mdiStar } from '@mdi/js'

export let open = false
</script>

<IconButtonWithDesc desc="Saved" icon={mdiStar} bind:active={open} />
<Drawer bind:open>
  <div>hehexd</div>
</Drawer>
