<script lang="ts">
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let value: string = ''
export let cols = 30
export let rows = 3
export let disabled = false
export let placeholder = ''
let textareaElem: HTMLTextAreaElement

function resizeTextarea() {
  textareaElem.style.height = 'auto'
  textareaElem.style.height = textareaElem.scrollHeight + 'px'
}

function onInput(e) {
  resizeTextarea()
  dispatch('input', e)
}
</script>

<div class="wrapper border-1 border-gray-700 border-solid rounded-md ">
  <div class="py-5 pl-6 pr-10 relative">
    <textarea
      bind:this={textareaElem}
      class="textarea w-full text-lg"
      bind:value
      {cols}
      {rows}
      {disabled}
      {placeholder}
      {...$$restProps}
      on:input={onInput}
      on:change
    />
    <div class="absolute top-2 right-6">
      <div class="w-8 h-8">
        <slot name="corner" />
      </div>
    </div>
  </div>
  <slot name="extra" />
</div>

<style>
.textarea {
  resize: none;
  overflow: hidden;
  border: none;
  overflow: auto;
  outline: none;
}
</style>
