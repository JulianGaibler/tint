<script context="module" lang="ts">
  import MessageBox from '@src/lib/components/MessageBox.svelte'

  export const meta = {
    title: 'Components/MessageBox',
    component: MessageBox,
    argTypes: {
      dismissable: {
        control: 'boolean',
        defaultValue: true,
      },
      icon: {
        control: 'text',
      },
    },
  }
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import IconHome from '@lib/icons/20-home.svg?raw'
</script>

<Template let:args>
  <MessageBox {...args} on:close>
    <h2>Title</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
      consectetur, nisl ut aliquam ultricies, nunc nisl aliquet sapien, eget
      aliquam nunc nisi quis nunc. Nulla facilisi.
    </p>
  </MessageBox>
</Template>

<Story name="Default" args={{ icon: IconHome, dismissable: true }} />

<Story name="Not dismissable" args={{ icon: IconHome, dismissable: false }} />

<Story name="No icon" args={{ icon: undefined, dismissable: true }} />
