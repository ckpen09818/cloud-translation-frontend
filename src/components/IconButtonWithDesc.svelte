<script lang="ts">
import { Icon } from '@smui/icon-button'
import { Svg } from '@smui/common/elements'

export let icon: string
export let desc: string = ''

export let active = false

$: iconWrapCls = 'relative flex justify-center items-center border border-solid rounded-1/2 w-18 h-18'.concat(
  active ? ' border-purple-200 bg-purple-200' : ' border-gray-200 bg-gray-200',
)
</script>

<div>
  <label class="flex flex-col justify-start items-center cursor-pointer">
    <input type="checkbox" class="hidden" bind:checked={active} />
    <div class={iconWrapCls}>
      <Icon
        component={Svg}
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill={active ? '#6d28d9' : '#757575'}
        {...$$restProps}
      >
        <path d={icon} />
      </Icon>
    </div>
    <span class="mt-2 text-gray-500 select-none" class:text-purple-700={active}>{desc}</span>
  </label>
</div>
