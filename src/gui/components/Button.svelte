<style lang="scss">
@import "../theme";
.button {
  box-sizing: border-box;
  padding: 0;
  position: relative;
  user-select: none;
  border: 1px solid #030c17;
  border-radius: $border_radius_small;
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }

  &.enabled {
    @include button_enabled_fill();
    @include button_border();

    &:hover {
      @include button_enabled_hover();
    }

    &:focus {
      @include focus;
    }

    &.isDown {
      @include button_enabled_down;

      .content {
        position: relative;
        top: 1px;
        left: 1px;
      }

      &:hover {
        @include button_enabled_hover;
      }

      &:active:not([data-cantoggle="false"]) {
        @include button_enabled_active;
      }
    }
  }

  &.disabled {
    @include button_disabled;

    :global(&.disabled .content label) {
      color: #9c9ca3;
    }

    &.isDown {
      @include button_disabled_down;
    }
  }

  :global(&.disabled img) {
    opacity: 0.3;
  }

  &.round {
    border-radius: 10000px;

    &:before {
      border-radius: 10000px;
    }
  }

  &.noStyle {
    background: none;
    border: none;
    box-shadow: none;

    &:before {
      background: none;
      border: none;
    }

    .content {
      background: none;
      border: none;
    }

    &.enabled {
      &:hover {
        background: none;
      }

      &.isDown {
        background: none;
        border: none;

        &:hover {
          background: none;
          border: none;
        }

        &:active:not([data-cantoggle="false"]) {
          background: none;
          border: none;
        }
      }
    }
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";

export let isEnabled: boolean = true;
export let canToggle: boolean = false;
export let hasToggleLock: boolean = false;
export let isDown: boolean = false;
export let appearance: "box" | "round" = "box";
export let width: number | undefined = undefined;
export let height: number | undefined = undefined;
export let padding: number = 0;
export let type: string = "button";
export let longPressDuration: number = 500;
export let noStyle: boolean = false;

let pressTimeout;

export function focus() {
  button.focus();
}

let button;

let isToggleDown: boolean = isDown;

const dispatch = createEventDispatcher();

let style = undefined;
$: {
  let css = "";
  if (width) css += `width: ${width}px;`;
  if (height) css += `height: ${height}px;`;
  if (padding) css += `padding: ${padding}px;`;
  style = css || undefined;
}

export function click() {
  onMouseDown();
}

function onChange() {
  dispatch("change", {
    isDown,
  });
}

function onMouseUp() {
  if (canToggle) {
    if (isToggleDown) {
      if (isDown && !hasToggleLock) {
        isDown = false;
      }
    } else {
      isToggleDown = true;
    }
  } else {
    isDown = false;
  }
  window.removeEventListener("mouseup", onMouseUp);
  dispatch("mouseup");
  onChange();
  clearTimeout(pressTimeout);
}

function onMouseDown() {
  if (isEnabled) {
    if (canToggle) {
      if (!isDown) {
        isDown = true;
        isToggleDown = false;
      }
    } else {
      isDown = true;
    }
    window.addEventListener("mouseup", onMouseUp);
    !canToggle && onChange();
    pressTimeout = setTimeout(() => {
      dispatch("longpress");
    }, longPressDuration);
  }
}

function onKeyDown(e: KeyboardEvent) {
  const { key } = e;
  if ((isEnabled && !isDown && key === " ") || key === "Enter") {
    onMouseDown();
  }
}

function onKeyUp(e: KeyboardEvent) {
  const { key } = e;
  if ((isEnabled && key === " ") || key === "Enter") {
    onMouseUp();
  }
}
</script>

<button
  bind:this="{button}"
  style="{style}"
  class="button"
  class:enabled="{isEnabled}"
  class:disabled="{!isEnabled}"
  class:isDown
  class:round="{appearance === 'round'}"
  class:noStyle
  data-type="{type}"
  data-cantoggle="{canToggle}"
  tabindex="{isEnabled ? 0 : -1}"
  on:change
  on:mousedown
  on:mousedown="{onMouseDown}"
  on:keydown
  on:keydown="{onKeyDown}"
  on:keyup
  on:keyup="{onKeyUp}"><div class="content"><slot /></div></button>
