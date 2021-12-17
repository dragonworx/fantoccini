<style lang="scss">
@import "../theme";
.scrollview {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;

  .scrollview-row {
    display: flex;
    flex-grow: 1;

    .scrollview-content {
      flex-grow: 1;
      position: relative;
      @include linear_gradient(#272b32, #222324, 180deg);

      .scrollview-view {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: start;
        justify-content: start;

        .scrollview-view-wrapper {
          position: relative;
        }
      }

      .scrollview-view.center {
        align-items: center;
        justify-content: center;
      }
    }
  }
}

:global([data-component="scrollview"] .scrollview-view > *) {
  flex-grow: 0;
}

:global([data-component="scrollview"]
    [data-component="scrollbar"][data-direction="horizontal"]) {
  width: calc(100% - 20px) !important;
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { Direction } from "../types";
import ScrollBar, { scrollSize } from "./ScrollBar.svelte";

export let scroll: Direction | "both" = "both";
export let width: number = -1;
export let height: number = -1;
export let hScroll: number = 0;
export let vScroll: number = 0;
export let hIncrementSmall: number = 0.1;
export let hIncrementLarge: number = 0.3;
export let vIncrementSmall: number = 0.1;
export let vIncrementLarge: number = 0.3;
export let align: "origin" | "center" = "origin";

const dispatch = createEventDispatcher();

let viewWidth: number = -1;
let viewHeight: number = -1;
let contentWidth: number = -1;
let contentHeight: number = -1;

$: widthPlusScrollBars = width + scrollSize;
$: heightPlusScrollBars = height + scrollSize;
$: widthStyle =
  width > -1
    ? `width:${widthPlusScrollBars}px;max-width:${widthPlusScrollBars}px;min-width:${widthPlusScrollBars}px;`
    : ``;
$: heightStyle =
  height > -1
    ? `height:${heightPlusScrollBars}px;max-height:${heightPlusScrollBars}px;min-height:${heightPlusScrollBars}px;`
    : ``;
$: style = `${widthStyle}${heightStyle}`;

$: isHScrollEnabled = viewWidth < contentWidth;
$: isVScrollEnabled = viewHeight < contentHeight;
$: hasDimensions = viewWidth > -1;
$: hOffset =
  hasDimensions && isHScrollEnabled
    ? Math.round((contentWidth - viewWidth) * hScroll * -1)
    : 0;
$: vOffset =
  hasDimensions && isVScrollEnabled
    ? Math.round((contentHeight - viewHeight) * vScroll * -1)
    : 0;
$: viewWrapperStyle = `left:${hOffset}px;top:${vOffset}px;`;
$: hThumbSize = hasDimensions
  ? Math.max(
      scrollSize,
      (contentWidth - viewWidth) * (viewWidth / contentWidth)
    )
  : scrollSize;
$: vThumbSize = hasDimensions
  ? Math.max(
      scrollSize,
      (contentHeight - viewHeight) * (viewHeight / contentHeight)
    )
  : scrollSize;
const onVScrollChange = (e: CustomEvent) => (vScroll = e.detail);
const onHScrollChange = (e: CustomEvent) => (hScroll = e.detail);
const onMouseWheel = (e: WheelEvent) => {
  const { deltaX, deltaY } = e;
  if (deltaX < 0) {
    hScroll = Math.max(0, hScroll - hIncrementSmall);
  } else if (deltaX > 0) {
    hScroll = Math.min(1, hScroll + hIncrementSmall);
  }
  if (deltaY < 0) {
    vScroll = Math.max(0, vScroll - vIncrementSmall);
  } else if (deltaY > 0) {
    vScroll = Math.min(1, vScroll + vIncrementSmall);
  }
  e.preventDefault();
};
</script>

<div class="scrollview" data-component="scrollview" style="{style}">
  <div class="scrollview-row">
    <div class="scrollview-content">
      <div
        class="scrollview-view"
        class:center="{align === 'center'}"
        bind:clientWidth="{viewWidth}"
        bind:clientHeight="{viewHeight}"
        on:wheel="{onMouseWheel}">
        <div
          class="scrollview-view-wrapper"
          style="{viewWrapperStyle}"
          bind:clientWidth="{contentWidth}"
          bind:clientHeight="{contentHeight}">
          <slot />
        </div>
      </div>
    </div>
    {#if scroll === "vertical" || scroll === "both"}
      <ScrollBar
        isEnabled="{isVScrollEnabled}"
        direction="vertical"
        value="{vScroll}"
        thumbSize="{vThumbSize}"
        incrementSmall="{vIncrementSmall}"
        incrementLarge="{vIncrementLarge}"
        on:change="{onVScrollChange}" />
    {/if}
  </div>
  {#if scroll === "horizontal" || scroll === "both"}
    <ScrollBar
      isEnabled="{isHScrollEnabled}"
      direction="horizontal"
      value="{hScroll}"
      thumbSize="{hThumbSize}"
      incrementSmall="{hIncrementSmall}"
      incrementLarge="{hIncrementLarge}"
      on:change="{onHScrollChange}" />
  {/if}
</div>
