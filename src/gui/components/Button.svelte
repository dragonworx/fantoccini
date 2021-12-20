<style lang="scss">
@import "../theme";

:global([data-component="button-content"]) {
  padding: $spacing_small;
}

:global([data-component="button-content"] > *) {
  margin-right: $spacing_small;
}

:global([data-component="button-content"] > *:last-child) {
  margin-right: 0;
}

.button {
  @include noselect();
  box-sizing: border-box;
  padding: 0;
  position: relative;
  border: 1px solid #030c17;
  border-radius: $border_radius_small;
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);

  & .content {
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
      border: none !important;
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
        box-shadow: none;

        .content {
          top: 0;
          left: 0;
        }

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

<script context="module">
export const defaultLongPressDuration = 500;
</script>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { isAcceptKey, isArrowKey } from "../filters";
export let isEnabled: boolean = true;
export let canToggle: boolean = false;
export let isControlled: boolean = false;
export let hasToggleLock: boolean = false;
export let isDown: boolean = false;
export let appearance: "box" | "round" = "box";
export let width: number | undefined = undefined;
export let height: number | undefined = undefined;
export let padding: number = 0;
export let type: string = "button";
export let longPressDuration: number = defaultLongPressDuration;
export let noStyle: boolean = false;
export let customClasses: { down?: string } = {};

export function focus() {
  buttonEl.focus();
}

export function blur() {
  buttonEl.blur();
}

export function click() {
  onMouseDown();
}

export function containsEvent(node: Node) {
  return buttonEl.contains(node);
}

export function setIsDown(value: boolean) {
  isDown = value;
  isToggleDown = value;
  if (value === false) {
    clearCustomClasses();
  } else {
    applyCustomDownStyle();
    buttonEl.focus();
  }
}

export function getIsDown() {
  return {
    isDown,
    isToggleDown,
  };
}

export function clearCustomClasses() {
  if (customClasses.down) {
    buttonEl.classList.remove(customClasses.down);
  }
}

const dispatch = createEventDispatcher();

let buttonEl: HTMLButtonElement;
let pressTimeout: number;
let isToggleDown: boolean = isDown;
let style = undefined;

$: {
  let css = "";
  if (width) css += `width: ${width}px;`;
  if (height) css += `height: ${height}px;`;
  if (padding) css += `padding: ${padding}px;`;
  style = css || undefined;
}

export function applyCustomDownStyle() {
  if (customClasses.down) {
    buttonEl.classList.add(customClasses.down);
  }
}

function down() {
  isDown = true;
  applyCustomDownStyle();
  dispatch("down");
}

function up() {
  isDown = false;
  clearCustomClasses();
  dispatch("up");
}

const onMouseDown = () => {
  if (isEnabled) {
    buttonEl.focus();
    if (canToggle) {
      dispatch("pushed");
      if (!isDown) {
        isToggleDown = false;
        down();
      }
    } else {
      dispatch("pushed");
      down();
    }
    window.addEventListener("mouseup", onMouseUp);
    pressTimeout = setTimeout(() => {
      dispatch("longpress");
    }, longPressDuration) as unknown as number;
  }
};

const onMouseUp = () => {
  if (canToggle) {
    if (isToggleDown) {
      if (isDown && !hasToggleLock) {
        isToggleDown = false;
        up();
        dispatch("toggle", false);
        dispatch("change", false);
      }
    } else {
      isToggleDown = true;
      dispatch("toggle", true);
      dispatch("change", true);
    }
  } else {
    if (!isControlled) {
      up();
    }
  }
  window.removeEventListener("mouseup", onMouseUp);
  dispatch("mouseup");
  clearTimeout(pressTimeout);
};

const onKeyDown = (e: KeyboardEvent) => {
  if (isEnabled) {
    const { key } = e;
    if (!isDown && isAcceptKey(key)) {
      onMouseDown();
    }
    if (isAcceptKey(key) || isArrowKey(key)) {
      e.preventDefault();
    }
  }
};

const onKeyUp = (e: KeyboardEvent) => {
  if (isEnabled) {
    const { key } = e;
    if (isAcceptKey(key)) {
      onMouseUp();
    }
    if (e.key === "Escape") {
      buttonEl.blur();
    }
  }
};
</script>

<button
  bind:this="{buttonEl}"
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
  data-component="button"
  on:change
  on:mousedown
  on:mousedown="{onMouseDown}"
  on:mouseover
  on:mouseout
  on:focus
  on:blur
  on:keydown
  on:keydown="{onKeyDown}"
  on:keyup
  on:keyup="{onKeyUp}"
  ><div class="content" data-component="button-content"><slot /></div></button>
