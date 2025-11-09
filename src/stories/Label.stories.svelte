<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Label from '@lib/components/Label.svelte'
  import { expect } from 'storybook/test'
  import IconHome from '@lib/icons/20-home.svg?raw'

  const { Story } = defineMeta({
    title: 'Components/Label',
    component: Label,
    render: template,
    argTypes: {
      for: {
        control: 'text',
      },
      id: {
        control: 'text',
      },
      label: {
        control: 'text',
      },
      description: {
        control: 'text',
      },
      icon: {
        control: 'text',
      },
      disabled: {
        control: 'boolean',
      },
    },
  })
</script>

{#snippet template(args: any)}
  <div style="max-width: 400px;">
    <Label {...args} />
    <!-- Mock input element for demonstration -->
    <input
      type="text"
      id={args.for}
      style="margin-top: 8px; padding: 8px; border: 1px solid var(--tint-border-primary); border-radius: 4px; width: 100%;"
      disabled={args.disabled}
    />
  </div>
{/snippet}

<!-- Basic label with description -->
<Story
  name="Basic"
  args={{
    for: 'input-basic',
    id: 'label-basic',
    label: 'Email Address',
    description: 'Enter your email address to receive updates',
  }}
  play={async ({ canvas }: any) => {
    const label = canvas.getByText('Email Address')
    const description = canvas.getByText(
      'Enter your email address to receive updates',
    )

    // Check that label and description exist
    await expect(label).toBeInTheDocument()
    await expect(description).toBeInTheDocument()
  }}
/>

<!-- Label with icon -->
<Story
  name="With Icon"
  args={{
    for: 'input-icon',
    id: 'label-icon',
    label: 'Home Directory',
    icon: IconHome,
    description: 'Select your home directory path',
  }}
/>

<!-- Label only (no description) -->
<Story
  name="Label Only"
  args={{
    for: 'input-label-only',
    id: 'label-only',
    label: 'Username',
  }}
/>

<!-- Description only (no label) -->
<Story
  name="Description Only"
  args={{
    for: 'input-description-only',
    id: 'label-description-only',
    description: 'This field is optional and can be left blank',
  }}
/>

<!-- Disabled label -->
<Story
  name="Disabled"
  args={{
    for: 'input-disabled',
    id: 'label-disabled',
    label: 'Disabled Field',
    description: 'This field is currently unavailable',
    disabled: true,
  }}
  play={async ({ canvas }: any) => {
    const input = canvas.getByRole('textbox')

    // Verify input is disabled
    await expect(input).toBeDisabled()
  }}
/>

<!-- Long label text -->
<Story
  name="Long Label"
  args={{
    for: 'input-long',
    id: 'label-long',
    label:
      'This is a very long label that demonstrates how the component handles lengthy text content',
    description:
      'And this is an equally long description that provides additional context and information about what this field is used for and what kind of input is expected from the user',
  }}
/>

<!-- Label with icon and disabled -->
<Story
  name="Icon and Disabled"
  args={{
    for: 'input-icon-disabled',
    id: 'label-icon-disabled',
    label: 'Protected Setting',
    icon: IconHome,
    description: 'This setting is locked and cannot be modified',
    disabled: true,
  }}
/>
