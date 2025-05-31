<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import ProgressBar from '@src/lib/components/ProgressBar.svelte'

  const { Story } = defineMeta({
    title: 'Components/ProgressBar',
    component: ProgressBar,
    argTypes: {
      progress: {
        control: { type: 'range', min: 0, max: 100, step: 1 },
        description: 'Progress percentage (0-100)',
      },
      active: {
        control: 'boolean',
        description:
          'Whether the progress indicator is active (shows squiggle animation)',
      },
      showProgress: {
        control: 'boolean',
        description: 'Whether to show the progress percentage text',
      },
    },
    args: {
      progress: 75,
      active: true,
      showProgress: false,
    },
  })
</script>

<!-- Animated progress indicator with squiggly animation for active states -->
<Story name="Default" args={{ progress: 75 }}>
  {#snippet children(args: any)}
    <div style="width: 300px;">
      <ProgressBar {...args} />
    </div>
  {/snippet}
</Story>

<!-- Progress bar with progress text -->
<Story name="With Progress Text" args={{ progress: 45, showProgress: true }}>
  {#snippet children(args: any)}
    <div style="width: 300px;">
      <ProgressBar {...args} />
    </div>
  {/snippet}
</Story>

<!-- Inactive progress bar without animation -->
<Story name="Inactive" args={{ progress: 60, active: false }}>
  {#snippet children(args: any)}
    <div style="width: 300px;">
      <ProgressBar {...args} />
    </div>
  {/snippet}
</Story>

<!-- Progress bar at 100% completion -->
<Story name="Complete" args={{ progress: 100, showProgress: true }}>
  {#snippet children(args: any)}
    <div style="width: 300px;">
      <ProgressBar {...args} />
    </div>
  {/snippet}
</Story>

<!-- Progress bar with very low progress -->
<Story name="Just Started" args={{ progress: 5, showProgress: true }}>
  {#snippet children(args: any)}
    <div style="width: 300px;">
      <ProgressBar {...args} />
    </div>
  {/snippet}
</Story>

<!-- Progress bar with no progress -->
<Story name="No Progress" args={{ progress: 0, showProgress: true }}>
  {#snippet children(args: any)}
    <div style="width: 300px;">
      <ProgressBar {...args} />
    </div>
  {/snippet}
</Story>
