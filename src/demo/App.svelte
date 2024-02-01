<script lang="ts">
  import Button from '@lib/components/Button.svelte'
  import Toggleable from '@src/lib/components/Toggleable.svelte'
  import TextField from '@src/lib/components/TextField.svelte'
  import Select from '@src/lib/components/Select.svelte'
  import SearchField from '@src/lib/components/SearchField.svelte'
  import IconHome from '@lib/icons/20-home.svg?raw'
  import Menu, {
    MENU_SEPARATOR,
    type MenuItem,
  } from '@src/lib/components/Menu.svelte'
  import MessageBox from '@src/lib/components/MessageBox.svelte'
  let option = 1

  let contextClickHandlers: ((e: Event) => void)[] = []

  function handleContextClick(e: Event | MouseEvent, i: number, j: number) {
    contextClickHandlers[j + i * 2](e)
  }

  const items: MenuItem[] = [
    {
      label: 'Item 1',
      onClick: () => console.log('Item 1'),
    },
    {
      label: 'Item 2',
      checked: true,
      onClick: () => console.log('Item 2'),
    },
    {
      label: 'Item 3',
      disabled: true,
      onClick: () => console.log('Item 3'),
    },
    MENU_SEPARATOR,
    {
      label: 'Item 4',
      items: [
        {
          label: 'Item 4.1',
          onClick: () => console.log('Item 4.1'),
        },
        {
          label: 'Item 4.2',
          onClick: () => console.log('Item 4.2'),
        },
      ],
    },
    {
      label: 'Item 5',
      onClick: () => console.log('Item 5'),
    },
  ]
</script>

<main>
  {#each [0, 1] as i}
    <div class:tint--tinted={i === 1} class="preview">
      <div class="row">
        <h1>Headline 1</h1>
        <h2>Headline 2</h2>
        <h3>Headline 3</h3>
      </div>
      <div class="row">
        <Button variant="primary">Hello!</Button>
        <Button>Hello!</Button>
        <Button variant="ghost">Hello!</Button>
        <Button disabled variant="primary">Hello!</Button>
        <Button disabled>Hello!</Button>
        <Button disabled variant="ghost">Hello!</Button>
      </div>
      <div class="row">
        <Button small variant="primary">Hello!</Button>
        <Button small>Hello!</Button>
        <Button small variant="ghost">Hello!</Button>
        <Button disabled small variant="primary">Hello!</Button>
        <Button disabled small>Hello!</Button>
        <Button disabled small variant="ghost">Hello!</Button>
      </div>
      <div class="row">
        <Button icon ariaLabel="home" variant="primary">{@html IconHome}</Button
        >
        <Button icon ariaLabel="home">{@html IconHome}</Button>
        <Button icon ariaLabel="home" variant="ghost">{@html IconHome}</Button>
        <Button disabled icon ariaLabel="home" variant="primary"
          >{@html IconHome}</Button
        >
        <Button disabled icon ariaLabel="home">{@html IconHome}</Button>
        <Button disabled icon ariaLabel="home" variant="ghost"
          >{@html IconHome}</Button
        >
      </div>
      <div class="row">
        <Button icon ariaLabel="home" small>{@html IconHome}</Button>
        <Button icon ariaLabel="home" small variant="primary"
          >{@html IconHome}</Button
        >
        <Button icon ariaLabel="home" small variant="ghost"
          >{@html IconHome}</Button
        >
        <Button disabled icon ariaLabel="home" small>{@html IconHome}</Button>
        <Button disabled icon ariaLabel="home" small variant="primary"
          >{@html IconHome}</Button
        >
        <Button disabled icon ariaLabel="home" small variant="ghost"
          >{@html IconHome}</Button
        >
      </div>
      <div class="row">
        <Toggleable id="checkbox" checked={true} />
        <Toggleable id="checkbox" checked={false} />
        <Toggleable disabled id="checkbox" checked={true} />
        <Toggleable disabled id="checkbox" checked={false} />
      </div>
      <div class="row">
        <Toggleable type="radio" id="radio" checked={true} />
        <Toggleable type="radio" id="radio" checked={true} />
        <Toggleable disabled type="radio" id="radio" checked={true} />
        <Toggleable disabled type="radio" id="radio" checked={true} />
      </div>
      <div class="row">
        <Toggleable type="switch" id="switch" checked />
        <Toggleable type="switch" id="switch" checked={false} />
        <Toggleable type="switch" disabled id="switch" checked />
        <Toggleable type="switch" disabled id="switch" checked={false} />
      </div>
      <MessageBox icon={IconHome}
        ><h2>Hello</h2>
        <p>Test test test test Test test</p></MessageBox
      >
      <div class="row">
        <TextField id="textfield" label="Label" value="Value" />
        <TextField
          id="textfield"
          label="Label"
          value=""
          helperText="Password"
        />
        <TextField
          disabled
          id="textfield"
          label="Label"
          value=""
          helperText="Password"
        />
      </div>
      <div class="row">
        <TextField id="textfield" label="Label" value="" error="Error: Don't" />
        <TextField
          disabled
          id="textfield"
          label="Label"
          value=""
          error="Error: Don't"
        />
      </div>
      <div class="row">
        <Select
          id="textfield"
          label="Label"
          value={undefined}
          items={[
            { value: 1, label: 'Option 1' },
            { value: 2, label: 'Option 2' },
            { value: 3, label: 'Option 3' },
          ]}
        />
        <Select
          id="textfield"
          label="Label"
          bind:value={option}
          error="Error: Don't"
          items={[
            { value: 1, label: 'Option 1' },
            { value: 2, label: 'Option 2' },
            { value: 3, label: 'Option 3' },
          ]}
        />
      </div>
      <div class="row">
        <SearchField id="searchfield" label="Label" value="Value" />
        <SearchField id="searchfield" label="Label" value="" />
      </div>
      <div class="row">
        <div
          class="ctxarea"
          on:contextmenu={(e) => handleContextClick(e, i, 0)}
          role="button"
          tabindex="0"
        >
          Context Menu
        </div>
        <Button on:click={(e) => handleContextClick(e, i, 1)}>Hello!</Button>
        <Menu
          variant="context"
          bind:contextClick={contextClickHandlers[0 + i * 2]}
          {items}
        />
        <Menu
          variant="button"
          bind:contextClick={contextClickHandlers[1 + i * 2]}
          {items}
        />
      </div>
    </div>
  {/each}
</main>

<style lang="sass">
main
  display: flex
  width: 100%
  box-sizing: border-box

.preview
  flex: 1
  background-color: var(--tint-bg)
  padding: 32px
  .row
    display: flex
    gap: 16px
    margin-bottom: 16px

.ctxarea
  user-select: none
  padding: 16px
  background-color: var(--tint-action-secondary-hover)
</style>
