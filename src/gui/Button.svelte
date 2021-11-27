<style lang="scss">
@import "theme";
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
    padding: 5px;
  }
}

.enabled {
  @include linearGradient(#24282f, #2f343c);
  @include buttonBorder();
}

.disabled {
  @include linearGradient(#3a424e, #566070);
  @include buttonBorder();
  border: 1px solid #323232;

  :global(&.disabled .content label) {
    color: #9c9ca3;
  }
}

.isDown {
  @include linearGradient(#2f343c, #24282f);
  @include buttonBorder(true);
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
export let isDown: boolean = false;
export let appearance: "box" | "round" = "box";
export let width: number | undefined = undefined;
export let height: number | undefined = undefined;
export let padding: number = 0;

let style = undefined;

const onMouseUp = () => {
  isDown = false;
  window.removeEventListener("mouseup", onMouseUp);
};

const onMouseDown = () => {
  if (isEnabled) {
    isDown = true;
    window.addEventListener("mouseup", onMouseUp);
  }
};

$: {
  let css = "";
  if (width) css += `width: ${width}px`;
  if (height) css += `height: ${height}px`;
  if (padding) css += `padding: ${padding}px`;
  style = css || undefined;
}
</script>

<button
  style="{style}"
  class="button {$$props.class}"
  class:enabled="{isEnabled}"
  class:disabled="{!isEnabled}"
  class:isDown
  class:round="{appearance === 'round'}"
  tabindex="{isEnabled ? 0 : undefined}"
  on:mousedown="{onMouseDown}"
  on:mousedown><div class="content"><slot /></div></button>
