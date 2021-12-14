<style lang="scss">
@import "../theme";
.scrollview {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .scrollview-row {
    display: flex;

    .scrollview-content {
    }
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { Direction } from "../types";
import ScrollBar from "./ScrollBar.svelte";

export let scroll: Direction | "both" = "both";
export let width: number = -1;
export let height: number = -1;
</script>

<div class="scrollview" data-component="scrollview">
  <div class="scrollview-row">
    <div class="scrollview-content"><slot /></div>
    {#if scroll === "vertical" || scroll === "both"}
      <ScrollBar direction="vertical" />
    {/if}
  </div>
  {#if scroll === "horizontal" || scroll === "both"}
    <ScrollBar direction="horizontal" />
  {/if}
</div>
