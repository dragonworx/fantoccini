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
import ScrollBar from "./ScrollBar.svelte";

export let scroll: Direction | "both" = "both";
export let width: number = -1;
export let height: number = -1;
export let align: "origin" | "center" = "origin";
</script>

<div class="scrollview" data-component="scrollview">
  <div class="scrollview-row">
    <div class="scrollview-content">
      <div class="scrollview-view" class:center="{align === 'center'}">
        <slot />
      </div>
    </div>
    {#if scroll === "vertical" || scroll === "both"}
      <ScrollBar direction="vertical" />
    {/if}
  </div>
  {#if scroll === "horizontal" || scroll === "both"}
    <ScrollBar direction="horizontal" />
  {/if}
</div>
