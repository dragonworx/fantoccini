<style lang="scss">
@import "../theme";
.panel {
  @include linear_gradient(#4a4a4a, #5e5e5e);
  box-sizing: border-box;
  border-radius: $border_radius_small;
  background-color: #43546a;
  border-top: 1px solid #686868;
  border-left: 1px solid #484848;
  border-right: 1px solid #484848;
  border-bottom: 1px solid #333333;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .panel-title {
    @include linear_gradient(#49596d, #2c3038);
    box-sizing: border-box;
    padding: $spacing_small;
    border-radius: $border_radius_small;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .panel-content {
    box-sizing: border-box;
    padding: $spacing_small;
    border-radius: $border_radius_small;
    flex-grow: 1;
  }
}
</style>

<script lang="ts" context="module">
export const staticVar = 500;
</script>

<script lang="ts">
import { MenuBarItem } from "../";
import Label from "./Label.svelte";
import MenuBar from "./MenuBar.svelte";

export let title: string | undefined = undefined;
export let menuBar: MenuBarItem[] | undefined = undefined;
</script>

<div class="panel" data-component="panel">
  {#if title}
    <div class="panel-title"><Label text="{title}" /></div>
  {/if}
  {#if menuBar}
    <MenuBar items="{menuBar}" />
  {/if}
  <div class="panel-content"><slot /></div>
</div>
