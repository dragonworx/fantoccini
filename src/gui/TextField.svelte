<style lang="scss">
@import "theme";
div {
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
  border-radius: $border_radius_small;

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
    border: 1px inset #818181;
    color: $color_textfield_enabled;
    font-size: 12px;
    padding: 5px;

    &::selection {
      background-color: $color_focus;
      color: white;
    }

    &:focus {
      @include focus;
    }

    &.withSlot {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
export let isEnabled: boolean = true;
export let value: string = "";
export let placeholder: string = "";
export let width: number = 0;
export let filter: (key: string, value: string) => boolean | undefined =
  undefined;

const dispatch = createEventDispatcher();

let input;

let style = "";
$: {
  if (width > 0) {
    style += `width: ${width}px;`;
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (filter) {
    if (!filter(e.key, value)) {
      e.preventDefault();
    }
  }
}

function onKeyUp(e: KeyboardEvent) {
  if (e.key === "Enter") {
    dispatch("accept", {
      value,
    });
    input.blur();
  } else if (e.key === "Escape") {
    input.blur();
  }
}

function onPaste(e: ClipboardEvent) {
  if (filter) {
    const data = e.clipboardData.getData("text");
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        if (!filter(data[i], value)) {
          e.preventDefault();
        }
      }
    }
  }
}
</script>

<div class:enabled="{isEnabled}" class:disabled="{!isEnabled}">
  <input
    bind:this="{input}"
    bind:value
    class:withSlot="{$$slots.default}"
    style="{style}"
    disabled="{!isEnabled}"
    type="text"
    spellcheck="false"
    placeholder="{placeholder}"
    on:keydown
    on:keydown="{onKeyDown}"
    on:keyup
    on:keyup="{onKeyUp}"
    on:paste
    on:paste="{onPaste}"
    on:focus
    on:blur /><slot />
</div>
