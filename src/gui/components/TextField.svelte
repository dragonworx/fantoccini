<style lang="scss">
@import "../theme";
.textfield {
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
  border-radius: $border_radius_small;
  min-height: 27px;

  &.enabled {
    @include textfield_enabled;
  }

  &.disabled {
    @include textfield_disabled;

    input[type="text"] {
      color: #7e7e7e;
    }
  }

  input[type="text"] {
    box-sizing: border-box;
    flex-grow: 1;
    background-color: transparent;
    border-radius: 5px;
    color: $color_textfield_enabled;
    font-size: 12px;
    padding: 5px;
    border: none;
    min-width: 0;

    &::selection {
      background-color: $color_focus;
      color: white;
    }

    &:focus {
      @include focus;
    }

    &.withSlot {
      margin-right: 1px;
    }
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { isGeneralInputKey } from "../";

export let isEnabled: boolean = true;
export let value: string = "";
export let placeholder: string = "";
export let width: number = 0;
export let autofocus: boolean = false;
export let filter: (
  key: string,
  value: string,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean; cmd?: boolean }
) => boolean | undefined = undefined;

const dispatch = createEventDispatcher();

let input;

let style = "";
$: {
  if (width > 0) {
    style += `width: ${width}px;`;
  }
}

$: hasContent = $$slots.default;

function onKeyDown(e: KeyboardEvent) {
  if (filter && !isGeneralInputKey(e.key)) {
    if (
      !filter(e.key, value, {
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        cmd: e.metaKey,
      })
    ) {
      e.preventDefault();
    }
  }
}

function onKeyUp(e: KeyboardEvent) {
  const { key } = e;
  if (key === "Enter") {
    dispatch("accept", value);
    input.blur();
  } else if (key === "Escape") {
    input.blur();
  } else if (!isGeneralInputKey(key)) {
    dispatch("change", value);
  }
}

function onPaste(e: ClipboardEvent) {
  if (filter) {
    const data = e.clipboardData.getData("text");
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        if (!filter(data[i], value, {})) {
          e.preventDefault();
        }
      }
    }
  }
}
</script>

<div
  class="textfield"
  class:enabled="{isEnabled}"
  class:disabled="{!isEnabled}"
  data-component="textfield">
  <!-- svelte-ignore a11y-autofocus -->
  <input
    bind:this="{input}"
    bind:value
    class:withSlot="{hasContent}"
    style="{style}"
    disabled="{!isEnabled}"
    type="text"
    spellcheck="false"
    placeholder="{placeholder}"
    autofocus="{autofocus}"
    on:keydown
    on:keydown="{onKeyDown}"
    on:keyup
    on:keyup="{onKeyUp}"
    on:paste
    on:paste="{onPaste}"
    on:focus
    on:blur />
  {#if hasContent}
    <div class="content"><slot /></div>
  {/if}
</div>
