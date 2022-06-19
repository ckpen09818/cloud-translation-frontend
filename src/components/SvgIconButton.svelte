<script lang="ts">
import IconButton, { Icon } from '@smui/icon-button'
import { Svg } from '@smui/common/elements'

export let svgIcon = ''
</script>

<IconButton on:click {...$$restProps}>
  <Icon component={Svg} viewBox="0 0 24 24">
    <slot>
      <path d={svgIcon} />
    </slot>
  </Icon>
</IconButton>
