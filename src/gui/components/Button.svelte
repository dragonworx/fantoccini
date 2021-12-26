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
  cursor: inherit;

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
      outline: none;
    }

    &:focus:not(.noFocus) {
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

<script lang="ts" context="module">
export const defaultLongPressDuration = 500;
export type ShouldCloseHandler = () => boolean;
</script>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { isAcceptKey, isArrowKey } from "../";
import { Action } from "../action";

export let isEnabled: boolean = true;
export let canToggle: boolean = false;
export let isControlled: boolean = false;
export let hasToggleLock: boolean = false;
export let isDown: boolean = false;
export let appearance: "box" | "round" = "box";
export let width: number | undefined = undefined;
export let height: number | undefined = undefined;
export let padding: number = -1;
export let type: string = "button";
export let longPressDuration: number = defaultLongPressDuration;
export let noStyle: boolean = false;
export let customClasses: { down?: string } = {};
export let onShouldClose: ShouldCloseHandler | undefined = undefined;
export let action: Action | undefined = undefined;
export let canFocus: boolean = true;

const dispatch = createEventDispatcher();

let buttonEl: HTMLButtonElement;
let pressTimeout: number;
let isToggleDown: boolean = isDown;
let style = undefined;

$: {
  let css = "";
  if (width) css += `width: ${width}px;`;
  if (height) css += `height: ${height}px;`;
  if (padding > -1) css += `padding: ${padding}px;`;
  style = css || undefined;
}

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
    window.removeEventListener("mouseup", onMouseUp);
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

export function applyCustomDownStyle() {
  if (customClasses.down) {
    buttonEl.classList.add(customClasses.down);
  }
}

Action.notifications.on("execute", (cmd: Action) => {
  if (cmd === action) {
    if (canToggle) {
      if (isDown === isToggleDown && isDown !== cmd.isChecked) {
        setIsDown(cmd.isChecked);
      }
    } else {
      setIsDown(true);
      const onKeyUp = () => {
        setIsDown(false);
        window.removeEventListener("keyup", onKeyUp);
      };
      window.addEventListener("keyup", onKeyUp);
    }
  }
});

function down() {
  isDown = true;
  applyCustomDownStyle();
  dispatch("down");
  if (action) {
    action.execute();
  }
}

function up() {
  isDown = false;
  clearCustomClasses();
  dispatch("up");
  if (canToggle && action) {
    action.execute();
  }
}

const onMouseDown = () => {
  if (isEnabled) {
    buttonEl.focus();
    if (canToggle) {
      dispatch("push");
      if (!isDown) {
        isToggleDown = false;
        down();
      }
    } else {
      dispatch("push");
      down();
    }
    window.addEventListener("mouseup", onMouseUp);
    pressTimeout = setTimeout(() => {
      dispatch("longpress");
    }, longPressDuration) as unknown as number;
  }
};

const onMouseUp = (e: MouseEvent) => {
  if (canToggle) {
    if (isToggleDown) {
      if (isDown && !hasToggleLock) {
        const shouldClose = onShouldClose ? onShouldClose() : true;
        if (!shouldClose) {
          // console.log("should not close");
          return;
        }
        isToggleDown = false;
        up();
        dispatch("toggle", false);
        dispatch("change", false);
        if (containsEvent(e.target as Node)) {
          dispatch("click");
        }
      }
    } else {
      isToggleDown = true;
      dispatch("toggle", true);
      dispatch("change", true);
      if (containsEvent(e.target as Node)) {
        dispatch("click");
      }
    }
  } else {
    if (!isControlled) {
      up();
      if (containsEvent(e.target as Node)) {
        dispatch("click");
      }
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
      onMouseUp(e as unknown as MouseEvent);
    }
    if (e.key === "Escape") {
      buttonEl.blur();
    }
  }
};
</script>

<button
  bind:this="{buttonEl}"
  class="button"
  class:enabled="{isEnabled}"
  class:disabled="{!isEnabled}"
  class:isDown
  class:round="{appearance === 'round'}"
  class:noStyle
  class:noFocus="{!canFocus}"
  data-type="{type}"
  data-cantoggle="{canToggle}"
  tabindex="{isEnabled && canFocus ? 0 : -1}"
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
  ><div class="content" style="{style}" data-component="button-content">
    <slot />
  </div></button>
