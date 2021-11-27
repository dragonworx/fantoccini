<style lang="scss">
@import "theme";
button {
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
}

.enabled {
  @include linear_gradient(#24282f, #2f343c);
  @include button_border();

  &:hover {
    @include linear_gradient(#2f343c, #333);
  }

  &:focus {
    @include focus;
  }

  &:active {
    @include linear_gradient(#333, #222);
  }

  &.isDown {
    @include linear_gradient(#2f343c, #24282f);
    @include button_border(true);
    box-shadow: inset 2px 2px 4px 0px rgba(0, 0, 0, 0.25);

    .content {
      position: relative;
      top: 1px;
      left: 1px;
    }
  }
}

.disabled {
  @include linear_gradient(#3a424e, #566070);
  @include button_border();
  border: 1px solid #323232;
  box-shadow: none;

  :global(&.disabled .content label) {
    color: #9c9ca3;
  }

  &.isDown {
    /* @include linear_gradient(#2f343c, #24282f); */
    @include button_border(true);
    box-shadow: inset 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
  }
}

.round {
  border-radius: 10000px;

  &:before {
    border-radius: 10000px;
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";

export let isEnabled: boolean = true;
export let canToggle: boolean = false;
export let isDown: boolean = false;
export let appearance: "box" | "round" = "box";
export let width: number | undefined = undefined;
export let height: number | undefined = undefined;
export let padding: number = 0;
export let type: string = "button";

let isToggleDown: boolean = isDown;

const dispatch = createEventDispatcher();

let style = undefined;
$: {
  let css = "";
  if (width) css += `width: ${width}px`;
  if (height) css += `height: ${height}px`;
  if (padding) css += `padding: ${padding}px`;
  style = css || undefined;
}

function onChange() {
  dispatch("change", {
    isDown,
  });
}

function onMouseUp() {
  if (canToggle) {
    if (isToggleDown) {
      if (isDown) {
        isDown = false;
      }
    } else {
      isToggleDown = true;
    }
  } else {
    isDown = false;
  }
  window.removeEventListener("mouseup", onMouseUp);
  onChange();
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
  }
}

function onKeyDown(e: KeyboardEvent) {
  const { key } = e;
  if ((isEnabled && key === " ") || key === "Enter") {
    if (canToggle) {
      isDown = !isDown;
      onChange();
    } else {
      isDown = true;
      onChange();
      setTimeout(() => {
        isDown = false;
        onChange();
      }, 100);
    }
  }
}
</script>

<button
  style="{style}"
  class:enabled="{isEnabled}"
  class:disabled="{!isEnabled}"
  class:isDown
  class:round="{appearance === 'round'}"
  data-type="{type}"
  tabindex="{isEnabled ? 0 : undefined}"
  on:change
  on:mousedown
  on:mousedown="{onMouseDown}"
  on:mouseup
  on:keydown
  on:keydown="{onKeyDown}"><div class="content"><slot /></div></button>
