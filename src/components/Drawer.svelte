<script lang="ts">
import { fly, fade } from 'svelte/transition'

export let open = false
export let width = '600px'
export let height = '100%'

function handleClickAway() {
  open = false
}
</script>

{#if open}
  <div class="drawer-container">
    {#if open}
      <div class="overlay" transition:fade on:click={handleClickAway} />
    {/if}
    <div class="drawer" style={`--width:${width}; height:${height};`} transition:fly={{ x: 200, duration: 500 }}>
      <slot />
    </div>
  </div>
{/if}

<style>
.drawer-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
}

.overlay {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  opacity: 1;
  z-index: 0;
}

.drawer {
  position: absolute;
  top: 0;
  right: 0;
  background: white;
  overflow: hidden;
  width: var(--width);
  height: var(--height);
  z-index: 1;
}
</style>
