<style lang="scss">
@import "../theme";
.scrollbar {
  flex-grow: 1;
  border: 1px inset #6e6e6eb8;
  display: flex;
  border-radius: $scrollbar_radius;

  &.horizontal {
    @include linear_gradient(#3c434d, #2f343c, 180deg);
    height: $scrollbar_size;
    max-height: $scrollbar_size;

    .scrollbar-track-upper {
      height: $scrollbar_size;
      max-height: $scrollbar_size;
    }

    .scrollbar-track-lower {
      height: $scrollbar_size;
      max-height: $scrollbar_size;
    }
  }

  &.vertical {
    @include linear_gradient(#3c434d, #2f343c, 90deg);
    width: $scrollbar_size;
    max-width: $scrollbar_size;

    .scrollbar-track-upper {
      width: $scrollbar_size;
      max-width: $scrollbar_size;
    }

    .scrollbar-track-lower {
      width: $scrollbar_size;
      max-width: $scrollbar_size;
    }
  }

  .scrollbar-track {
    flex-grow: 1;
    position: relative;

    .scrollbar-thumb {
      @include button_enabled_fill;
      @include button_border_up;
      box-sizing: border-box;
      width: $scrollbar_size;
      height: $scrollbar_size;
      border-radius: $scrollbar_radius;
      position: absolute;
      top: 0;
      left: 0;
    }

    .scrollbar-track-upper,
    .scrollbar-track-lower {
      position: absolute;
      border: none;
    }

    .scrollbar-track-upper {
    }

    .scrollbar-track-lower {
    }

    .scrollbar-track-upper:active,
    .scrollbar-track-lower:active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { Direction } from "../types";

const defaultSize = 20;

export let direction: Direction;
export let max: number;
export let value: number;
export let thumbSize: number = defaultSize;
export let size: number = -1;

let style: string;
if (size > 0) {
  $: style = `${direction === "horizontal" ? "width" : "height"}:${size}px`;
}
</script>

<div
  class="scrollbar"
  class:vertical="{direction === 'vertical'}"
  class:horizontal="{direction === 'horizontal'}"
  style="{style}"
  data-component="scrollbar">
  <div class="scrollbar-track">
    <button class="scrollbar-track-upper"></button>
    <button class="scrollbar-thumb"></button>
    <button class="scrollbar-track-lower"></button>
  </div>
</div>
