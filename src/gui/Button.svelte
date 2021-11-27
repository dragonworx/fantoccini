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
    padding: 5px;
  }

  &:focus {
    @include focus;
  }
}

.enabled {
  @include linear_gradient(#24282f, #2f343c);
  @include button_border();

  &:hover {
    @include linear_gradient(#2f343c, #333);
  }
}

.disabled {
  @include linear_gradient(#3a424e, #566070);
  @include button_border();
  border: 1px solid #323232;

  :global(&.disabled .content label) {
    color: #9c9ca3;
  }
}

.isDown {
  @include linear_gradient(#2f343c, #24282f);
  @include button_border(true);
  box-shadow: inset 2px 2px 4px 0px rgba(0, 0, 0, 0.25);

  .content {
    position: relative;
    top: 1px;
    left: 1px;
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
export let isEnabled: boolean = true;
export let canToggle: boolean = false;
export let isDown: boolean = false;
export let appearance: "box" | "round" = "box";
export let width: number | undefined = undefined;
export let height: number | undefined = undefined;
export let padding: number = 0;
export let type: string = "button";

let style = undefined;
$: {
  let css = "";
  if (width) css += `width: ${width}px`;
  if (height) css += `height: ${height}px`;
  if (padding) css += `padding: ${padding}px`;
  style = css || undefined;
}

function onMouseUp() {
  isDown = canToggle ? isDown : false;
  window.removeEventListener("mouseup", onMouseUp);
}

function onMouseDown() {
  if (isEnabled) {
    isDown = canToggle ? !isDown : true;
    window.addEventListener("mouseup", onMouseUp);
  }
}

function onKeyDown(e: KeyboardEvent) {
  const { key } = e;
  if ((isEnabled && key === " ") || key === "Enter") {
    if (canToggle) {
      isDown = !isDown;
    } else {
      isDown = true;
      setTimeout(() => (isDown = false), 100);
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
  on:mousedown
  on:mousedown="{onMouseDown}"
  on:mouseup
  on:keydown
  on:keydown="{onKeyDown}"><div class="content"><slot /></div></button>
