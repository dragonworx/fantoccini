<style lang="scss">
@import "../theme";
.tooltip {
  .tooltip-content {
    position: relative;

    .tooltip-label {
      @include linear_gradient(#43546a, #546995);
      box-sizing: border-box;
      position: absolute;
      padding: 2px 3px;
      border-radius: 3px;
      border: 1px outset #7d8390;
      box-shadow: 0px 5px 3px -3px rgba(0, 0, 0, 0.2);
    }
  }

  &[data-position="bottom"] .tooltip-label {
    margin-top: $spacing_small;
  }

  &[data-position="top"] .tooltip-label {
    margin-top: $spacing_small * -1;
  }

  &[data-position="left"] .tooltip-label {
    margin-left: $spacing_small * -1;
  }

  &[data-position="right"] .tooltip-label {
    margin-left: $spacing_small;
  }
}
</style>

<script lang="ts" context="module">
export const staticVar = 500;
</script>

<script lang="ts">
import { Position } from "../";
import Label from "./Label.svelte";

export let text: string = "foo";
export let position: Position = "bottom";

let isOpen: boolean = false;

let contentEl: HTMLDivElement;
let labelEl: HTMLDivElement;
let timeout: number;
let top: number;
let left: number;

$: {
  if (isOpen && contentEl && labelEl) {
    const contentRect = contentEl.getBoundingClientRect();
    const labelRect = labelEl.getBoundingClientRect();
    if (position === "bottom") {
      top = contentRect.height;
      left = Math.round((contentRect.width - labelRect.width) / 2);
    } else if (position === "top") {
      top = contentRect.height * -1;
      left = Math.round((contentRect.width - labelRect.width) / 2);
    } else if (position === "left") {
      top = Math.round((contentRect.height - labelRect.height) / 2);
      left = labelRect.width * -1;
    } else if (position === "right") {
      top = Math.round((contentRect.height - labelRect.height) / 2);
      left = contentRect.width;
    }
  }
}

const onMouseOver = () => {
  if (isOpen) {
    return;
  }
  timeout = setTimeout(() => (isOpen = true), 400) as unknown as number;
};

const onMouseOut = () => {
  clearTimeout(timeout);
  isOpen = false;
};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  class="tooltip"
  data-component="tooltip"
  data-position="{position}"
  on:mouseover="{onMouseOver}"
  on:mouseout="{onMouseOut}">
  <div bind:this="{contentEl}" class="tooltip-content">
    <slot />
    {#if isOpen}
      <div
        bind:this="{labelEl}"
        class="tooltip-label"
        style="{`left:${left}px;top:${top}px;`}">
        <Label text="{text}" />
      </div>
    {/if}
  </div>
</div>
