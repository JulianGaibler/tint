<script lang="ts">
  import Button from '@lib/components/Button.svelte'
  import IconClose from '@lib/icons/20-close.svg?raw'
  import { createEventDispatcher } from 'svelte'

  // Icon of the message box @type {string | undefined}
  export let icon: string | undefined = undefined

  // Dismissable @type {boolean}
  export let dismissable = true
  // HTML element of the container @type {HTMLDivElement | undefined}
  export let element: HTMLDivElement | undefined = undefined

  const dispatch = createEventDispatcher()
</script>

<div class="box" bind:this={element}>
  {#if icon}
    <div class="icon">{@html icon}</div>
  {/if}
  <div class="content"><slot /></div>
  {#if dismissable}
    <Button
      small
      icon
      ariaLabel="close"
      variant="ghost"
      on:click={(e) => dispatch('close', e)}
    >
      {@html IconClose}
    </Button>
  {/if}
</div>

<style lang="sass">
.box
  display: flex
  gap: tint.$size-8
  border: 2px solid var(--tint-text-secondary)
  border-radius: tint.$size-8
  padding: tint.$size-12

.icon
  color: var(--tint-text-secondary)
  line-height: 0
  width: tint.$size-32
  height: tint.$size-32
  display: flex
  align-items: center
  justify-content: center
  flex-shrink: 0

.content
  flex: 1
  color: var(--tint-text-primary)

@media (forced-colors: active)
  .box
    border-color: GrayText
    .icon
      color: GrayText
    .content
      color: ButtonText
</style>
