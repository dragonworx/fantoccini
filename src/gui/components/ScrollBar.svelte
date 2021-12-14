<style lang="scss">
@import "../theme";

.scrollbar {
  flex-grow: 1;
  border: 1px inset #6e6e6eb8;
  display: flex;
  border-radius: $scrollbar_radius;

  &:focus,
  &:focus-visible {
    @include focus;
  }

  &.horizontal {
    @include linear_gradient(#3c434d, #2f343c, 180deg);
    height: $scrollbar_size;
    max-height: $scrollbar_size;
    width: 100%;

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
    height: 100%;

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
    overflow: hidden;

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

    & .scrollbar-thumb:hover {
      @include button_enabled_hover;
    }

    & .scrollbar-thumb:active {
      @include button_enabled_active;
    }

    .scrollbar-track-upper,
    .scrollbar-track-lower {
      position: absolute;
      border: none;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      background-color: transparent;
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
import { isArrowKey, isScrollDownKey, isScrollUpKey } from "../filters";
import { Direction } from "../types";

const defaultSize = 20;
const dispatch = createEventDispatcher();

export let direction: Direction;
export let max: number;
export let value: number;
export let thumbSize: number = defaultSize;
export let incrementSmall: number = 0.1;
export let incrementLarge: number = 0.3;
export let size: number = -1;

const isHorizontal = direction === "horizontal";

let trackWidth: number;
let trackHeight: number;
let trackSize: number;
let dragThumbPos: number;
let dragMousedown: { x: number; y: number } = { x: 0, y: 0 };

$: style = `${isHorizontal ? "width" : "height"}:${
  size === -1 ? "100%" : `${size}px`
}`;

$: trackSize = isHorizontal ? trackWidth : trackHeight;
$: thumbPos = (trackSize - thumbSize) * value;
$: thumbStyle = isHorizontal ? `left:${thumbPos}px` : `top:${thumbPos}px`;
$: trackUpperStyle = isHorizontal
  ? `width:${thumbPos}px`
  : `height:${thumbPos}px`;
$: trackLowerStyle = isHorizontal
  ? `left:${thumbPos + thumbSize}px;width:${
      trackSize - (thumbPos + thumbSize)
    }px`
  : `top:${thumbPos + thumbSize}px;height:${
      trackSize - (thumbPos + thumbSize)
    }px`;

function setValue(newValue: number) {
  value = Math.max(0, Math.min(1, newValue));
  dispatch("change", value);
}

const onTrackUpperMouseDown = (e: MouseEvent) => {
  setValue(value - incrementSmall);
};

const onTrackLowerMouseDown = (e: MouseEvent) => {
  setValue(value + incrementSmall);
};

const onThumbMouseDown = (e: MouseEvent) => {
  const onMouseMove = (e: MouseEvent) => {
    const delta = isHorizontal
      ? e.clientX - dragMousedown.x
      : e.clientY - dragMousedown.y;
    const newThumbPos = dragThumbPos + delta;
    setValue(newThumbPos / (trackSize - thumbSize));
  };

  const onMouseUp = (e: MouseEvent) => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  dragThumbPos = thumbPos;
  dragMousedown.x = e.clientX;
  dragMousedown.y = e.clientY;
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

const onKeyDown = (e: KeyboardEvent) => {
  const { key } = e;
  if (isArrowKey(key)) {
    if (isScrollUpKey(key)) {
      setValue(value - incrementSmall);
    } else if (isScrollDownKey(key)) {
      setValue(value + incrementSmall);
    }
    e.preventDefault();
  }
};
</script>

<div
  class="scrollbar"
  class:vertical="{direction === 'vertical'}"
  class:horizontal="{direction === 'horizontal'}"
  style="{style}"
  data-component="scrollbar"
  tabindex="0"
  on:keydown="{onKeyDown}">
  <div
    bind:clientWidth="{trackWidth}"
    bind:clientHeight="{trackHeight}"
    class="scrollbar-track">
    <button
      class="scrollbar-track-upper"
      style="{trackUpperStyle}"
      tabindex="-1"
      on:mousedown="{onTrackUpperMouseDown}"></button>
    <button
      class="scrollbar-thumb"
      style="{thumbStyle}"
      tabindex="-1"
      on:mousedown="{onThumbMouseDown}"></button>
    <button
      class="scrollbar-track-lower"
      style="{trackLowerStyle}"
      tabindex="-1"
      on:mousedown="{onTrackLowerMouseDown}"></button>
  </div>
</div>
